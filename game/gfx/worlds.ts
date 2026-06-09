import Phaser from 'phaser';
import { drawCastleBackground } from './castle';
import { drawForestBackground } from './forest';
import { drawVolcanoBackground } from './volcano';
import { drawIceBackground } from './ice';
import { drawOceanBackground } from './ocean';
import { createDragon } from './dragon';
import { createTroll } from './troll';
import { createFireSpirit } from './fireSpirit';
import { createIceKnight } from './iceKnight';
import { createSeaMonster } from './seaMonster';

export interface EnemyHandle {
  container: Phaser.GameObjects.Container;
  setReacting(on: boolean): void;
}

export interface WorldDef {
  id: string;
  label: string;
  drawBg(scene: Phaser.Scene, W: number, H: number): Phaser.GameObjects.Container;
  createEnemy(scene: Phaser.Scene, x: number, y: number): EnemyHandle;
  // Bounding extents at scale=1 (local, before x-flip)
  // enemyLeft: the side that faces the knight after flip (right in world space)
  enemyLeft: number;   // wing / limb tip toward knight side
  enemyRight: number;  // body back side
  enemyTop: number;    // tallest point up
  enemyFoot: number;   // lowest point down
  roarFn: string;      // which sound to play on enemy attack
}

export function worldForTable(table: number): WorldDef {
  if (table <= 2) return WORLDS[0]; // kasteel / draak
  if (table <= 4) return WORLDS[1]; // woud / trol
  if (table <= 6) return WORLDS[2]; // vulkaan / vuurgeest
  if (table <= 8) return WORLDS[3]; // ijsberg / ijsridder
  return WORLDS[4];                 // oceaan / zeemonster
}

export const WORLDS: WorldDef[] = [
  {
    id: 'castle',
    label: 'Kasteel',
    drawBg: drawCastleBackground,
    createEnemy: createDragon,
    enemyLeft: 162, enemyRight: 150, enemyTop: 158, enemyFoot: 136,
    roarFn: 'dragon',
  },
  {
    id: 'forest',
    label: 'Woud',
    drawBg: drawForestBackground,
    createEnemy: createTroll,
    enemyLeft: 130, enemyRight: 90, enemyTop: 150, enemyFoot: 128,
    roarFn: 'troll',
  },
  {
    id: 'volcano',
    label: 'Vulkaan',
    drawBg: drawVolcanoBackground,
    createEnemy: createFireSpirit,
    enemyLeft: 110, enemyRight: 80, enemyTop: 150, enemyFoot: 82,
    roarFn: 'spirit',
  },
  {
    id: 'ice',
    label: 'IJsberg',
    drawBg: drawIceBackground,
    createEnemy: createIceKnight,
    enemyLeft: 140, enemyRight: 65, enemyTop: 148, enemyFoot: 100,
    roarFn: 'ice',
  },
  {
    id: 'ocean',
    label: 'Oceaan',
    drawBg: drawOceanBackground,
    createEnemy: createSeaMonster,
    enemyLeft: 155, enemyRight: 80, enemyTop: 148, enemyFoot: 110,
    roarFn: 'sea',
  },
];
