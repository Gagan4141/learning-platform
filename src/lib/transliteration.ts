const map: Record<string, string> = {
  a: "あ",
  i: "い",
  u: "う",
  e: "え",
  o: "お",
  ka: "か",
  ki: "き",
  ku: "く",
  ke: "け",
  ko: "こ",
  sa: "さ",
  shi: "し",
  su: "す",
  se: "せ",
  so: "そ",
  ta: "た",
  chi: "ち",
  tsu: "つ",
  te: "て",
  to: "と",
  na: "な",
  ni: "に",
  nu: "ぬ",
  ne: "ね",
  no: "の",
  ha: "は",
  hi: "ひ",
  fu: "ふ",
  he: "へ",
  ho: "ほ",
  ma: "ま",
  mi: "み",
  mu: "む",
  me: "め",
  mo: "も",
  ya: "や",
  yu: "ゆ",
  yo: "よ",
  ra: "ら",
  ri: "り",
  ru: "る",
  re: "れ",
  ro: "ろ",
  wa: "わ",
  wo: "を",
  n: "ん",
};

const keys = Object.keys(map).sort((a, b) => b.length - a.length);

export function romajiToKana(input: string): string {
  let remaining = input.toLowerCase().replace(/\s+/g, "");
  let out = "";

  while (remaining.length > 0) {
    const match = keys.find((key) => remaining.startsWith(key));
    if (!match) {
      out += remaining[0];
      remaining = remaining.slice(1);
      continue;
    }
    out += map[match];
    remaining = remaining.slice(match.length);
  }

  return out;
}
