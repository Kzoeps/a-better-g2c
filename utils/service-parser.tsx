"use client";
import React, { useState, useMemo } from "react";
import {
    ExternalLink,
    Phone,
    Mail,
    MapPin,
    DollarSign,
    FileText,
    CheckCircle,
    Users,
    Clock,
    AlertCircle,
} from "lucide-react";

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
}

// React Component for rendering parsed service
const ServiceRenderer: React.FC<ServiceRendererProps> = ({
    htmlContent,
    serviceName = "Government Service",
}) => {
    const parser = useMemo(() => new ServiceParser(), []);

    const parsedData = useMemo(() => {
        if (!htmlContent) return null;
        return parser.parse(htmlContent);
    }, [htmlContent, parser]);

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

    const renderServiceName = (): React.ReactNode => {
        const serviceNameSection = sections.serviceName?.[0];
        const displayName = serviceNameSection?.content || serviceName;

        return (
            <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
                <div className="p-4">
                    <h1 className="text-xl font-bold text-gray-900">
                        {displayName}
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Government of Bhutan Digital Service
                    </p>
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
                                    <p key={idx} className="text-gray-600 text-sm">
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
                                    <p key={idx} className="text-gray-600 text-sm">
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
                                    <p key={idx} className="text-gray-600 text-sm">
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
        if (!links.length) return null;

        return (
            <div className="p-4 border-b border-gray-100">
                <div className="flex items-center mb-3">
                    <div className="p-2 rounded-lg bg-gray-100 mr-3">
                        <ExternalLink className="h-5 w-5 text-gray-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 text-md">
                        Apply Online
                    </h3>
                </div>
                <div className="pl-10">
                    {links.map((link, idx) => (
                        <a
                            key={idx}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                        >
                            Access Service
                            <ExternalLink className="h-4 w-4 ml-1" />
                        </a>
                    ))}
                </div>
            </div>
        );
    };

    const sortedSections = Object.entries(sections)
        .filter(([key]) => key !== "serviceName")
        .sort(([keyA], [keyB]) => {
            const priorityA = parser.getSectionConfig(keyA).priority;
            const priorityB = parser.getSectionConfig(keyB).priority;
            return priorityA - priorityB;
        });

    return (
        <div className="max-w-md mx-auto bg-gray-50 min-h-screen">
            {renderServiceName()}
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

// Demo Component with sample data
// const ServiceParserDemo: React.FC = () => {
//     const [htmlInput, setHtmlInput] = useState<string>("");

//     // Sample HTML from the original example
//     const sampleHtml = `<p><span style="letter-spacing: 0.0178571em; text-align: var(--bs-body-text-align);"><b style=""><font face="Times New Roman" style="" size="4" color="#000000">SERVICE NAME:</font><font size="4" face="Times New Roman"><span style="color: var(--bs-modal-color); background-color: rgb(0, 141, 201);"> </span><span style="background-color: rgb(0, 141, 201);"><font color="#ffffff" style="">Apply for English Proficiency Language Certificate</font></span></font></b></span></p><p><b><font size="3" face="Times New Roman" color="#0a0000">BRIEF DESCRIPTION:</font></b></p><p></p><ol><li><font face="Times New Roman"><font size="3">&nbsp;<font color="#050000">Language Proficiency Certificate :</font></font><font color="#050000">&nbsp;</font></font></li></ol><font face="Times New Roman" color="#050000"><font style="background-color: transparent; font-weight: var(--bs-body-font-weight); text-align: var(--bs-body-text-align); letter-spacing: 0.0178571em;"><ul><li><font style="background-color: transparent; font-weight: var(--bs-body-font-weight); text-align: var(--bs-body-text-align); letter-spacing: 0.0178571em;">&nbsp;</font><span style="background-color: transparent; font-weight: var(--bs-body-font-weight); text-align: var(--bs-body-text-align); letter-spacing: 0.0178571em;"><font size="3">English Language Proficiency Certificate is issued to those students who have successfully completed their class X or XII from schools affiliated with BCSEA or any other board recognised by the BCSEA.</font></span></li></ul></font><font size="3"><b>REQUIRED DOCUMENT(CHECKLIST):</b></font></font><p></p><ol><li><font face="Times New Roman" size="3" color="#050000">Personal Details</font></li><li><font face="Times New Roman" size="3" color="#050000">Student Detail and Document Selection</font></li><li><font face="Times New Roman" size="3" color="#050000">Other information</font></li></ol><font size="3" face="Times New Roman" color="#050000"><b>Service you can avail from:</b></font><p><font face="Times New Roman" size="3" color="#050000"><a href="https://www.citizenservices.gov.bt/Bcsea/public/index" target="_blank">https://www.citizenservices.gov.bt/Bcsea/public/index</a><br></font></p><p><font face="Times New Roman" size="3" color="#050000"><b style="background-color: transparent; text-align: var(--bs-body-text-align); letter-spacing: 0.0178571em;">CONTACT INFORMATION:</b><br></font></p><p><font face="Times New Roman" style="background-color: rgb(255, 255, 255);" color="#050000"><font size="3"><span style="letter-spacing: normal;">Bhutan Council for School Examinations and Assessment</span><br><span style="letter-spacing: normal;">Kawajangsa, Thimphu</span></font><br><span style="letter-spacing: normal;"><font size="3" style="">Post Box No. 156</font></span></font></p><p><font face="Times New Roman" color="#050000"><font size="3">Phone: 975-02-322347</font></p><p><font face="Times New Roman" color="#050000">Email: info@bcsea.gov.bt</font></p>`;

//     return (
//         <div className="min-h-screen bg-gray-100">
//             <div className="container mx-auto p-6">
//                 <div className="mb-8">
//                     <h1 className="text-3xl font-bold text-gray-900 mb-4">
//                         Service Parser Demo
//                     </h1>

//                     <div className="bg-white rounded-lg shadow p-6 mb-6">
//                         <h2 className="text-xl font-semibold mb-4">
//                             Test with HTML Input
//                         </h2>

//                         <textarea
//                             value={htmlInput}
//                             onChange={(e) => setHtmlInput(e.target.value)}
//                             placeholder="Paste your service HTML here..."
//                             className="w-full h-32 p-3 border border-gray-300 rounded-md resize-none"
//                         />

//                         <div className="mt-4 flex gap-4">
//                             <button
//                                 onClick={() => setHtmlInput(sampleHtml)}
//                                 className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//                             >
//                                 Load Sample Data
//                             </button>
//                             <button
//                                 onClick={() => setHtmlInput("")}
//                                 className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
//                             >
//                                 Clear
//                             </button>
//                         </div>
//                     </div>
//                 </div>

//                 {htmlInput && (
//                     <ServiceRenderer
//                         htmlContent={htmlInput}
//                         serviceName="Test Service"
//                     />
//                 )}
//             </div>
//         </div>
//     );
// };

// export default ServiceParserDemo;
export { ServiceParser, ServiceRenderer };
export type { ParsedServiceData, ContactInfo, SectionData };
