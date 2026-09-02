import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  expected: z.string().min(1),
  transcript: z.string().min(1),
  quality: z.number().min(0).max(100),
  feedback: z.string().min(1),
});

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  await prisma.speakingAttempt.create({
    data: {
      userId: user.id,
      expected: parsed.data.expected,
      transcript: parsed.data.transcript,
      qualityScore: parsed.data.quality,
      feedback: parsed.data.feedback,
      pacingWpm: Math.max(60, Math.min(200, parsed.data.transcript.split(/\s+/).length * 12)),
    },
  });

  const profile = await prisma.onboardingProfile.findUnique({ where: { userId: user.id } });
  if (profile) {
    await prisma.onboardingProfile.update({
      where: { userId: user.id },
      data: { xp: profile.xp + Math.round(parsed.data.quality / 4), streak: profile.streak + 1 },
    });
  }

  return NextResponse.json({ ok: true });
}
