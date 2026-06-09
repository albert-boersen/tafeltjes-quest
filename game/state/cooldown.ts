// Session-level cooldown: tracks how many OTHER tables must be played
// before a given table becomes available again.
const cooldowns = new Map<number, number>();

export function recordResult(table: number, perfect: boolean) {
  cooldowns.set(table, perfect ? 2 : 1);
}

export function tickCooldowns(justPlayedTable: number) {
  for (const [t, v] of cooldowns) {
    if (t !== justPlayedTable && v > 0) {
      const next = v - 1;
      if (next <= 0) cooldowns.delete(t);
      else cooldowns.set(t, next);
    }
  }
}

export function getCooldown(table: number): number {
  return cooldowns.get(table) ?? 0;
}
