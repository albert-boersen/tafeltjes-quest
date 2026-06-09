import Phaser from 'phaser';

export function drawCastleBackground(scene: Phaser.Scene, W: number, H: number): Phaser.GameObjects.Container {
  const c = scene.add.container(0, 0);

  const g = scene.add.graphics();
  c.add(g);

  const skyColors = [0x050012, 0x0d0530, 0x1a0a2e, 0x2d1060];
  const skyHeight = H * 0.55;
  skyColors.forEach((col, i) => {
    g.fillStyle(col, 1);
    g.fillRect(0, (i / skyColors.length) * skyHeight, W, skyHeight / skyColors.length + 1);
  });

  // Moon
  g.fillStyle(0xfffce8, 1); g.fillCircle(W * 0.82, 70, 38);
  g.fillStyle(0x1a0a2e, 1); g.fillCircle(W * 0.82 + 12, 62, 32);

  // Mountains
  g.fillStyle(0x1a0640, 1);
  [[0, .52, 160, .30], [120, .52, 200, .38], [280, .52, 140, .25],
   [380, .52, 220, .42], [560, .52, 160, .28], [680, .52, 240, .45], [880, .52, 180, .32]]
    .forEach(([mx, my, mw, mh]) => g.fillTriangle(mx, my * H, mx + mw / 2, my * H - mh * H, mx + mw, my * H));

  // Ground
  g.fillStyle(0x0d2211, 1); g.fillRect(0, H * 0.52, W, H * 0.48);
  g.fillStyle(0x163318, 1); g.fillRect(0, H * 0.52, W, 14);

  // Castle wall
  const wallY = H * 0.34;
  g.fillStyle(0x2c1f5e, 1); g.fillRect(0, wallY, W, H - wallY);
  g.fillStyle(0x3a2878, 1);
  for (let bx = 0; bx < W; bx += 50) g.fillRect(bx, wallY - 28, 36, 32);

  // Gate
  const gateX = W / 2 - 55, gateW = 110, gateY = H * 0.52, gateH = H * 0.18;
  g.fillStyle(0x08040f, 1);
  g.fillRect(gateX, gateY, gateW, gateH);
  g.fillEllipse(W / 2, gateY, gateW, gateH * 0.6);
  g.lineStyle(3, 0x3d2b00, 1);
  for (let bx = gateX + 10; bx < gateX + gateW; bx += 18) g.lineBetween(bx, gateY, bx, gateY + gateH);
  for (let by = gateY + 10; by < gateY + gateH; by += 18) g.lineBetween(gateX, by, gateX + gateW, by);

  // Towers
  c.add(makeTower(scene, 60, H * 0.25, 90, H));
  c.add(makeTower(scene, W - 60, H * 0.25, 90, H));
  c.add(makeWindow(scene, 60, H * 0.34));
  c.add(makeWindow(scene, W - 60, H * 0.34));
  c.add(makeTorch(scene, 60, H * 0.4));
  c.add(makeTorch(scene, W - 60, H * 0.4));

  // Stone lines
  g.lineStyle(1, 0x1a1040, 0.5);
  for (let wy = wallY + 30; wy < H; wy += 30) g.lineBetween(0, wy, W, wy);
  for (let wx = 0; wx < W; wx += 60) g.lineBetween(wx, wallY, wx, H);

  // Grass tufts
  g.fillStyle(0x1a4020, 1);
  for (let gx = 0; gx < W; gx += 40) {
    const gh = Phaser.Math.Between(4, 14);
    g.fillTriangle(gx, H * 0.52 + 14, gx + 10, H * 0.52 + 14 - gh, gx + 20, H * 0.52 + 14);
  }

  return c;
}

function makeTower(scene: Phaser.Scene, cx: number, topY: number, w: number, H: number): Phaser.GameObjects.Graphics {
  const g = scene.add.graphics();
  g.fillStyle(0x3a2878, 1); g.fillRect(cx - w / 2, topY, w, H - topY);
  g.fillStyle(0x4a338a, 1);
  for (let x2 = cx - w / 2; x2 < cx + w / 2; x2 += 24) g.fillRect(x2, topY - 20, 16, 20);
  g.fillStyle(0x1a0a40, 0.4); g.fillRect(cx - w / 2, topY, 14, H - topY);
  return g;
}

function makeWindow(scene: Phaser.Scene, cx: number, y: number): Phaser.GameObjects.Graphics {
  const g = scene.add.graphics();
  g.fillStyle(0xffd080, 0.9); g.fillRect(cx - 12, y, 24, 32); g.fillEllipse(cx, y, 24, 16);
  g.lineStyle(2, 0x3a2878, 1);
  g.lineBetween(cx, y - 8, cx, y + 32); g.lineBetween(cx - 12, y + 12, cx + 12, y + 12);
  g.fillStyle(0xffd080, 0.07); g.fillCircle(cx, y + 16, 36);
  return g;
}

function makeTorch(scene: Phaser.Scene, cx: number, y: number): Phaser.GameObjects.Graphics {
  const g = scene.add.graphics();
  g.fillStyle(0x5a3a00, 1); g.fillRect(cx - 3, y - 20, 6, 20); g.fillRect(cx - 10, y - 20, 20, 4);
  g.fillStyle(0xff6600, 0.18); g.fillCircle(cx, y - 24, 22);
  g.fillStyle(0xff8800, 1); g.fillTriangle(cx - 6, y - 20, cx + 6, y - 20, cx, y - 36);
  g.fillStyle(0xffcc00, 1); g.fillTriangle(cx - 3, y - 20, cx + 3, y - 20, cx, y - 30);
  return g;
}
