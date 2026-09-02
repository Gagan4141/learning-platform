import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { buildOnboardingProfile } from "@/lib/onboarding";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  level: z.enum(["beginner", "exposed"]),
  dailyMinutes: z.number().min(15).max(180),
  goal: z.enum(["exam", "conversation"]),
});

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid onboarding input" }, { status: 400 });

  const profile = buildOnboardingProfile(parsed.data);

  await prisma.onboardingProfile.upsert({
    where: { userId: user.id },
    update: {
      level: profile.level,
      dailyMinutes: profile.dailyMinutes,
      goal: profile.goal,
      studyPlan: profile.studyPlan,
      weakSkills: profile.weakSkills.join(","),
      badges: profile.badges.join(","),
    },
    create: {
      userId: user.id,
      level: profile.level,
      dailyMinutes: profile.dailyMinutes,
      goal: profile.goal,
      studyPlan: profile.studyPlan,
      weakSkills: profile.weakSkills.join(","),
      badges: profile.badges.join(","),
    },
  });

  return NextResponse.json({ ok: true });
}
