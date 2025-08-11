// Minimal default profanity and sensitive words list.
// Keep short and focused to reduce false positives; allow users to extend/override.
// This list targets English only. Consumers can provide their own lists for other locales.

export const DEFAULT_PROFANITY: string[] = [
  // hardcore slurs not included to avoid propagating them in source; focus on common obvious ones
  "ass",
  "asses",
  "asshole",
  "bastard",
  "bitch",
  "bloody",
  "bollocks",
  "bugger",
  "cock",
  "cocks",
  "cocksucker",
  "crap",
  "cunt",
  "damn",
  "dick",
  "douche",
  "dumb",
  "dumber",
  "dumbest",
  "fag",
  "faggot",
  "fuck",
  "fucked",
  "fucker",
  "fucking",
  "goddam",
  "goddamn",
  "goddamned",
  "hell",
  "jerk",
  "moron",
  "nazi",
  "nuts",
  "piss",
  "pisser",
  "pissing",
  "prick",
  "retard",
  "shit",
  "shitty",
  "slut",
  "tits",
  "twat",
  "wanker"
];

export interface ProfanityFilterOptions {
  // Treat substrings as matches (e.g., blacklist "ass" would filter "passion")
  // Defaults to false to avoid false positives. If true, checks for word boundaries when possible.
  matchSubstrings?: boolean;
  // Word boundary regex to use when matchSubstrings=false; default matches start/end or non-word chars
  wordBoundary?: string;
}

export function buildProfanityFilter(
  blocklist: string[],
  options?: ProfanityFilterOptions
): (word: string) => boolean {
  const normalized = blocklist
    .filter(Boolean)
    .map((w) => w.trim().toLowerCase())
    .filter((w) => w.length > 0);

  const unique = Array.from(new Set(normalized));
  const useSubstring = options?.matchSubstrings === true;
  const boundary = options?.wordBoundary ?? "(?:^|[^a-z0-9])(?:%s)(?:$|[^a-z0-9])";

  const patterns: RegExp[] = unique.map((token) => {
    const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (useSubstring) {
      return new RegExp(escaped, "i");
    }
    const pattern = boundary.replace("%s", escaped);
    return new RegExp(pattern, "i");
  });

  return (word: string): boolean => {
    if (!word) return false;
    const text = String(word).toLowerCase();
    return patterns.some((rx) => rx.test(text));
  };
}


