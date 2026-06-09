import Phaser from 'phaser';

export interface IceKnightHandle {
  container: Phaser.GameObjects.Container;
  setReacting(on: boolean): void;
}

export function createIceKnight(scene: Phaser.Scene, x: number, y: number): IceKnightHandle {
  const container = scene.add.container(x, y);
  const idle = scene.add.graphics();
  const react = scene.add.graphics();

  drawIdle(idle);
  drawReact(react);
  react.setVisible(false);

  container.add([idle, react]);
  return {
    container,
    setReacting(on) { idle.setVisible(!on); react.setVisible(on); },
  };
}

// Ice Knight: mirror of the player knight but icy. Faces LEFT.
// Bounding box: left≈140px (lance tip), right≈65px (back), top≈148px (helmet spike), foot≈100px

function drawIdle(g: Phaser.GameObjects.Graphics) {
  g.fillStyle(0x000000, 0.15); g.fillEllipse(0, 100, 110, 14);

  // Boots
  g.fillStyle(0x0a2a44, 1);
  g.fillRoundedRect(-28, 72, 26, 26, { tl: 3, tr: 3, bl: 12, br: 3 });
  g.fillRoundedRect(4, 72, 26, 26, { tl: 3, tr: 3, bl: 3, br: 12 });
  g.fillStyle(0x1a4060, 0.6); g.fillRect(-26, 73, 10, 5); g.fillRect(6, 73, 10, 5);

  // Legs (ice blue)
  g.fillStyle(0x4488bb, 1);
  g.fillRoundedRect(-26, 12, 22, 64, 5); g.fillRoundedRect(4, 12, 22, 64, 5);
  g.fillStyle(0x88ccee, 0.4); g.fillRect(-22, 16, 6, 24); g.fillRect(6, 16, 6, 24);
  // Knee plates
  g.fillStyle(0x2266aa, 1);
  g.fillRoundedRect(-28, 44, 26, 18, 5); g.fillRoundedRect(2, 44, 26, 18, 5);
  g.fillStyle(0x55aadd, 1);
  g.fillRoundedRect(-27, 45, 24, 15, 4); g.fillRoundedRect(3, 45, 24, 15, 4);

  // Belt with ice gem
  g.fillStyle(0x0a2a44, 1); g.fillRect(-28, 10, 56, 8);
  g.fillStyle(0x88eeff, 1); g.fillRect(-9, 11, 18, 6);
  g.fillStyle(0xaaffff, 0.6); g.fillRect(-6, 12, 12, 4);

  // Torso
  g.fillStyle(0x3366aa, 1); g.fillRoundedRect(-28, -58, 56, 72, 7);
  g.fillStyle(0x5599cc, 1); g.fillRoundedRect(-22, -52, 44, 58, 5);
  g.fillStyle(0xaaddff, 0.2); g.fillRect(-26, -56, 6, 64);
  // Crystal shards on chest
  g.fillStyle(0x88ccff, 0.5);
  g.fillTriangle(-14, -44, -6, -44, -10, -60);
  g.fillTriangle(0, -44, 8, -44, 4, -56);
  g.fillTriangle(12, -44, 20, -44, 16, -58);

  // Shoulders
  g.fillStyle(0x2266aa, 1);
  g.fillEllipse(-38, -50, 32, 26); g.fillEllipse(38, -50, 32, 26);
  g.fillStyle(0x4488bb, 1);
  g.fillEllipse(-38, -54, 28, 20); g.fillEllipse(38, -54, 28, 20);
  // Ice spikes on shoulder
  g.fillStyle(0x88ddff, 0.7);
  g.fillTriangle(-44, -60, -38, -60, -41, -74);
  g.fillTriangle(34, -60, 40, -60, 37, -72);

  // Left arm (shield side)
  g.fillStyle(0x4488bb, 1); g.fillRoundedRect(-42, -48, 16, 64, 5);
  g.fillStyle(0x2266aa, 1); g.fillRoundedRect(-44, 14, 18, 22, 5);

  // ICE SHIELD (left)
  g.fillStyle(0x2266aa, 0.8);
  g.fillRoundedRect(-118, -56, 38, 60, { tl: 10, tr: 10, bl: 18, br: 18 });
  g.fillStyle(0x44aadd, 0.85);
  g.fillRoundedRect(-116, -54, 34, 56, { tl: 8, tr: 8, bl: 14, br: 14 });
  g.fillStyle(0x88ddff, 0.3); g.fillRect(-110, -52, 26, 52);
  // Snowflake on shield
  g.lineStyle(2, 0xaaeeff, 0.9);
  const sc = [-99, -26]; const sr = 16;
  g.lineBetween(sc[0] - sr, sc[1], sc[0] + sr, sc[1]);
  g.lineBetween(sc[0], sc[1] - sr, sc[0], sc[1] + sr);
  g.lineBetween(sc[0] - sr * 0.7, sc[1] - sr * 0.7, sc[0] + sr * 0.7, sc[1] + sr * 0.7);
  g.lineBetween(sc[0] - sr * 0.7, sc[1] + sr * 0.7, sc[0] + sr * 0.7, sc[1] - sr * 0.7);
  g.lineStyle(0, 0, 0);
  g.fillStyle(0xaaeeff, 1); g.fillCircle(sc[0], sc[1], 5);

  // Right arm (lance arm)
  g.fillStyle(0x4488bb, 1); g.fillRoundedRect(28, -48, 16, 64, 5);
  g.fillStyle(0x2266aa, 1); g.fillRoundedRect(26, 14, 18, 22, 5);

  // ICE LANCE (right, pointing left)
  g.fillStyle(0x2266aa, 0.9);
  g.fillRect(-80, -10, 122, 10); // shaft
  g.fillStyle(0x88ddff, 0.7); g.fillRect(-78, -8, 118, 6); // shine
  // Lance tip (ice crystal)
  g.fillStyle(0xaaeeff, 1);
  g.fillTriangle(-80, -16, -80, 4, -140, -6);
  g.fillStyle(0x88ddff, 0.6);
  g.fillTriangle(-78, -12, -78, 0, -132, -6);

  // Neck
  g.fillStyle(0x44aacc, 1); g.fillRoundedRect(-12, -64, 24, 12, 4);

  // Helmet (icy, spiked)
  g.fillStyle(0x2266aa, 1);
  g.fillRoundedRect(-32, -110, 64, 52, { tl: 32, tr: 32, bl: 4, br: 4 });
  g.fillStyle(0x4488bb, 1);
  g.fillRoundedRect(-29, -108, 58, 48, { tl: 28, tr: 28, bl: 4, br: 4 });
  g.fillStyle(0xaaddff, 0.3);
  g.fillRoundedRect(-24, -104, 24, 30, { tl: 18, tr: 4, bl: 4, br: 4 });
  // Ice spikes on helmet
  g.fillStyle(0x88ccff, 0.9);
  [[-18, -110, -22, -148], [0, -108, -3, -144], [16, -110, 13, -146]].forEach(([bx, by, tx, ty]) =>
    g.fillTriangle(bx - 5, by, bx + 5, by, tx, ty)
  );
  // Cheek guards
  g.fillStyle(0x1a5088, 1);
  g.fillRoundedRect(-36, -78, 9, 28, { tl: 3, tr: 0, bl: 8, br: 0 });
  g.fillRoundedRect(27, -78, 9, 28, { tl: 0, tr: 3, bl: 0, br: 8 });
  // Visor
  g.fillStyle(0x060c18, 1); g.fillRoundedRect(-26, -78, 52, 20, 4);
  // Glowing eye slits (icy blue glow)
  g.fillStyle(0x44aaff, 0.7); g.fillRect(-22, -76, 14, 8); g.fillRect(8, -76, 14, 8);
}

function drawReact(g: Phaser.GameObjects.Graphics) {
  const lean = -10;
  g.fillStyle(0x000000, 0.15); g.fillEllipse(lean, 100, 110, 14);

  g.fillStyle(0x0a2a44, 1);
  g.fillRoundedRect(lean - 24, 72, 26, 26, { tl: 3, tr: 3, bl: 12, br: 3 });
  g.fillRoundedRect(lean + 8, 72, 26, 26, { tl: 3, tr: 3, bl: 3, br: 12 });

  g.fillStyle(0x4488bb, 1);
  g.fillRoundedRect(lean - 22, 12, 22, 64, 5); g.fillRoundedRect(lean + 8, 12, 22, 64, 5);
  g.fillStyle(0x2266aa, 1);
  g.fillRoundedRect(lean - 24, 44, 26, 18, 5); g.fillRoundedRect(lean + 6, 44, 26, 18, 5);

  g.fillStyle(0x0a2a44, 1); g.fillRect(lean - 24, 10, 56, 8);
  g.fillStyle(0x88eeff, 1); g.fillRect(lean - 5, 11, 18, 6);

  g.fillStyle(0x3366aa, 1); g.fillRoundedRect(lean - 24, -58, 56, 72, 7);
  g.fillStyle(0x5599cc, 1); g.fillRoundedRect(lean - 18, -52, 44, 58, 5);
  g.fillStyle(0xaaddff, 0.2); g.fillRect(lean - 22, -56, 6, 64);
  g.fillStyle(0x88ccff, 0.5);
  g.fillTriangle(lean - 10, -44, lean - 2, -44, lean - 6, -60);
  g.fillTriangle(lean + 4, -44, lean + 12, -44, lean + 8, -56);
  g.fillTriangle(lean + 16, -44, lean + 24, -44, lean + 20, -58);

  g.fillStyle(0x2266aa, 1);
  g.fillEllipse(lean - 34, -50, 32, 26); g.fillEllipse(lean + 42, -50, 32, 26);
  g.fillStyle(0x4488bb, 1);
  g.fillEllipse(lean - 34, -54, 28, 20); g.fillEllipse(lean + 42, -54, 28, 20);

  g.fillStyle(0x4488bb, 1); g.fillRoundedRect(lean - 38, -48, 16, 64, 5);
  g.fillStyle(0x2266aa, 1); g.fillRoundedRect(lean - 40, 14, 18, 22, 5);

  // Shield (same)
  g.fillStyle(0x2266aa, 0.8);
  g.fillRoundedRect(lean - 114, -56, 38, 60, { tl: 10, tr: 10, bl: 18, br: 18 });
  g.fillStyle(0x44aadd, 0.85);
  g.fillRoundedRect(lean - 112, -54, 34, 56, { tl: 8, tr: 8, bl: 14, br: 14 });
  const sc = [lean - 95, -26]; const sr = 16;
  g.lineStyle(2, 0xaaeeff, 0.9);
  g.lineBetween(sc[0] - sr, sc[1], sc[0] + sr, sc[1]);
  g.lineBetween(sc[0], sc[1] - sr, sc[0], sc[1] + sr);
  g.lineStyle(0, 0, 0);
  g.fillStyle(0xaaeeff, 1); g.fillCircle(sc[0], sc[1], 5);

  // Lance RAISED (reacting)
  g.fillStyle(0x4488bb, 1); g.fillRoundedRect(lean + 32, -70, 16, 48, 5);
  g.fillStyle(0x2266aa, 1); g.fillRoundedRect(lean + 30, -24, 18, 22, 5);
  g.fillStyle(0x2266aa, 0.9);
  for (let t = 0; t < 90; t++) {
    g.fillRect(lean + 46 - t * 0.5, -48 - t * 0.9, 10, 8);
  }
  g.fillStyle(0xaaeeff, 1);
  g.fillTriangle(lean + 46, -56, lean + 46, -38, lean - 2, -46);

  g.fillStyle(0x44aacc, 1); g.fillRoundedRect(lean - 8, -64, 24, 12, 4);
  g.fillStyle(0x2266aa, 1);
  g.fillRoundedRect(lean - 28, -110, 64, 52, { tl: 32, tr: 32, bl: 4, br: 4 });
  g.fillStyle(0x4488bb, 1);
  g.fillRoundedRect(lean - 25, -108, 58, 48, { tl: 28, tr: 28, bl: 4, br: 4 });
  g.fillStyle(0x88ccff, 0.9);
  [[lean - 14, -110, lean - 18, -148], [lean + 4, -108, lean + 1, -144], [lean + 20, -110, lean + 17, -146]]
    .forEach(([bx, by, tx, ty]) => g.fillTriangle(bx - 5, by, bx + 5, by, tx, ty));
  g.fillStyle(0x1a5088, 1);
  g.fillRoundedRect(lean - 32, -78, 9, 28, { tl: 3, tr: 0, bl: 8, br: 0 });
  g.fillRoundedRect(lean + 31, -78, 9, 28, { tl: 0, tr: 3, bl: 0, br: 8 });
  g.fillStyle(0x060c18, 1); g.fillRoundedRect(lean - 22, -78, 52, 20, 4);
  g.fillStyle(0x66ccff, 0.9); g.fillRect(lean - 18, -76, 14, 8); g.fillRect(lean + 12, -76, 14, 8);
}
