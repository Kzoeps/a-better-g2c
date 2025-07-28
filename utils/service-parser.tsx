"use client";
import {
    CheckCircle,
    Clock,
    DollarSign,
    ExternalLink,
    FileText,
    Phone,
    Users
} from "lucide-react";
import React from "react";

// Types for the parsed service data
interface SectionData {
    header: string;
    content: string;
}

interface ContactInfo {
    phones: string[];
    emails: string[];
    addresses: string[];
}

interface ParsedServiceData {
    sections: Record<string, SectionData[]>;
    contactInfo: ContactInfo;
    links: string[];
    rawText: string;
}

interface SectionPattern {
    key: string;
    patterns: RegExp[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: React.ComponentType<any>;
    priority: number;
}

// Generic Service Parser Class
class ServiceParser {
    private sectionPatterns: SectionPattern[];
    private phonePattern: RegExp;
    private emailPattern: RegExp;
    private urlPattern: RegExp;

    constructor() {
        // Section patterns based on analysis (in priority order)
        this.sectionPatterns = [
            {
                key: "serviceName",
                patterns: [/SERVICE\s*NAME\s*:?\s*/gi],
                icon: FileText,
                priority: 1,
            },
            {
                key: "description",
                patterns: [
                    /BRIEF\s*DESCRIPTION\s*:?\s*/gi,
                    /DESCRIPTION\s*:?\s*/gi,
                ],
                icon: FileText,
                priority: 2,
            },
            {
                key: "eligibility",
                patterns: [/ELIGIBILITY\s*:?\s*/gi],
                icon: Users,
                priority: 3,
            },
            {
                key: "checklist",
                patterns: [
                    /CHECKLIST\s*:?\s*/gi,
                    /REQUIRED\s*DOCUMENTS?\s*:?\s*/gi,
                ],
                icon: CheckCircle,
                priority: 4,
            },
            {
                key: "procedure",
                patterns: [/PROCEDURE\s*:?\s*/gi, /HOW\s*TO\s*APPLY\s*:?\s*/gi],
                icon: Clock,
                priority: 5,
            },
            {
                key: "fees",
                patterns: [/FEES?\s*:?\s*/gi, /FEE\s*:?\s*/gi],
                icon: DollarSign,
                priority: 6,
            },
            {
                key: "contact",
                patterns: [
                    /CONTACT\s*INFORMATION\s*:?\s*/gi,
                    /CONTACT\s*:?\s*/gi,
                ],
                icon: Phone,
                priority: 7,
            },
            {
                key: "service",
                patterns: [/SERVICE\s*YOU\s*CAN\s*AVAIL\s*:?\s*/gi],
                icon: ExternalLink,
                priority: 8,
            },
        ];

        this.phonePattern =
            /(\+?975[-\s]?\d{1,2}[-\s]?\d{6,7}|\d{2,3}[-\s]?\d{6,7})/g;
        this.emailPattern = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
        this.urlPattern = /(https?:\/\/[^\s<>"]+)/gi;
    }

    parse(htmlContent: string): ParsedServiceData {
        // Create DOM parser
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, "text/html");

        // Get clean text while preserving some structure
        const cleanText = this.extractStructuredText(doc);

        // Extract sections
        const sections = this.extractSections(cleanText);

        // Extract contact information
        const contactInfo = this.extractContactInfo(cleanText);

        // Extract links
        const links = this.extractLinks(cleanText);

        return {
            sections,
            contactInfo,
            links,
            rawText: cleanText,
        };
    }

    private extractStructuredText(doc: Document): string {
        // Remove script and style elements
        const scripts = doc.querySelectorAll("script, style");
        scripts.forEach((el) => el.remove());

        // Process text while preserving list structure
        let text = "";

        const processNode = (node: Node, depth: number = 0): void => {
            if (node.nodeType === Node.TEXT_NODE) {
                const content = node.textContent?.trim();
                if (content) {
                    text += content + " ";
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node as Element;
                const tagName = element.tagName.toLowerCase();

                // Add line breaks for block elements
                if (
                    [
                        "p",
                        "div",
                        "br",
                        "li",
                        "h1",
                        "h2",
                        "h3",
                        "h4",
                        "h5",
                        "h6",
                    ].includes(tagName)
                ) {
                    if (tagName === "li") {
                        text += "\n• ";
                    } else if (tagName === "br") {
                        text += "\n";
                    } else {
                        text += "\n";
                    }
                }

                // Process child nodes
                for (const child of node.childNodes) {
                    processNode(child, depth + 1);
                }

                // Add line break after block elements
                if (
                    [
                        "p",
                        "div",
                        "li",
                        "h1",
                        "h2",
                        "h3",
                        "h4",
                        "h5",
                        "h6",
                    ].includes(tagName)
                ) {
                    text += "\n";
                }
            }
        };

        processNode(doc.body || doc);

        return text.replace(/\n\s*\n/g, "\n").trim();
    }

    private extractSections(text: string): Record<string, SectionData[]> {
        const sections: Record<string, SectionData[]> = {};

        // Find all section headers and their positions
        const sectionPositions: Array<{
            key: string;
            start: number;
            end: number;
            header: string;
        }> = [];

        this.sectionPatterns.forEach(({ key, patterns }) => {
            patterns.forEach((pattern) => {
                let match: RegExpExecArray | null;
                const regex = new RegExp(pattern.source, pattern.flags);
                while ((match = regex.exec(text)) !== null) {
                    sectionPositions.push({
                        key,
                        start: match.index,
                        end: match.index + match[0].length,
                        header: match[0].trim(),
                    });
                }
            });
        });

        // Sort by position
        sectionPositions.sort((a, b) => a.start - b.start);

        // Extract content between sections
        for (let i = 0; i < sectionPositions.length; i++) {
            const current = sectionPositions[i];
            const next = sectionPositions[i + 1];

            const startPos = current.end;
            const endPos = next ? next.start : text.length;

            let content = text.substring(startPos, endPos).trim();

            // Clean up content
            content = this.cleanContent(content);

            if (content) {
                if (!sections[current.key]) {
                    sections[current.key] = [];
                }
                sections[current.key].push({
                    header: current.header,
                    content: content,
                });
            }
        }

        // Merge multiple entries of same section
        Object.keys(sections).forEach((key) => {
            if (sections[key].length > 1) {
                sections[key] = [
                    {
                        header: sections[key][0].header,
                        content: sections[key]
                            .map((s) => s.content)
                            .join("\n\n"),
                    },
                ];
            }
        });

        return sections;
    }

    private cleanContent(content: string): string {
        return content
            .replace(/\n\s*\n/g, "\n")
            .replace(/^\s*[•\-\*]\s*/gm, "• ")
            .replace(/^\s*\d+\.\s*/gm, (match) => {
                const num = match.match(/\d+/)?.[0];
                return `${num}. `;
            })
            .trim();
    }

    private extractContactInfo(text: string): ContactInfo {
        const phones = [...text.matchAll(this.phonePattern)].map((m) =>
            m[0].trim()
        );
        const emails = [...text.matchAll(this.emailPattern)].map((m) =>
            m[0].trim()
        );

        // Extract addresses (basic heuristic)
        const addressKeywords = [
            "thimphu",
            "phuentsholing",
            "paro",
            "punakha",
            "wangdue",
            "trongsa",
            "bumthang",
            "mongar",
            "lhuentse",
            "trashigang",
            "samdrup jongkhar",
            "pemagatshel",
            "trashiyangtse",
            "gasa",
            "zhemgang",
            "sarpang",
            "tsirang",
            "dagana",
            "samtse",
            "chukha",
            "haa",
        ];
        const addresses: string[] = [];

        const lines = text.split("\n");
        lines.forEach((line) => {
            const lowerLine = line.toLowerCase();
            if (
                addressKeywords.some((keyword) =>
                    lowerLine.includes(keyword)
                ) &&
                line.trim().length > 10
            ) {
                addresses.push(line.trim());
            }
        });

        return {
            phones: [...new Set(phones)],
            emails: [...new Set(emails)],
            addresses: [...new Set(addresses)],
        };
    }

    private extractLinks(text: string): string[] {
        const matches = [...text.matchAll(this.urlPattern)];
        return [...new Set(matches.map((m) => m[0]))];
    }

    getSectionConfig(key: string): SectionPattern {
        return (
            this.sectionPatterns.find((p) => p.key === key) || {
                key,
                patterns: [],
                icon: FileText,
                priority: 999,
            }
        );
    }
}

export { ServiceParser };
export type { ContactInfo, ParsedServiceData, SectionData };

