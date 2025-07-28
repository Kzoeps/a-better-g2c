"use client";
import {
    AlertCircle,
    CheckCircle,
    Clock,
    DollarSign,
    ExternalLink,
    FileText,
    Phone,
    Users,
    Eye,
    Sparkles,
    ArrowLeft,
    Grid3X3,
} from "lucide-react";
import Link from "next/link";
import React, { useMemo, useState } from "react";

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

// Props interfaces
interface ServiceRendererProps {
    htmlContent: string;
    serviceName?: string;
    serviceLink?: string;
    onGoBack?: () => void;
}

// React Component for rendering parsed service
const ServiceRenderer: React.FC<ServiceRendererProps> = ({
    htmlContent,
    serviceName = "Government Service",
    serviceLink,
    onGoBack,
}) => {
    const [showOriginal, setShowOriginal] = useState(false);
    const parser = useMemo(() => new ServiceParser(), []);

    const parsedData = useMemo(() => {
        if (!htmlContent) return null;
        return parser.parse(htmlContent);
    }, [htmlContent, parser]);

    const toggleOriginal = () => {
        setShowOriginal(!showOriginal);
    };

    if (!parsedData) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                        <p className="text-yellow-800">
                            No service data provided
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const { sections, contactInfo, links } = parsedData;

    const renderSection = (
        key: string,
        sectionData: SectionData[]
    ): React.ReactNode => {
        const config = parser.getSectionConfig(key);
        const IconComponent = config.icon;

        return (
            <div key={key} className="border-b border-gray-100">
                <div className="p-4">
                    <div className="flex items-center mb-3">
                        <div className="p-2 rounded-lg bg-gray-100 mr-3">
                            <IconComponent className="h-5 w-5 text-gray-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 text-md capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                        </h3>
                    </div>
                    <div className="pl-10">
                        {sectionData.map((section, idx) => (
                            <div
                                key={idx}
                                className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
                            >
                                <div className="whitespace-pre-line">
                                    {section.content}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    const renderTopNavigation = (): React.ReactNode => {
        return (
            <div className="bg-blue-600 text-white sticky top-0 z-20">
                <div className="p-4">
                    <div className="flex items-center">
                        <button
                            onClick={onGoBack}
                            className="inline-flex items-center text-white hover:text-blue-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded-md p-1 mr-3"
                        >
                            <ArrowLeft className="h-5 w-5 mr-1" />
                            <span className="text-sm font-medium">Back</span>
                        </button>
                        <div className="flex items-center text-blue-100">
                            <Grid3X3 className="h-4 w-4 mr-2" />
                            <span className="text-sm">Service Categories</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderServiceName = (): React.ReactNode => {
        const displayName = serviceName;

        return (
            <div className="bg-white shadow-sm border-b border-gray-200 sticky top-16 z-10">
                <div className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">
                                {displayName}
                            </h1>
                            <p className="text-sm text-gray-600 mt-1">
                                Government of Bhutan Digital Service
                            </p>
                        </div>
                        <button
                            onClick={toggleOriginal}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            {showOriginal ? (
                                <>
                                    <Sparkles className="h-4 w-4 mr-2" />
                                    Beautify
                                </>
                            ) : (
                                <>
                                    <Eye className="h-4 w-4 mr-2" />
                                    Original
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const renderContactCard = (): React.ReactNode | null => {
        if (
            !contactInfo.phones.length &&
            !contactInfo.emails.length &&
            !contactInfo.addresses.length
        ) {
            return null;
        }

        return (
            <div className="border-b border-gray-100">
                <div className="p-4">
                    <div className="flex items-center mb-3">
                        <div className="p-2 rounded-lg bg-gray-100 mr-3">
                            <Phone className="h-5 w-5 text-gray-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 text-md">
                            Contact Information
                        </h3>
                    </div>
                    <div className="pl-10 space-y-3">
                        {contactInfo.phones.length > 0 && (
                            <div>
                                <h4 className="font-medium text-sm text-gray-800 mb-1">
                                    Phone
                                </h4>
                                {contactInfo.phones.map((phone, idx) => (
                                    <p
                                        key={idx}
                                        className="text-gray-600 text-sm"
                                    >
                                        {phone}
                                    </p>
                                ))}
                            </div>
                        )}
                        {contactInfo.emails.length > 0 && (
                            <div>
                                <h4 className="font-medium text-sm text-gray-800 mb-1">
                                    Email
                                </h4>
                                {contactInfo.emails.map((email, idx) => (
                                    <p
                                        key={idx}
                                        className="text-gray-600 text-sm"
                                    >
                                        {email}
                                    </p>
                                ))}
                            </div>
                        )}
                        {contactInfo.addresses.length > 0 && (
                            <div>
                                <h4 className="font-medium text-sm text-gray-800 mb-1">
                                    Address
                                </h4>
                                {contactInfo.addresses.map((address, idx) => (
                                    <p
                                        key={idx}
                                        className="text-gray-600 text-sm"
                                    >
                                        {address}
                                    </p>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };
    const renderLinks = (): React.ReactNode | null => {
        if (!links.length || !serviceLink) return null;

        return (
            <div className="p-4 border-b border-gray-100 max-w-[250px]">
                <div className="flex items-center mb-3">
                    <div className="p-2 rounded-lg bg-gray-100 mr-3">
                        <ExternalLink className="h-5 w-5 text-gray-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 text-md">
                        Related Links
                    </h3>
                </div>
                <div className="pl-10 space-y-2 min-w-0">
                    {links.map((link) => (
                        <div key={link} className="min-w-0">
                            <a
                                href={serviceLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 min-w-0 w-full"
                            >
                                <span className="truncate flex-1 min-w-0">
                                    {link}
                                </span>
                                <ExternalLink className="h-4 w-4 ml-1 flex-shrink-0" />
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderAccessService = (serviceLink?: string) => {
        if (!serviceLink) return null;

        return (
            <Link
                href={serviceLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
            >
                <div className="p-4 hover:bg-gray-100 transition rounded-md border-b border-gray-100 cursor-pointer">
                    <div className="flex items-center">
                        <div className="p-2 rounded-lg bg-gray-100 mr-3">
                            <ExternalLink className="h-5 w-5 text-gray-600" />
                        </div>
                        <div className="flex flex-col">
                            <h3 className="text-md font-semibold text-gray-900">
                                Access Service
                            </h3>
                            <span className="text-sm text-blue-600 hover:underline inline-flex items-center">
                                Go to Service
                                <ExternalLink className="h-4 w-4 ml-1" />
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        );
    };

    const sortedSections = Object.entries(sections)
        .filter(([key]) => key !== "serviceName")
        .sort(([keyA], [keyB]) => {
            const priorityA = parser.getSectionConfig(keyA).priority;
            const priorityB = parser.getSectionConfig(keyB).priority;
            return priorityA - priorityB;
        });

    // If showing original, render the raw HTML content
    if (showOriginal) {
        return (
            <div className="max-w-md mx-auto bg-gray-50 min-h-screen">
                {renderServiceName()}
                {renderAccessService(serviceLink)}
                <Link href={"/"}>Go to service</Link>
                <div className="p-6">
                    <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                </div>
            </div>
        );
    }

    // Otherwise render the parsed/beautified version
    return (
        <div className="max-w-md mx-auto bg-gray-50 min-h-screen">
            {renderServiceName()}
            {renderAccessService(serviceLink)}
            <div className="bg-white divide-y divide-gray-200">
                {renderLinks()}
                {renderContactCard()}
                {sortedSections.map(([key, sectionData]) =>
                    renderSection(key, sectionData)
                )}
            </div>
        </div>
    );
};

export { ServiceParser, ServiceRenderer };
export type { ContactInfo, ParsedServiceData, SectionData };
