import Phaser from 'phaser';

export function drawOceanBackground(scene: Phaser.Scene, W: number, H: number): Phaser.GameObjects.Container {
  const c = scene.add.container(0, 0);
  const g = scene.add.graphics();
  c.add(g);

  // Deep underwater gradient
  [[0x000d1a, 0], [0x001830, 0.25], [0x002244, 0.5], [0x001833, 1]].forEach(([col, frac]) => {
    g.fillStyle(col as number, 1);
    g.fillRect(0, (frac as number) * H * 0.55, W, H * 0.55 * 0.28 + 1);
  });

  // Light rays from surface
  g.fillStyle(0x0066aa, 0.07);
  for (let rx = 0; rx < W; rx += 80) {
    g.fillTriangle(rx + 10, 0, rx + 40, H * 0.55, rx + 70, 0);
  }

  // Distant coral/rock formations
  g.fillStyle(0x001520, 1);
  [[W * 0.1, H * 0.52, 120, H * 0.22], [W * 0.5, H * 0.52, 160, H * 0.35],
   [W * 0.75, H * 0.52, 140, H * 0.25], [W - 40, H * 0.52, 100, H * 0.18]]
    .forEach(([mx, my, mw, mh]) => g.fillTriangle((mx as number) - (mw as number) / 2, my as number, mx as number, (my as number) - (mh as number), (mx as number) + (mw as number) / 2, my as number));

  // Sandy/rocky ocean floor
  g.fillStyle(0x081420, 1); g.fillRect(0, H * 0.53, W, H * 0.47);
  g.fillStyle(0x0a2030, 0.8); g.fillRect(0, H * 0.53, W, 16);

  // Coral formations
  const corals: [number, number, number][] = [
    [W * 0.08, H * 0.54, 0xff3366], [W * 0.22, H * 0.54, 0xff6633],
    [W * 0.55, H * 0.54, 0xff44aa], [W * 0.7, H * 0.54, 0xff8833],
    [W * 0.88, H * 0.54, 0xee3388],
  ];
  corals.forEach(([cx, cy, col]) => {
    g.fillStyle(col, 0.85);
    // Main branch
    g.fillRect(cx - 3, cy - 30, 6, 30);
    // Side branches
    g.fillRect(cx - 14, cy - 20, 10, 4); g.fillRect(cx + 4, cy - 25, 10, 4);
    g.fillRect(cx - 10, cy - 12, 8, 4);
    // Tips
    g.fillCircle(cx, cy - 30, 5); g.fillCircle(cx - 9, cy - 20, 4);
    g.fillCircle(cx + 9, cy - 25, 4); g.fillCircle(cx - 6, cy - 12, 3);
  });

  // Seaweed
  g.lineStyle(0, 0, 0);
  const weedPositions = [W * 0.15, W * 0.3, W * 0.45, W * 0.62, W * 0.78, W * 0.93];
  weedPositions.forEach(wx => {
    g.fillStyle(0x1a5c2a, 0.8);
    const wh = 35 + (wx % 40);
    for (let i = 0; i < 4; i++) {
      const px = wx + (i % 2 === 0 ? -5 : 5);
      g.fillEllipse(px, H * 0.53 - i * (wh / 4), 8, wh / 5);
    }
  });

  // Bioluminescent spots on floor
  g.fillStyle(0x00ffcc, 0.18);
  for (let i = 0; i < 22; i++) {
    const bx = (i * 127.3) % W;
    const by = H * 0.55 + (i * 43.7) % (H * 0.12);
    g.fillCircle(bx, by, 4 + (i % 3) * 2);
  }

  // Bubbles
  g.fillStyle(0x44aadd, 0.3);
  for (let i = 0; i < 20; i++) {
    const bx = (i * 113.9) % (W * 0.8) + W * 0.1;
    const by = H * 0.1 + (i * 89.1) % (H * 0.45);
    const br = 2 + (i % 4);
    g.fillCircle(bx, by, br);
    g.lineStyle(1, 0x88ccee, 0.4);
    g.strokeCircle(bx, by, br);
  }

  return c;
}
