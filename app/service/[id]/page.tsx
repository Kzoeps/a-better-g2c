import ServiceParserDemo, { ServiceRenderer } from "@/utils/service-parser";
import { Service } from "@/utils/utils";

export default async function ServicePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const servicesResponse = await fetch(
        "https://www.citizenservices.gov.bt/g2cPortalApi/getService",
        {
            cache: "force-cache",
            next: {
                revalidate: 86400,
                tags: ["services"],
            },
        }
    );
    const servicesData = await servicesResponse.json();
    const service = servicesData.find(
        (service: Service) => Number(service.id) === Number(id)
    );
    return (
        <div>
            <ServiceRenderer
                serviceName={service?.serviceName || ""}
                htmlContent={service?.serviceDocument || ""}
            />
        </div>
    );
}
