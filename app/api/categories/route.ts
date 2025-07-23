import { NextResponse } from "next/server";

export async function GET() {
  const response = await fetch(
    "https://www.citizenservices.gov.bt/g2cPortalApi/getCategory"
  );
  const data = await response.json();
  return NextResponse.json(data);
}
