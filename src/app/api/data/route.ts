import { NextResponse } from "next/server";
import { getPortfolioData } from "@/lib/portfolioDb";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getPortfolioData();
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    ...data,
  });
}
