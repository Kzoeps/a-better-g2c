"use client";
import ServiceRendererSkeleton from "@/app/components/service-renderer-skeleton";
import { ArrowLeft } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Suspense } from "react";

const ServiceRendererShell = dynamic(
    () => import("@/app/components/service-renderer-shell"),
    {
        ssr: false,
    }
);

export default function ServicePage() {
    const { id } = useParams<{ id: string }>();
    return (
        <div className="flex flex-col">
            <nav className="bg-gray-500 text-white sticky top-0 z-20">
                <div className="p-4">
                    <div className="flex items-center">
                        <Link
                            href={"/"}
                            className="inline-flex items-center text-white hover:text-blue-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded-md p-1 mr-3"
                        >
                            <ArrowLeft className="h-5 w-5 mr-1" />
                            <span className="text-sm font-medium">
                                Back to categories
                            </span>
                        </Link>
                    </div>
                </div>
            </nav>

            <Suspense fallback={<ServiceRendererSkeleton />}>
                <ServiceRendererShell id={id} />
            </Suspense>
        </div>
    );
}
