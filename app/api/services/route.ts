"@/utils/types";
import { SERVICES } from "@/utils/subcategories-constants";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const servicesResponse = await fetch(
            "https://www.citizenservices.gov.bt/g2cPortalApi/getService"
        );
        const servicesData = await servicesResponse.json();
        return NextResponse.json(servicesData);
    } catch (error) {
        console.error(error);
        return NextResponse.json(SERVICES);
    }
}
