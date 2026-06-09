const WORLD_ORDER = ['castle', 'forest', 'volcano', 'ice', 'ocean'];

export function worldIdForTable(table: number): string {
  if (table <= 2) return 'castle';
  if (table <= 4) return 'forest';
  if (table <= 6) return 'volcano';
  if (table <= 8) return 'ice';
  return 'ocean';
}

function getUnlocked(): string[] {
  if (typeof localStorage === 'undefined') return ['castle'];
  try {
    return JSON.parse(localStorage.getItem('tq_unlocked') ?? '["castle"]');
  } catch { return ['castle']; }
}

export function isTableUnlocked(table: number): boolean {
  return getUnlocked().includes(worldIdForTable(table));
}

// Returns the newly unlocked world id, or null if nothing changed
export function tryUnlockNext(table: number): string | null {
  if (typeof localStorage === 'undefined') return null;
  const idx = WORLD_ORDER.indexOf(worldIdForTable(table));
  if (idx < 0 || idx >= WORLD_ORDER.length - 1) return null;
  const nextId = WORLD_ORDER[idx + 1];
  const unlocked = getUnlocked();
  if (unlocked.includes(nextId)) return null;
  unlocked.push(nextId);
  localStorage.setItem('tq_unlocked', JSON.stringify(unlocked));
  return nextId;
}
