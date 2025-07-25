import ServiceRendererShell from "@/app/components/service-renderer-shell";
import { Service } from "@/utils/utils";

export default async function ServicePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const servicesResponse = await fetch(
        "https://www.citizenservices.gov.bt/g2cPortalApi/getService"
    );
    const servicesData = await servicesResponse.json();
    const service = servicesData.find(
        (service: Service) => Number(service.id) === Number(id)
    );
    return (
        <div>
            <ServiceRendererShell
                serviceName={service?.name || ""}
                htmlContent={service?.serviceDocument || ""}
            />
        </div>
    );
}
