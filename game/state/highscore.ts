export interface HighscoreEntry {
  accuracy: number;
  difficulty: string;
  stars: number; // 0–3
}

export function saveHighscore(table: number, accuracy: number, difficulty: string): void {
  if (typeof localStorage === 'undefined') return;
  const stars = accuracy >= 90 ? 3 : accuracy >= 70 ? 2 : accuracy >= 50 ? 1 : 0;
  const existing = getHighscore(table);
  if (!existing || stars > existing.stars || (stars === existing.stars && accuracy > existing.accuracy)) {
    localStorage.setItem(`tq_hs_${table}`, JSON.stringify({ accuracy, difficulty, stars }));
  }
}

export function getHighscore(table: number): HighscoreEntry | null {
  if (typeof localStorage === 'undefined') return null;
  try {
    const d = localStorage.getItem(`tq_hs_${table}`);
    return d ? JSON.parse(d) : null;
  } catch { return null; }
}
