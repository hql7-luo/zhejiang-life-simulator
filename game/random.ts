export function hashSeed(seed: string): number {
  let h = 2166136261 >>> 0;
  for (let index = 0; index < seed.length; index += 1) {
    h ^= seed.charCodeAt(index);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function seededRandom(seed: string, cursor = 0): number {
  let value = (hashSeed(seed) + Math.imul(cursor + 1, 0x6d2b79f5)) >>> 0;
  value += 0x6d2b79f5;
  let result = value;
  result = Math.imul(result ^ (result >>> 15), result | 1);
  result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
  return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
}

export function pickSeeded<T>(items: readonly T[], seed: string, cursor = 0): T {
  if (items.length === 0) throw new Error("Cannot pick from an empty list");
  return items[Math.floor(seededRandom(seed, cursor) * items.length)]!;
}

export function createSeed(prefix = "life"): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function dailySeed(date = new Date()): string {
  const key = [date.getFullYear(), `${date.getMonth() + 1}`.padStart(2, "0"), `${date.getDate()}`.padStart(2, "0")].join("-");
  return `daily-${key}`;
}
