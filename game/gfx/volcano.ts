import Phaser from 'phaser';

export function drawVolcanoBackground(scene: Phaser.Scene, W: number, H: number): Phaser.GameObjects.Container {
  const c = scene.add.container(0, 0);
  const g = scene.add.graphics();
  c.add(g);

  // Infernal sky gradient
  [[0x0d0000, 0], [0x2a0500, 0.3], [0x4a0d00, 0.6], [0x1a0300, 1]].forEach(([col, frac]) => {
    g.fillStyle(col as number, 1);
    const y = (frac as number) * H * 0.55;
    g.fillRect(0, y, W, H * 0.55 * 0.28 + 1);
  });

  // Smoke clouds
  g.fillStyle(0x2a1010, 0.5);
  [[W * 0.3, 60, 120, 50], [W * 0.6, 40, 100, 40], [W * 0.15, 90, 90, 38], [W * 0.8, 80, 110, 45]]
    .forEach(([ex, ey, ew, eh]) => g.fillEllipse(ex as number, ey as number, ew as number, eh as number));

  // Volcano mountains
  g.fillStyle(0x1a0500, 1);
  [[W * 0.5, H * 0.55, W * 0.5, H * 0.48],
   [W * 0.15, H * 0.54, W * 0.28, H * 0.32],
   [W * 0.85, H * 0.54, W * 0.28, H * 0.3]]
    .forEach(([mx, my, mw, mh]) =>
      g.fillTriangle((mx as number) - (mw as number) / 2, my as number, mx as number, (my as number) - (mh as number), (mx as number) + (mw as number) / 2, my as number)
    );

  // Volcano crater glow
  g.fillStyle(0xff4400, 0.3); g.fillEllipse(W * 0.5, H * 0.07, 80, 30);
  g.fillStyle(0xff8800, 0.2); g.fillEllipse(W * 0.5, H * 0.08, 55, 20);

  // Lava rivers on volcano flanks
  g.fillStyle(0xff5500, 0.7);
  g.fillRect(W * 0.5 - 8, H * 0.1, 16, H * 0.44);
  g.fillStyle(0xff8800, 0.5);
  g.fillRect(W * 0.5 - 4, H * 0.1, 8, H * 0.44);

  // Ground: cracked dark rock
  g.fillStyle(0x120400, 1); g.fillRect(0, H * 0.53, W, H * 0.47);
  g.fillStyle(0x2a0800, 1); g.fillRect(0, H * 0.53, W, 12);

  // Lava cracks in ground
  g.fillStyle(0xff5500, 0.8);
  [[0.1, 0.56, 0.28, 0.59], [0.35, 0.57, 0.55, 0.62], [0.6, 0.55, 0.8, 0.58],
   [0.2, 0.64, 0.45, 0.67], [0.5, 0.63, 0.75, 0.65]]
    .forEach(([x1, y1, x2, y2]) => {
      g.lineStyle(3, 0xff5500, 0.8);
      g.lineBetween(x1 * W, y1 * H, x2 * W, y2 * H);
      g.lineStyle(1, 0xff9900, 0.6);
      g.lineBetween(x1 * W, y1 * H, x2 * W, y2 * H);
    });

  // Lava glow on ground
  g.fillStyle(0xff4400, 0.12);
  g.fillRect(0, H * 0.53, W, 30);

  // Rocky spires
  g.fillStyle(0x1e0600, 1);
  [[W * 0.08, H * 0.53, 18, 55], [W * 0.22, H * 0.53, 14, 42], [W * 0.72, H * 0.53, 16, 48], [W * 0.91, H * 0.53, 20, 60]]
    .forEach(([sx, sy, sw, sh]) => g.fillTriangle((sx as number) - (sw as number) / 2, sy as number, sx as number, (sy as number) - (sh as number), (sx as number) + (sw as number) / 2, sy as number));

  return c;
}
