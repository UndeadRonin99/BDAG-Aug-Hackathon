import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const rows = await prisma.opportunity.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const body = await req.json();
  const row = await prisma.opportunity.create({
    data: {
      orgId: "org-demo", // replace with real org user id when auth added
      title: body.title,
      summary: body.summary,
      rewardZAR: Number(body.rewardZAR),
      chainAmount: body.chainAmount,
    },
  });
  return NextResponse.json(row, { status: 201 });
}
