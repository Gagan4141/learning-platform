import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { scheduleSrsReview } from "@/lib/learning";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  cardId: z.string().min(1),
  grade: z.coerce.number().int().min(0).max(5),
});

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.redirect(new URL("/auth/login", request.url));

  const formData = await request.formData();
  const parsed = schema.safeParse({ cardId: formData.get("cardId"), grade: formData.get("grade") });
  if (!parsed.success) return NextResponse.redirect(new URL("/review", request.url));

  const card = await prisma.reviewCard.findFirst({ where: { id: parsed.data.cardId, userId: user.id } });
  if (!card) return NextResponse.redirect(new URL("/review", request.url));

  const next = scheduleSrsReview(card.easeFactor, card.repetitions, card.intervalDays, parsed.data.grade as 0 | 1 | 2 | 3 | 4 | 5);

  await prisma.reviewCard.update({
    where: { id: card.id },
    data: {
      easeFactor: next.easeFactor,
      repetitions: next.repetitions,
      intervalDays: next.intervalDays,
      dueAt: next.dueAt,
      lastScore: parsed.data.grade,
    },
  });

  if (parsed.data.grade <= 2) {
    await prisma.mistakeNote.create({
      data: {
        userId: user.id,
        skill: card.itemType,
        prompt: card.prompt,
        expected: card.answer,
        actual: "incorrect recall",
      },
    });
  }

  return NextResponse.redirect(new URL("/review", request.url));
}
