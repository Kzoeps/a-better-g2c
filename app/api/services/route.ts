import { SERVICES } from "@/utils/subcategories-constants";
import { Service } from "@/utils/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params: context }: { params: Promise<{ id: string }> }
) {
    try {
        const params = await context;
        const servicesResponse = await fetch(
            "https://www.citizenservices.gov.bt/g2cPortalApi/getService"
        );
        const servicesData = await servicesResponse.json();
        const service: Service | undefined = servicesData.find(
            (service: Service) => Number(service.id) === Number(params.id)
        );
        if (!service) throw new Error("Service not found");
        return NextResponse.json(service);
    } catch (error) {
        console.error(error);
        const params = await context;
        const service = SERVICES.find((service) => {
            return service.id === Number(params.id);
        });
        if (service) {
            return NextResponse.json(service);
        } else {
            return NextResponse.json(
                { error: "Service not found" },
                { status: 404 }
            );
        }
    }
}
