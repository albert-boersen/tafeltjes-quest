import Phaser from 'phaser';

export function drawIceBackground(scene: Phaser.Scene, W: number, H: number): Phaser.GameObjects.Container {
  const c = scene.add.container(0, 0);
  const g = scene.add.graphics();
  c.add(g);

  // Icy sky
  [[0x060d18, 0], [0x0a1830, 0.25], [0x0d2244, 0.5], [0x081528, 1]].forEach(([col, frac]) => {
    g.fillStyle(col as number, 1);
    g.fillRect(0, (frac as number) * H * 0.55, W, H * 0.55 * 0.28 + 1);
  });

  // Aurora borealis
  [[0x00ffaa, 0.06, 0, 0.3, W * 0.6, 0.12],
   [0x44ffcc, 0.04, W * 0.2, 0.25, W * 0.5, 0.10],
   [0x8844ff, 0.05, W * 0.5, 0.28, W * 0.4, 0.09]]
    .forEach(([col, alpha, ax, aw, aW, aH]) => {
      g.fillStyle(col as number, alpha as number);
      g.fillEllipse((ax as number) + (aW as number) / 2, H * 0.2, aW as number, (aH as number) * H);
    });

  // Stars
  g.fillStyle(0xddeeff, 0.8);
  for (let i = 0; i < 50; i++) {
    const sx = (i * 113.7) % W;
    const sy = (i * 71.3) % (H * 0.5);
    g.fillRect(sx, sy, 1, 1);
    if (i % 5 === 0) g.fillRect(sx - 1, sy, 3, 1);
  }

  // Ice mountains / glaciers
  g.fillStyle(0x0d2a44, 1);
  [[0, .52, 180, .4], [140, .52, 220, .48], [320, .52, 160, .35],
   [440, .52, 240, .45], [640, .52, 180, .38], [W - 200, .52, 200, .44], [W - 50, .52, 140, .32]]
    .forEach(([mx, my, mw, mh]) => g.fillTriangle(mx as number, (my as number) * H, (mx as number) + (mw as number) / 2, (my as number) * H - (mh as number) * H, (mx as number) + (mw as number), (my as number) * H));

  // Glacier highlights (snow on peaks)
  g.fillStyle(0xbbddff, 0.6);
  [[90, .52, 60, .10], [250, .52, 70, .12], [540, .52, 55, .08], [W - 100, .52, 65, .11]]
    .forEach(([mx, my, mw, mh]) => g.fillTriangle((mx as number) - 10, (my as number) * H - (mh as number) * H * 1.5, mx as number, (my as number) * H - (mh as number) * H * 2.5, (mx as number) + 10, (my as number) * H - (mh as number) * H * 1.5));

  // Frozen ground
  g.fillStyle(0x0a1c32, 1); g.fillRect(0, H * 0.53, W, H * 0.47);
  g.fillStyle(0xaaccee, 0.15); g.fillRect(0, H * 0.53, W, 10);

  // Ice cracks
  g.lineStyle(2, 0x44aadd, 0.4);
  [[0.05, 0.56, 0.2, 0.59], [0.25, 0.57, 0.42, 0.54], [0.55, 0.58, 0.7, 0.55], [0.75, 0.56, 0.9, 0.6]]
    .forEach(([x1, y1, x2, y2]) => g.lineBetween(x1 * W, y1 * H, x2 * W, y2 * H));

  // Ice spikes/stalagmites
  g.fillStyle(0x1a3a5a, 1);
  for (let ix = 20; ix < W; ix += 45) {
    const ih = 20 + (ix * 17 % 35);
    const iw = 10 + (ix * 7 % 10);
    g.fillTriangle(ix, H * 0.53, ix + iw / 2, H * 0.53 - ih, ix + iw, H * 0.53);
    g.fillStyle(0x5599cc, 0.35);
    g.fillTriangle(ix + iw * 0.15, H * 0.53, ix + iw / 2, H * 0.53 - ih * 0.7, ix + iw * 0.4, H * 0.53);
    g.fillStyle(0x1a3a5a, 1);
  }

  // Snow patches
  g.fillStyle(0xaaccee, 0.25);
  for (let sx = 0; sx < W; sx += 60) {
    g.fillEllipse(sx + 20, H * 0.53 + 8, 40 + (sx % 30), 10);
  }

  return c;
}
