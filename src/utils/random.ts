/**
 * Random helpers for username generation.
 * Note: This module is NOT used for security-sensitive purposes (no passwords, tokens, keys).
 * It prefers Web Crypto when available; otherwise, falls back to a non-crypto PRNG only as a last resort.
 */
export type RandomIntFunction = (minInclusive: number, maxInclusive: number) => number;

function getCrypto(): Crypto | undefined {
  const g = typeof globalThis !== "undefined" ? (globalThis as unknown as { crypto?: Crypto }) : undefined;
  return g && g.crypto ? (g.crypto as Crypto) : undefined;
}

// Persistent fallback seed to avoid re-seeding within the same millisecond
let fallbackSeed: number = (Date.now() ^ 0x9e3779b9) >>> 0;

function nextFallback32(): number {
  // xorshift32 advancing persistent state
  fallbackSeed ^= fallbackSeed << 13; fallbackSeed >>>= 0;
  fallbackSeed ^= fallbackSeed >>> 17; fallbackSeed >>>= 0;
  fallbackSeed ^= fallbackSeed << 5; fallbackSeed >>>= 0;
  return fallbackSeed >>> 0;
}

function getRandomValues(length: number): Uint32Array {
  const cryptoApi = getCrypto();
  if (cryptoApi && typeof cryptoApi.getRandomValues === "function") {
    const buffer = new Uint32Array(length);
    cryptoApi.getRandomValues(buffer);
    return buffer;
  }
  const buffer = new Uint32Array(length);
  for (let i = 0; i < length; i++) {
    buffer[i] = nextFallback32();
  }
  return buffer;
}

export const getRandomInt: RandomIntFunction = (minInclusive: number, maxInclusive: number): number => {
  if (!Number.isFinite(minInclusive) || !Number.isFinite(maxInclusive)) {
    throw new Error("Invalid bounds for getRandomInt");
  }
  if (maxInclusive < minInclusive) {
    throw new Error("maxInclusive must be >= minInclusive");
  }
  if (minInclusive === maxInclusive) return minInclusive;

  const [rand] = getRandomValues(1);
  const range = maxInclusive - minInclusive + 1;
  return minInclusive + (rand % range);
};

// Seeded PRNG helpers for deterministic output
function xmur3(str: string): () => number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
}

function mulberry32(a: number): () => number {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createSeededRandomInt(seed: string | number): RandomIntFunction {
  const seedStr = String(seed);
  const seedFn = xmur3(seedStr);
  const a = seedFn();
  const rand = mulberry32(a);
  return (minInclusive: number, maxInclusive: number) => {
    if (!Number.isFinite(minInclusive) || !Number.isFinite(maxInclusive)) {
      throw new Error("Invalid bounds for getRandomInt");
    }
    if (maxInclusive < minInclusive) {
      throw new Error("maxInclusive must be >= minInclusive");
    }
    if (minInclusive === maxInclusive) return minInclusive;
    const r = rand();
    const range = maxInclusive - minInclusive + 1;
    return minInclusive + Math.floor(r * range);
  };
}


