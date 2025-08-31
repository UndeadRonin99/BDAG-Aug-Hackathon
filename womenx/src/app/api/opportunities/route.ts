import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { parseUnits } from "viem"; // works on server

const SServer = z.object({
  title: z.string().trim().min(3),
  summary: z.string().trim().min(10),
  rewardZAR: z.number().positive(),
  chainAmountBDAG: z.string().trim().min(1),
});

export async function GET() {
  const rows = await prisma.opportunity.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = SServer.safeParse(body);
    if (!parsed.success) {
      return new NextResponse(
        JSON.stringify({ error: parsed.error.flatten() }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const { title, summary, rewardZAR, chainAmountBDAG } = parsed.data;

    // Convert BDAG (human) -> wei string (18 decimals)
    const chainAmountWei = parseUnits(chainAmountBDAG as `${number}` as string, 18).toString();

    const row = await prisma.opportunity.create({
      data: {
        orgId: "org-demo", // TODO: replace with the authed org user id
        title,
        summary,
        rewardZAR,
        chainAmount: chainAmountWei,
        status: "OPEN",
      },
    });
    return NextResponse.json(row, { status: 201 });
  } catch (err: any) {
    return new NextResponse(err?.message || "Server error", { status: 500 });
  }
}
