import Phaser from 'phaser';

export interface SeaMonsterHandle {
  container: Phaser.GameObjects.Container;
  setReacting(on: boolean): void;
}

export function createSeaMonster(scene: Phaser.Scene, x: number, y: number): SeaMonsterHandle {
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

// Sea Monster: squid/octopus-like. Faces LEFT.
// Bounding box: left≈155px (tentacle tip), right≈80px, top≈148px (top of body), foot≈110px

function drawTentacles(g: Phaser.GameObjects.Graphics, color: number, reacting: boolean) {
  // Idle: curling tentacles  React: extended toward knight (left)
  const spread = reacting ? 1.4 : 1.0;

  g.fillStyle(color, 1);
  // Bottom tentacles (reaching down/forward)
  const tentacles = reacting
    ? [[-30, 60, -120, 110], [-10, 62, -80, 115], [10, 62, -50, 118], [30, 60, -30, 108], [50, 55, 10, 100]]
    : [[-30, 60, -80, 100], [-10, 62, -50, 108], [10, 62, -20, 110], [30, 60, 10, 104], [50, 55, 40, 98]];

  tentacles.forEach(([sx, sy, ex, ey]) => {
    g.fillEllipse((sx + ex) / 2, (sy + ey) / 2, Math.abs(ex - sx) * 0.6 + 14, Math.abs(ey - sy) * 0.55 + 14);
    g.fillCircle(ex, ey, 7); // sucker tip
  });

  // Extended attack tentacles on the left side
  if (reacting) {
    g.fillStyle(color, 0.9);
    [[-60, -20, -150, -40], [-50, 10, -155, 10], [-55, 40, -145, 55]].forEach(([sx, sy, ex, ey]) => {
      // Draw as a curved chain of ellipses
      for (let t = 0; t <= 1; t += 0.2) {
        const px = sx + (ex - sx) * t;
        const py = sy + (ey - sy) * t;
        const w = 14 - t * 4;
        g.fillEllipse(px, py, w, w * 0.8);
      }
      g.fillCircle(ex, ey, 8); // sucker tip
    });
  }
}

function drawBody(g: Phaser.GameObjects.Graphics, col1: number, col2: number, col3: number) {
  // Main body bulge
  g.fillStyle(col1, 1); g.fillEllipse(-10, -20, 150, 130);
  g.fillStyle(col2, 1); g.fillEllipse(-14, -24, 136, 118);

  // Mantle/head
  g.fillStyle(col1, 1); g.fillEllipse(-22, -90, 120, 100);
  g.fillStyle(col2, 1); g.fillEllipse(-24, -92, 108, 90);
  // Mantle tip (top)
  g.fillStyle(col1, 1); g.fillTriangle(-50, -130, 0, -130, -24, -148);
  g.fillStyle(col2, 0.8); g.fillTriangle(-44, -128, -4, -128, -24, -144);

  // Skin texture / pattern
  g.fillStyle(col3, 0.3);
  [[-20, -60, 28, 18], [-40, -30, 20, 14], [10, -40, 22, 16], [-14, 0, 30, 20]]
    .forEach(([ex, ey, ew, eh]) => g.fillEllipse(ex, ey, ew, eh));
}

function drawEye(g: Phaser.GameObjects.Graphics, reacting: boolean) {
  const er = reacting ? 30 : 24;
  // Large main eye (left-facing)
  g.fillStyle(0xddffee, 1); g.fillCircle(-30, -80, er + 4);
  g.fillStyle(0x22aa55, 1); g.fillCircle(-30, -80, er);
  g.fillStyle(0x002211, 1);
  if (reacting) {
    // Slit pupil: wider
    g.fillEllipse(-30, -80, er * 0.6, er * 1.8);
  } else {
    g.fillEllipse(-30, -80, er * 0.45, er * 1.6);
  }
  g.fillStyle(0xffffff, 0.8); g.fillCircle(-38, -88, 7); g.fillCircle(-36, -84, 3);

  // Small secondary eye
  g.fillStyle(0xcceecc, 1); g.fillCircle(8, -90, 14);
  g.fillStyle(0x22aa44, 1); g.fillCircle(8, -90, 10);
  g.fillStyle(0x002211, 1); g.fillEllipse(8, -90, 5, 14);
  g.fillStyle(0xffffff, 0.7); g.fillCircle(4, -96, 4);
}

function drawIdle(g: Phaser.GameObjects.Graphics) {
  g.fillStyle(0x000000, 0.15); g.fillEllipse(0, 100, 130, 14);

  // Tentacles (behind body)
  drawTentacles(g, 0x0d4a2a, false);

  drawBody(g, 0x0d5c34, 0x12804a, 0x44cc88);

  // Fin ridges along mantle
  g.fillStyle(0x0a4428, 1);
  [[-60, -110, -55, -130, -50, -112], [-36, -116, -28, -138, -20, -118], [-8, -112, -4, -128, 2, -114]]
    .forEach(([x1, y1, x2, y2, x3, y3]) => g.fillTriangle(x1, y1, x2, y2, x3, y3));

  drawEye(g, false);

  // Closed beak
  g.fillStyle(0x0a3020, 1); g.fillEllipse(-56, -50, 28, 18);
  g.fillStyle(0xddcc88, 1); g.fillEllipse(-56, -48, 22, 8); // beak tip (yellowish)
  g.fillStyle(0xcc9944, 0.8); g.fillRect(-68, -50, 24, 4);
  g.fillStyle(0xbbaa66, 0.6); g.fillRect(-62, -48, 14, 3);

  // Suckers on body sides (decorative)
  g.fillStyle(0x0a3020, 0.5);
  [[-50, -10], [-30, 20], [20, -20], [40, 10]].forEach(([sx, sy]) => g.fillCircle(sx, sy, 5));
}

function drawReact(g: Phaser.GameObjects.Graphics) {
  g.fillStyle(0x000000, 0.15); g.fillEllipse(0, 100, 130, 14);

  // Extended tentacles
  drawTentacles(g, 0x0f5a32, true);

  drawBody(g, 0x117040, 0x189a58, 0x55ddaa);

  // Fin ridges (raised)
  g.fillStyle(0x0a4428, 1);
  [[-60, -110, -55, -134, -50, -112], [-36, -116, -28, -142, -20, -118], [-8, -112, -4, -132, 2, -114]]
    .forEach(([x1, y1, x2, y2, x3, y3]) => g.fillTriangle(x1, y1, x2, y2, x3, y3));

  drawEye(g, true);

  // Open beak (attacking)
  g.fillStyle(0x0a3020, 1); g.fillEllipse(-56, -48, 32, 28);
  g.fillStyle(0x111111, 1); g.fillEllipse(-56, -50, 24, 20);
  // Beak halves (open)
  g.fillStyle(0xddcc88, 1); g.fillEllipse(-56, -58, 26, 12); // upper beak
  g.fillStyle(0xcc9944, 1); g.fillEllipse(-56, -40, 26, 12); // lower beak
  // Teeth fringe
  g.fillStyle(0xffffff, 0.7);
  [[-64, -54], [-56, -54], [-48, -54]].forEach(([tx, ty]) => g.fillTriangle(tx, ty, tx + 6, ty, tx + 3, ty + 9));
  // Ink spray suggestion
  g.fillStyle(0x000022, 0.5);
  g.fillCircle(-90, -56, 12); g.fillCircle(-108, -50, 8); g.fillCircle(-96, -46, 6);
}
