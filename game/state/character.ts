export interface KnightColors {
  armorDark: number;
  armorMain: number;
  armorLight: number;
  shieldColor: number;
  plumeColor: number;
}

export interface KnightTheme {
  id: string;
  label: string;
  colors: KnightColors;
  accentColor: number; // UI highlight color for this theme
}

export const KNIGHT_THEMES: KnightTheme[] = [
  {
    id: 'blue', label: 'Koninklijk',
    colors: { armorDark: 0x5566aa, armorMain: 0x6677bb, armorLight: 0x8899dd, shieldColor: 0xc0392b, plumeColor: 0xdd2233 },
    accentColor: 0x8899ff,
  },
  {
    id: 'gold', label: 'Gouden Ridder',
    colors: { armorDark: 0x6b4e10, armorMain: 0x8a6820, armorLight: 0xc09a40, shieldColor: 0x8b4513, plumeColor: 0xcc7700 },
    accentColor: 0xf5c842,
  },
  {
    id: 'green', label: 'Smaragd Ridder',
    colors: { armorDark: 0x2d5a2d, armorMain: 0x3d7a3d, armorLight: 0x60aa60, shieldColor: 0x1a5a1a, plumeColor: 0x22bb22 },
    accentColor: 0x55cc55,
  },
  {
    id: 'shadow', label: 'Schaduw Ridder',
    colors: { armorDark: 0x2a1a5a, armorMain: 0x3a2a7a, armorLight: 0x6050aa, shieldColor: 0x1a0a3a, plumeColor: 0x7a2aaa },
    accentColor: 0xaa88ff,
  },
];

let selectedThemeId = 'blue';

export function getSelectedTheme(): KnightTheme {
  return KNIGHT_THEMES.find(t => t.id === selectedThemeId) ?? KNIGHT_THEMES[0];
}

export function setSelectedTheme(id: string): void {
  selectedThemeId = id;
}
