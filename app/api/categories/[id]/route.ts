import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const response = await fetch(
    `https://www.citizenservices.gov.bt/g2cPortalApi/category/${params.id}`
  );
  const data = await response.json();
  return NextResponse.json(data);
}
