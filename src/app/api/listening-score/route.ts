import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  gameType: z.string().min(1),
  score: z.number().int().min(0),
  accuracy: z.number().min(0).max(100),
});

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  await prisma.listeningScore.create({
    data: {
      userId: user.id,
      gameType: parsed.data.gameType,
      score: parsed.data.score,
      accuracy: parsed.data.accuracy,
    },
  });

  return NextResponse.json({ ok: true });
}
