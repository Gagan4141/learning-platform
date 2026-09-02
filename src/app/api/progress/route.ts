import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  skill: z.string().min(1),
  accuracy: z.number().min(0).max(100),
  timeSpentMin: z.number().int().min(0),
  masteredDelta: z.number().int().min(0).max(10).default(1),
  weakTopic: z.string().default(""),
});

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const current = await prisma.skillProgress.findUnique({
    where: { userId_skill: { userId: user.id, skill: parsed.data.skill } },
  });

  if (!current) {
    await prisma.skillProgress.create({
      data: {
        userId: user.id,
        skill: parsed.data.skill,
        accuracy: parsed.data.accuracy,
        timeSpentMin: parsed.data.timeSpentMin,
        mastered: parsed.data.masteredDelta,
        weakTopics: parsed.data.weakTopic,
      },
    });
  } else {
    await prisma.skillProgress.update({
      where: { id: current.id },
      data: {
        accuracy: parsed.data.accuracy,
        timeSpentMin: current.timeSpentMin + parsed.data.timeSpentMin,
        mastered: current.mastered + parsed.data.masteredDelta,
        weakTopics: parsed.data.weakTopic || current.weakTopics,
      },
    });
  }

  return NextResponse.json({ ok: true });
}
