import { subcategories } from "@/utils/subcategories-constants";
import { SubCategory } from "@/utils/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const parameters = await params;
        const response = await fetch(
            `https://www.citizenservices.gov.bt/g2cPortalApi/category/${parameters.id}`
        );
        const data = await response.json();
        const filteredData = data.map((subcategory: SubCategory) => {
            delete subcategory?.serviceDocument;
            return subcategory;
        });
        return NextResponse.json(filteredData);
    } catch (e) {
        console.error("Error fetching categories:", e);
        const parameters = await params;
        const subcategory = subcategories.find((subcategory) => {
            return Number(subcategory.category) === Number(parameters.id);
        });
        if (subcategory) {
            return NextResponse.json(subcategory);
        } else {
            return NextResponse.json(
                { error: "Subcategory not found" },
                { status: 404 }
            );
        }
    }
}
