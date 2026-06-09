import Phaser from 'phaser';

export interface FireSpiritHandle {
  container: Phaser.GameObjects.Container;
  setReacting(on: boolean): void;
}

export function createFireSpirit(scene: Phaser.Scene, x: number, y: number): FireSpiritHandle {
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

// Fire Spirit: floating flame entity, faces LEFT. No legs.
// Bounding box: left≈110px, right≈80px, top≈150px, foot≈100px (flame base)

function drawIdle(g: Phaser.GameObjects.Graphics) {
  // Glow aura
  g.fillStyle(0xff4400, 0.08); g.fillCircle(-20, -30, 110);
  g.fillStyle(0xff8800, 0.07); g.fillCircle(-20, -30, 80);

  // Flame body (large teardrop / multiple overlapping flames)
  g.fillStyle(0xcc2200, 1);
  g.fillTriangle(-60, 80, 40, 80, -10, -100);
  g.fillStyle(0xff4400, 1);
  g.fillTriangle(-50, 80, 30, 80, -10, -80);
  g.fillStyle(0xff7700, 1);
  g.fillTriangle(-40, 80, 20, 80, -10, -60);
  g.fillStyle(0xffaa00, 1);
  g.fillTriangle(-28, 70, 10, 70, -10, -40);
  g.fillStyle(0xffdd44, 1);
  g.fillTriangle(-16, 60, 0, 60, -8, -20);

  // Inner bright core
  g.fillStyle(0xffffff, 0.9); g.fillEllipse(-8, 20, 28, 50);
  g.fillStyle(0xffffaa, 0.7); g.fillEllipse(-8, 10, 20, 40);

  // Side flame tendrils (left, reaching toward knight)
  g.fillStyle(0xff5500, 0.85);
  g.fillTriangle(-50, -10, -10, -20, -80, -60);
  g.fillTriangle(-40, 10, -8, 0, -100, -30);
  g.fillStyle(0xff8800, 0.7);
  g.fillTriangle(-48, -8, -12, -16, -78, -52);

  // Right side tendrils
  g.fillStyle(0xff5500, 0.6);
  g.fillTriangle(20, -10, -6, -20, 60, -50);
  g.fillStyle(0xff8800, 0.5);
  g.fillTriangle(18, -6, -4, -16, 55, -42);

  // Eyes
  g.fillStyle(0xffffff, 1); g.fillEllipse(-36, -28, 26, 22); g.fillEllipse(10, -26, 22, 18);
  g.fillStyle(0xff6600, 1); g.fillEllipse(-36, -28, 18, 15); g.fillEllipse(10, -26, 15, 12);
  g.fillStyle(0x220000, 1); g.fillEllipse(-36, -28, 10, 14); g.fillEllipse(10, -26, 8, 12);
  // Eye glow
  g.fillStyle(0xffaa00, 0.5); g.fillCircle(-36, -28, 22); g.fillCircle(10, -26, 18);

  // Mouth (grin)
  g.lineStyle(3, 0x220000, 1);
  g.lineBetween(-46, -12, -24, -8); g.lineBetween(-24, -8, -12, -12);
  g.lineStyle(0, 0, 0);
  // Teeth
  g.fillStyle(0xffffff, 0.9);
  [[-42, -12], [-34, -10], [-26, -10], [-18, -11]].forEach(([tx, ty]) =>
    g.fillTriangle(tx, ty, tx + 6, ty, tx + 3, ty + 7)
  );
}

function drawReact(g: Phaser.GameObjects.Graphics) {
  // Expanded, brighter — erupting
  g.fillStyle(0xff4400, 0.14); g.fillCircle(-20, -30, 140);
  g.fillStyle(0xff8800, 0.10); g.fillCircle(-20, -30, 100);

  // Bigger flame body
  g.fillStyle(0xcc2200, 1); g.fillTriangle(-80, 90, 60, 90, -10, -140);
  g.fillStyle(0xff4400, 1); g.fillTriangle(-68, 90, 48, 90, -10, -120);
  g.fillStyle(0xff7700, 1); g.fillTriangle(-54, 88, 36, 88, -10, -95);
  g.fillStyle(0xffaa00, 1); g.fillTriangle(-38, 80, 22, 80, -8, -70);
  g.fillStyle(0xffdd44, 1); g.fillTriangle(-22, 70, 8, 70, -8, -40);
  g.fillStyle(0xffffff, 0.95); g.fillEllipse(-8, 20, 36, 64);

  // Erupting tendrils (longer / brighter)
  g.fillStyle(0xff5500, 0.9);
  g.fillTriangle(-60, -10, -10, -25, -120, -90);
  g.fillTriangle(-50, 15, -8, 0, -130, -40);
  g.fillStyle(0xffaa00, 0.8);
  g.fillTriangle(-56, -8, -14, -20, -115, -78);
  g.fillStyle(0xff5500, 0.7);
  g.fillTriangle(30, -10, -4, -22, 90, -70);
  g.fillStyle(0xffdd00, 0.5);
  g.fillTriangle(-10, -130, -30, -100, 10, -100); // top spike

  // Wide eyes
  g.fillStyle(0xffffff, 1); g.fillEllipse(-36, -28, 30, 26); g.fillEllipse(10, -26, 26, 22);
  g.fillStyle(0xff8800, 1); g.fillEllipse(-36, -28, 22, 18); g.fillEllipse(10, -26, 18, 15);
  g.fillStyle(0x220000, 1); g.fillEllipse(-36, -28, 12, 16); g.fillEllipse(10, -26, 10, 14);
  g.fillStyle(0xffaa00, 0.7); g.fillCircle(-36, -28, 28); g.fillCircle(10, -26, 22);

  // Open roaring mouth
  g.fillStyle(0x220000, 1); g.fillEllipse(-28, -8, 50, 24);
  g.fillStyle(0xff2200, 0.8); g.fillEllipse(-28, -8, 38, 16);
  g.fillStyle(0xffffff, 0.9);
  [[-46, -16], [-36, -18], [-26, -18], [-16, -16], [-6, -14]].forEach(([tx, ty]) =>
    g.fillTriangle(tx, ty, tx + 8, ty, tx + 4, ty + 9)
  );
}
