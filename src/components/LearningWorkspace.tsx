"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Lesson } from "@/lib/content";
import { n5Content, skillOrder } from "@/lib/content";
import { pronunciationFeedback } from "@/lib/learning";
import { romajiToKana } from "@/lib/transliteration";

type Props = {
  lessons: Lesson[];
};

export function LearningWorkspace({ lessons }: Props) {
  const [skill, setSkill] = useState<string>("hiragana");
  const [expected, setExpected] = useState("わたしは がくせいです");
  const [transcript, setTranscript] = useState("");
  const [listenIdx, setListenIdx] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [writingInput, setWritingInput] = useState("");
  const [readingIdx, setReadingIdx] = useState(0);
  const [score, setScore] = useState<string>("");
  const [isListening, setIsListening] = useState(false);
  const [lookupWord, setLookupWord] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const bySkill = useMemo(() => lessons.filter((l) => l.skill === skill), [lessons, skill]);
  const currentListen = n5Content.listening[listenIdx % n5Content.listening.length];
  const currentReading = n5Content.reading[readingIdx % n5Content.reading.length];
  const lookupResult = lookupWord ? n5Content.vocab.find((word) => word.term.includes(lookupWord)) : null;

  const speakingResult = pronunciationFeedback(expected, transcript);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  async function captureSpeech() {
    if (typeof window === "undefined") return;
    await navigator.mediaDevices.getUserMedia({ audio: true });

    const recognitionWindow = window as Window & {
      webkitSpeechRecognition?: new () => {
        lang: string;
        interimResults: boolean;
        maxAlternatives: number;
        onresult: ((event: { results: { 0: { transcript: string } }[] }) => void) | null;
        onend: (() => void) | null;
        start: () => void;
      };
      SpeechRecognition?: new () => {
        lang: string;
        interimResults: boolean;
        maxAlternatives: number;
        onresult: ((event: { results: { 0: { transcript: string } }[] }) => void) | null;
        onend: (() => void) | null;
        start: () => void;
      };
    };

    const Recognition = recognitionWindow.SpeechRecognition ?? recognitionWindow.webkitSpeechRecognition;
    if (!Recognition) {
      setScore("Speech recognition API is not available in this browser.");
      return;
    }

    const recognition = new Recognition();
    recognition.lang = "ja-JP";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    setIsListening(true);
    recognition.onresult = (event) => {
      const heard = event.results?.[0]?.[0]?.transcript ?? "";
      setTranscript(heard);
    };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {skillOrder.map((s) => (
          <button
            key={s}
            onClick={() => setSkill(s)}
            className={`rounded-full px-3 py-1 text-sm ${skill === s ? "bg-black text-white dark:bg-white dark:text-black" : "border border-black/20 dark:border-white/20"}`}
          >
            {s}
          </button>
        ))}
      </div>

      <section className="rounded-xl border border-black/10 p-4 dark:border-white/20">
        <h2 className="text-lg font-semibold">{skill.toUpperCase()} Module</h2>
        <p className="mb-3 text-sm opacity-80">Lessons, examples, quizzes, and mastery checks.</p>
        <div className="grid gap-3 md:grid-cols-2">
          {bySkill.map((lesson) => (
            <article key={lesson.id} className="rounded-lg border border-black/10 p-3 dark:border-white/10">
              <h3 className="font-medium">{lesson.title}</h3>
              <p className="text-sm opacity-80">{lesson.objective}</p>
              <ul className="mt-2 list-disc pl-5 text-sm">
                {lesson.examples.map((example) => (
                  <li key={example}>{example}</li>
                ))}
              </ul>
              <p className="mt-2 text-xs">Mastery: {lesson.masteryCriteria.minScore}% over {lesson.masteryCriteria.minAttempts} attempts.</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-xl border border-black/10 p-4 dark:border-white/20">
          <h3 className="font-semibold">Speaking: Listen & Repeat + Prompt</h3>
          <p className="my-2 text-sm">Expected phrase:</p>
          <input value={expected} onChange={(e) => setExpected(e.target.value)} className="w-full rounded border px-3 py-2 text-sm" aria-label="Expected phrase" />
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            className="mt-2 w-full rounded border px-3 py-2 text-sm"
            rows={3}
            placeholder="Paste transcript or type your speech output"
            aria-label="Transcript"
          />
          <button
            onClick={captureSpeech}
            className="mt-2 rounded border border-black/20 px-3 py-2 text-sm dark:border-white/20"
          >
            {isListening ? "Listening..." : "Use microphone capture"}
          </button>
          <div className="mt-2 rounded bg-black/5 p-2 text-sm dark:bg-white/10">
            Quality: {speakingResult.quality}% · {speakingResult.feedback}
          </div>
          <button
            onClick={async () => {
              await fetch("/api/speaking", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ expected, transcript, quality: speakingResult.quality, feedback: speakingResult.feedback }),
              });
              setScore("Speaking attempt saved.");
            }}
            className="mt-2 rounded bg-black px-3 py-2 text-sm text-white dark:bg-white dark:text-black"
          >
            Save speaking attempt
          </button>
        </article>

        <article className="rounded-xl border border-black/10 p-4 dark:border-white/20">
          <h3 className="font-semibold">Listening Games</h3>
          <p className="text-sm">{currentListen.title} ({currentListen.type})</p>
          <audio ref={audioRef} controls className="mt-2 w-full" preload="none">
            <source src={`data:audio/mpeg;base64,`} />
          </audio>
          <div className="mt-2 flex items-center gap-2 text-sm">
            <label htmlFor="speed">Speed</label>
            <input id="speed" type="range" min={0.5} max={1.5} step={0.1} value={playbackRate} onChange={(e) => setPlaybackRate(Number(e.target.value))} />
            <span>{playbackRate.toFixed(1)}x</span>
          </div>
          <p className="mt-2 text-sm">{currentListen.prompt}</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {currentListen.options.map((option) => (
              <button
                key={option}
                onClick={async () => {
                  const earned = option === currentListen.answer ? 100 : 20;
                  await fetch("/api/listening-score", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ gameType: "spot-the-word", score: earned, accuracy: option === currentListen.answer ? 100 : 0 }),
                  });
                  setScore(option === currentListen.answer ? "Correct! +100" : "Not quite. +20 retry points");
                  setListenIdx((v) => v + 1);
                }}
                className="rounded border px-3 py-2 text-sm"
              >
                {option}
              </button>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-xl border border-black/10 p-4 dark:border-white/20">
          <h3 className="font-semibold">Writing Drills</h3>
          <p className="text-sm">Prompt: {n5Content.writingPrompts[0]}</p>
          <p className="mt-1 text-xs opacity-80">Hint conversion (romaji→kana): watashiwagakusei = {romajiToKana("watashiwagakusei")}</p>
          <textarea
            value={writingInput}
            onChange={(e) => setWritingInput(e.target.value)}
            className="mt-2 w-full rounded border px-3 py-2"
            rows={3}
            aria-label="Writing response"
          />
          <button
            onClick={() => {
              const ok = writingInput.trim().length >= 6;
              setScore(ok ? "Writing accepted. Great retrieval practice." : "Add more detail and include target particles.");
            }}
            className="mt-2 rounded bg-black px-3 py-2 text-sm text-white dark:bg-white dark:text-black"
          >
            Check writing
          </button>
        </article>

        <article className="rounded-xl border border-black/10 p-4 dark:border-white/20">
          <h3 className="font-semibold">Reading Practice</h3>
          <p className="text-sm font-medium">{currentReading.title}</p>
          <details className="mt-2">
            <summary className="cursor-pointer text-sm">Toggle furigana</summary>
            <p className="mt-2 text-sm">{currentReading.furigana}</p>
          </details>
          <p className="mt-2 text-sm">{currentReading.text}</p>
          <label className="mt-2 block text-sm">
            Inline word lookup
            <input
              value={lookupWord}
              onChange={(e) => setLookupWord(e.target.value)}
              className="mt-1 w-full rounded border px-2 py-1"
              placeholder="Type a vocab term, e.g. わたし"
            />
          </label>
          {lookupResult ? (
            <p className="mt-1 text-xs opacity-85">
              {lookupResult.term}: {lookupResult.meaning} · {lookupResult.example}
            </p>
          ) : null}
          <p className="mt-2 text-sm">Q: {currentReading.question}</p>
          <button onClick={() => setReadingIdx((v) => v + 1)} className="mt-2 rounded border px-3 py-2 text-sm">
            Next passage
          </button>
        </article>
      </section>

      {score ? <p className="rounded bg-emerald-100 px-3 py-2 text-sm text-emerald-900">{score}</p> : null}
    </div>
  );
}
