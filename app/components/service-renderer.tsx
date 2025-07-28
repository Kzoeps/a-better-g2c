import { ServiceParser, SectionData } from "@/utils/service-parser";
import { AlertCircle, Sparkles, Eye, Phone, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";

interface ServiceRendererProps {
    htmlContent: string;
    serviceName?: string;
    serviceLink?: string;
    onGoBack?: () => void;
}

const ServiceRenderer: React.FC<ServiceRendererProps> = ({
    htmlContent,
    serviceName = "Government Service",
    serviceLink,
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

    const renderServiceName = (): React.ReactNode => {
        const displayName = serviceName;

        return (
            <div className="bg-white max-w-[100vw] md:max-w-md shadow-sm border-b border-gray-200 sticky top-16 z-10">
                <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                        <div className="max-w-full min-w-0">
                            <h1 className="text-xl font-bold text-gray-900 break-words leading-tight max-w-[calc(100vw-8rem)] overflow-hidden">
                                {displayName}
                            </h1>

                            <p className="text-sm text-gray-600 mt-1">
                                Government of Bhutan Digital Service
                            </p>
                        </div>
                        <button
                            onClick={toggleOriginal}
                            className="flex-shrink-0 inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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

export default ServiceRenderer;
