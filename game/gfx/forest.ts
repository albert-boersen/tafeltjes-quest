import Phaser from 'phaser';

export function drawForestBackground(scene: Phaser.Scene, W: number, H: number): Phaser.GameObjects.Container {
  const c = scene.add.container(0, 0);
  const g = scene.add.graphics();
  c.add(g);

  // Dark teal sky
  const skyH = H * 0.55;
  [[0x010f08, 0.00], [0x041a0e, 0.25], [0x0a2e18, 0.55], [0x142e1e, 1.0]].forEach(([col, frac]) => {
    g.fillStyle(col as number, 1);
    g.fillRect(0, (frac as number) * skyH, W, skyH * 0.28 + 1);
  });

  // Moon (different position from castle)
  g.fillStyle(0xe8ffe0, 1); g.fillCircle(W * 0.18, 65, 32);
  g.fillStyle(0x041a0e, 1); g.fillCircle(W * 0.18 - 10, 58, 26);

  // Stars
  g.fillStyle(0xffffff, 0.7);
  for (let i = 0; i < 40; i++) {
    const sx = (i * 137.5) % W;
    const sy = (i * 79.3) % (skyH * 0.7);
    g.fillRect(sx, sy, i % 3 === 0 ? 2 : 1, i % 3 === 0 ? 2 : 1);
  }

  // Distant tree line (dark silhouettes, far)
  g.fillStyle(0x051a0a, 1);
  for (let tx = -30; tx < W + 30; tx += 55) {
    const th = 70 + (tx * 17 % 60);
    g.fillTriangle(tx, H * 0.52, tx + 28, H * 0.52 - th, tx + 56, H * 0.52);
  }

  // Mid ground trees (medium green)
  g.fillStyle(0x0d3518, 1);
  for (let tx = -20; tx < W + 20; tx += 38) {
    const th = 90 + (tx * 23 % 80);
    g.fillTriangle(tx - 5, H * 0.54, tx + 19, H * 0.54 - th, tx + 44, H * 0.54);
    g.fillTriangle(tx - 5, H * 0.54 - 20, tx + 19, H * 0.54 - th - 30, tx + 44, H * 0.54 - 20);
  }

  // Ground
  g.fillStyle(0x071409, 1); g.fillRect(0, H * 0.53, W, H * 0.47);
  g.fillStyle(0x0e2e14, 1); g.fillRect(0, H * 0.53, W, 18);

  // Tree trunks
  g.fillStyle(0x2a1808, 1);
  for (let tx = 30; tx < W; tx += 80) {
    g.fillRect(tx - 7, H * 0.44, 14, H * 0.1);
  }

  // Foreground foliage clusters
  g.fillStyle(0x0a2812, 1);
  [[0, .6, 80, 120], [W * 0.15, .56, 100, 150], [W * 0.75, .58, 90, 130], [W, .6, 80, 110]]
    .forEach(([fx, fy, fw, fh]) => {
      g.fillEllipse(fx as number, (fy as number) * H, fw as number, fh as number);
    });

  // Glowing mushrooms
  const mushPos = [W * 0.12, W * 0.35, W * 0.6, W * 0.88];
  mushPos.forEach(mx => {
    const my = H * 0.54;
    g.fillStyle(0xdd4488, 0.9); g.fillEllipse(mx, my - 8, 16, 10);
    g.fillStyle(0xffffff, 0.6);
    g.fillRect(mx - 2, my - 8, 4, 14);
    g.fillStyle(0xff66aa, 0.2); g.fillCircle(mx, my - 10, 14);
  });

  // Fireflies
  g.fillStyle(0xccff88, 0.8);
  for (let i = 0; i < 18; i++) {
    const fx = (i * 131.7) % (W * 0.8) + W * 0.1;
    const fy = H * 0.3 + (i * 97.3) % (H * 0.25);
    g.fillCircle(fx, fy, 2);
    g.fillStyle(0xccff88, 0.12); g.fillCircle(fx, fy, 6);
    g.fillStyle(0xccff88, 0.8);
  }

  return c;
}
