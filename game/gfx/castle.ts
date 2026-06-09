import Phaser from 'phaser';

export function drawCastleBackground(scene: Phaser.Scene, W: number, H: number) {
  const g = scene.add.graphics();

  // Night sky gradient (layered rectangles)
  const skyColors = [0x050012, 0x0d0530, 0x1a0a2e, 0x2d1060];
  const skyHeight = H * 0.55;
  skyColors.forEach((c, i) => {
    g.fillStyle(c, 1);
    const y = (i / skyColors.length) * skyHeight;
    const h = skyHeight / skyColors.length + 1;
    g.fillRect(0, y, W, h);
  });

  // Moon
  g.fillStyle(0xfffce8, 1);
  g.fillCircle(W * 0.82, 70, 38);
  g.fillStyle(0x1a0a2e, 1);
  g.fillCircle(W * 0.82 + 12, 62, 32); // crescent cutout

  // Distant mountains
  g.fillStyle(0x1a0640, 1);
  const mountains = [
    [0, H * 0.52, 160, H * 0.3],
    [120, H * 0.52, 200, H * 0.38],
    [280, H * 0.52, 140, H * 0.25],
    [380, H * 0.52, 220, H * 0.42],
    [560, H * 0.52, 160, H * 0.28],
    [680, H * 0.52, 240, H * 0.45],
    [880, H * 0.52, 180, H * 0.32],
  ];
  mountains.forEach(([mx, my, mw, mh]) => {
    g.fillTriangle(mx, my, mx + mw / 2, my - mh, mx + mw, my);
  });

  // Ground / grass
  g.fillStyle(0x0d2211, 1);
  g.fillRect(0, H * 0.52, W, H * 0.48);

  g.fillStyle(0x163318, 1);
  g.fillRect(0, H * 0.52, W, 14);

  // Castle wall
  const wallY = H * 0.34;
  const wallH = H - wallY;
  g.fillStyle(0x2c1f5e, 1);
  g.fillRect(0, wallY, W, wallH);

  // Castle battlements (top)
  g.fillStyle(0x3a2878, 1);
  const battlementW = 36, battlementH = 28, battlementGap = 14;
  for (let bx = 0; bx < W; bx += battlementW + battlementGap) {
    g.fillRect(bx, wallY - battlementH, battlementW, battlementH + 4);
  }

  // Castle gate (center arch)
  const gateX = W / 2 - 55;
  const gateW = 110;
  const gateY = H * 0.52;
  const gateH = H * 0.18;
  g.fillStyle(0x08040f, 1);
  g.fillRect(gateX, gateY, gateW, gateH);
  // arch top
  g.fillEllipse(W / 2, gateY, gateW, gateH * 0.6);

  // Gate portcullis bars
  g.lineStyle(3, 0x3d2b00, 1);
  for (let bx = gateX + 10; bx < gateX + gateW; bx += 18) {
    g.lineBetween(bx, gateY, bx, gateY + gateH);
  }
  for (let by = gateY + 10; by < gateY + gateH; by += 18) {
    g.lineBetween(gateX, by, gateX + gateW, by);
  }

  // Towers (left + right)
  drawTower(scene, 60, H * 0.25, 90, H - H * 0.25);
  drawTower(scene, W - 60, H * 0.25, 90, H - H * 0.25);

  // Tower windows
  drawWindow(scene, 60, H * 0.34);
  drawWindow(scene, W - 60, H * 0.34);

  // Torches on towers
  drawTorch(scene, 60, H * 0.4);
  drawTorch(scene, W - 60, H * 0.4);

  // Wall detail: stone lines
  g.lineStyle(1, 0x1a1040, 0.5);
  for (let wy = wallY + 30; wy < H; wy += 30) {
    g.lineBetween(0, wy, W, wy);
  }
  for (let wx = 0; wx < W; wx += 60) {
    g.lineBetween(wx, wallY, wx, H);
  }

  // Grass detail
  g.fillStyle(0x1a4020, 1);
  for (let gx = 0; gx < W; gx += 40) {
    const gh = Phaser.Math.Between(4, 14);
    g.fillTriangle(gx, H * 0.52 + 14, gx + 10, H * 0.52 + 14 - gh, gx + 20, H * 0.52 + 14);
  }
}

function drawTower(scene: Phaser.Scene, cx: number, topY: number, w: number, h: number) {
  const g = scene.add.graphics();
  g.fillStyle(0x3a2878, 1);
  g.fillRect(cx - w / 2, topY, w, h);

  // Tower crenellations
  g.fillStyle(0x4a338a, 1);
  const cW = 16, cH = 20, cGap = 8;
  for (let cx2 = cx - w / 2; cx2 < cx + w / 2; cx2 += cW + cGap) {
    g.fillRect(cx2, topY - cH, cW, cH);
  }

  // Tower shading (left edge darker)
  g.fillStyle(0x1a0a40, 0.4);
  g.fillRect(cx - w / 2, topY, 14, h);
}

function drawWindow(scene: Phaser.Scene, cx: number, y: number) {
  const g = scene.add.graphics();
  g.fillStyle(0xffd080, 0.9);
  g.fillRect(cx - 12, y, 24, 32);
  g.fillEllipse(cx, y, 24, 16);

  // Window cross
  g.lineStyle(2, 0x3a2878, 1);
  g.lineBetween(cx, y - 8, cx, y + 32);
  g.lineBetween(cx - 12, y + 12, cx + 12, y + 12);

  // Glow around window
  const glow = scene.add.graphics();
  glow.fillStyle(0xffd080, 0.07);
  glow.fillCircle(cx, y + 16, 36);
}

function drawTorch(scene: Phaser.Scene, cx: number, y: number) {
  const g = scene.add.graphics();
  // Handle
  g.fillStyle(0x5a3a00, 1);
  g.fillRect(cx - 3, y - 20, 6, 20);
  // Bracket
  g.fillRect(cx - 10, y - 20, 20, 4);

  // Flame glow
  const glow = scene.add.graphics();
  glow.fillStyle(0xff6600, 0.18);
  glow.fillCircle(cx, y - 24, 22);

  // Flame
  g.fillStyle(0xff8800, 1);
  g.fillTriangle(cx - 6, y - 20, cx + 6, y - 20, cx, y - 36);
  g.fillStyle(0xffcc00, 1);
  g.fillTriangle(cx - 3, y - 20, cx + 3, y - 20, cx, y - 30);
}
