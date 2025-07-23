import { categories } from "@/utils/categories-constants";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(
      "https://www.citizenservices.gov.bt/g2cPortalApi/getCategory"
    );
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(categories);
  }
}
