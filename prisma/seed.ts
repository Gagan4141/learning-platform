import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import content from "./seed-content/n5-content.json";

const prisma = new PrismaClient();

async function main() {
  const demoEmail = "demo@n5fast.jp";
  const passwordHash = await bcrypt.hash("demo12345", 12);

  const user = await prisma.user.upsert({
    where: { email: demoEmail },
    update: {},
    create: {
      email: demoEmail,
      passwordHash,
      name: "Demo Learner",
      onboarding: {
        create: {
          level: "beginner",
          dailyMinutes: 45,
          goal: "exam",
          studyPlan:
            "5m habit warmup | 10m active recall | 10m interleaving review | 10m listening game | 10m speaking | mini mock section",
          badges: "N5 Starter,Exam Focus",
          weakSkills: "speaking,listening,kanji",
          xp: 120,
          streak: 3,
        },
      },
    },
  });

  const skills = ["hiragana", "katakana", "kanji", "vocabulary", "grammar", "reading", "listening", "speaking", "writing"];

  await Promise.all(
    skills.map((skill, idx) =>
      prisma.skillProgress.upsert({
        where: { userId_skill: { userId: user.id, skill } },
        update: {},
        create: {
          userId: user.id,
          skill,
          accuracy: 55 + idx * 4,
          timeSpentMin: 20 + idx * 10,
          mastered: idx,
          weakTopics: idx < 3 ? "basic recall" : "particles",
        },
      }),
    ),
  );

  for (const card of content.vocab.slice(0, 40)) {
    await prisma.reviewCard.create({
      data: {
        userId: user.id,
        itemType: "vocabulary",
        prompt: card.term,
        answer: card.meaning,
        sourceLessonId: "vocab-seed",
      },
    });
  }

  await prisma.mistakeNote.deleteMany({ where: { userId: user.id } });
  await prisma.mistakeNote.createMany({
    data: [
      {
        userId: user.id,
        skill: "grammar",
        prompt: "Use particle for destination",
        expected: "に",
        actual: "を",
      },
      {
        userId: user.id,
        skill: "listening",
        prompt: "Clip 5 keyword",
        expected: "station",
        actual: "school",
      },
    ],
  });

  await prisma.listeningScore.deleteMany({ where: { userId: user.id } });
  await prisma.listeningScore.createMany({
    data: [
      { userId: user.id, gameType: "spot-the-word", score: 860, accuracy: 81 },
      { userId: user.id, gameType: "sequence-order", score: 920, accuracy: 88 },
    ],
  });

  console.log(`Seeded demo user: ${demoEmail} / demo12345`);
  console.log(`Lessons: ${content.lessons.length}, Vocab: ${content.vocab.length}, Reading: ${content.reading.length}, Listening: ${content.listening.length}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
