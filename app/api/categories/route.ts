import { CATEGORIES } from "@/utils/categories-constants";
import { SERVICES } from "@/utils/subcategories-constants";
import {
    getCategoriesWithServices,
    mapCategoriesWithServices,
} from "@/utils/utils";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const mappedData = await getCategoriesWithServices();
        return NextResponse.json(mappedData);
    } catch (error) {
        console.error("Error fetching categories:", error);
        const mappedData = mapCategoriesWithServices(CATEGORIES, SERVICES);
        return NextResponse.json(mappedData);
    }
}
