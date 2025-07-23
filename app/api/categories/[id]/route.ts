import { subcategories } from "@/utils/subcategories-constants";
import { SubCategory } from "@/utils/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = await fetch(
      `https://www.citizenservices.gov.bt/g2cPortalApi/category/${params.id}`
    );
    const data = await response.json();
    const filteredData = data.map(({ serviceLink, ...rest }: SubCategory) => rest);
    return NextResponse.json(filteredData);
  } catch (e) {
    console.error("Error fetching categories:", e);
    const subcategory = subcategories.find((subcategory) => {
      return Number(subcategory.category) === Number(params.id);
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
