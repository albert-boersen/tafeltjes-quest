import Phaser from 'phaser';

export interface TrollHandle {
  container: Phaser.GameObjects.Container;
  setReacting(on: boolean): void;
}

export function createTroll(scene: Phaser.Scene, x: number, y: number): TrollHandle {
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

// Troll faces LEFT (head at negative x). After x-flip it faces right toward the knight.
// Bounding box (local): left≈130px (club tip), right≈90px (back), top≈150px (head), foot≈136px

function drawIdle(g: Phaser.GameObjects.Graphics) {
  // Shadow
  g.fillStyle(0x000000, 0.15); g.fillEllipse(0, 126, 140, 16);

  // Legs
  g.fillStyle(0x2a6620, 1);
  g.fillRoundedRect(-28, 60, 26, 60, 6);
  g.fillRoundedRect(6, 60, 26, 60, 6);
  // Feet
  g.fillStyle(0x1a4414, 1);
  g.fillEllipse(-14, 118, 34, 18); g.fillEllipse(20, 118, 34, 18);

  // Body
  g.fillStyle(0x2a7020, 1);
  g.fillEllipse(0, 20, 130, 110);
  g.fillStyle(0x339924, 1);
  g.fillEllipse(-6, 14, 118, 96);

  // Belly
  g.fillStyle(0x5ab845, 0.5); g.fillEllipse(-4, 28, 72, 60);

  // Left arm (club arm, extends left) — width reaches body edge at x≈-65
  g.fillStyle(0x2a7020, 1);
  g.fillRoundedRect(-110, -20, 48, 68, 8);
  g.fillStyle(0x339924, 1);
  g.fillRoundedRect(-108, -18, 44, 62, 7);
  // Club
  g.fillStyle(0x4a2e10, 1);
  g.fillRoundedRect(-128, -52, 18, 90, 4); // handle
  g.fillStyle(0x5a3a14, 1);
  g.fillEllipse(-120, -58, 36, 30); // head
  // Spikes on club
  g.fillStyle(0x2a1808, 1);
  [[-128, -62], [-120, -66], [-112, -62]].forEach(([sx, sy]) => g.fillTriangle(sx - 3, sy + 4, sx + 3, sy + 4, sx, sy - 8));

  // Right arm (resting on hip)
  g.fillStyle(0x2a7020, 1);
  g.fillRoundedRect(52, -10, 28, 55, 8);
  g.fillStyle(0x339924, 1);
  g.fillRoundedRect(54, -8, 24, 50, 7);
  // Knuckles/fist
  g.fillStyle(0x2a7020, 1); g.fillEllipse(64, 46, 28, 22);

  // Neck
  g.fillStyle(0x2a7020, 1); g.fillRoundedRect(-14, -52, 28, 20, 6);

  // Head
  g.fillStyle(0x2a7020, 1); g.fillCircle(-20, -88, 54);
  g.fillStyle(0x339924, 1); g.fillCircle(-22, -90, 48);

  // Snout / low brow
  g.fillStyle(0x2a7020, 1); g.fillEllipse(-48, -80, 44, 28);
  g.fillStyle(0x339924, 1); g.fillEllipse(-50, -82, 38, 22);
  // Nostrils
  g.fillStyle(0x1a4414, 1); g.fillCircle(-56, -80, 4); g.fillCircle(-44, -80, 4);

  // Eyes (angry)
  g.fillStyle(0xffcc00, 1); g.fillCircle(-12, -104, 14); g.fillCircle(8, -102, 12);
  g.fillStyle(0x111100, 1); g.fillCircle(-12, -104, 8); g.fillCircle(8, -102, 7);
  // Glint
  g.fillStyle(0xffffff, 0.7); g.fillCircle(-16, -108, 4); g.fillCircle(4, -106, 3);

  // Unibrow (angry)
  g.fillStyle(0x1a4414, 1);
  g.fillRoundedRect(-28, -116, 46, 9, 3);

  // Tusks
  g.fillStyle(0xeeddcc, 1);
  g.fillTriangle(-58, -68, -48, -68, -55, -52);
  g.fillTriangle(-44, -68, -34, -68, -42, -54);

  // Ears
  g.fillStyle(0x2a7020, 1); g.fillCircle(28, -88, 18); g.fillCircle(-66, -88, 14);
  g.fillStyle(0x44aa30, 1); g.fillCircle(28, -88, 11); g.fillCircle(-66, -88, 8);
}

function drawReact(g: Phaser.GameObjects.Graphics) {
  // Same but club raised high
  g.fillStyle(0x000000, 0.15); g.fillEllipse(0, 126, 140, 16);

  g.fillStyle(0x2a6620, 1);
  g.fillRoundedRect(-28, 60, 26, 60, 6); g.fillRoundedRect(6, 60, 26, 60, 6);
  g.fillStyle(0x1a4414, 1);
  g.fillEllipse(-14, 118, 34, 18); g.fillEllipse(20, 118, 34, 18);

  g.fillStyle(0x2a7020, 1); g.fillEllipse(0, 20, 130, 110);
  g.fillStyle(0x339924, 1); g.fillEllipse(-6, 14, 118, 96);
  g.fillStyle(0x5ab845, 0.5); g.fillEllipse(-4, 28, 72, 60);

  // Raised club arm
  g.fillStyle(0x2a7020, 1);
  g.fillRoundedRect(-90, -80, 30, 68, 8);
  g.fillStyle(0x339924, 1);
  g.fillRoundedRect(-88, -78, 26, 62, 7);
  // Club raised high
  g.fillStyle(0x4a2e10, 1);
  g.fillRoundedRect(-106, -148, 18, 90, 4);
  g.fillStyle(0x5a3a14, 1); g.fillEllipse(-98, -154, 36, 30);
  g.fillStyle(0x2a1808, 1);
  [[-106, -158], [-98, -162], [-90, -158]].forEach(([sx, sy]) => g.fillTriangle(sx - 3, sy + 4, sx + 3, sy + 4, sx, sy - 8));

  g.fillStyle(0x2a7020, 1);
  g.fillRoundedRect(52, -10, 28, 55, 8);
  g.fillStyle(0x339924, 1); g.fillRoundedRect(54, -8, 24, 50, 7);
  g.fillStyle(0x2a7020, 1); g.fillEllipse(64, 46, 28, 22);

  g.fillStyle(0x2a7020, 1); g.fillRoundedRect(-14, -52, 28, 20, 6);
  g.fillStyle(0x2a7020, 1); g.fillCircle(-20, -88, 54);
  g.fillStyle(0x339924, 1); g.fillCircle(-22, -90, 48);
  g.fillStyle(0x2a7020, 1); g.fillEllipse(-48, -80, 44, 28);
  g.fillStyle(0x339924, 1); g.fillEllipse(-50, -82, 38, 22);
  g.fillStyle(0x1a4414, 1); g.fillCircle(-56, -80, 4); g.fillCircle(-44, -80, 4);

  // Wider eyes (angry)
  g.fillStyle(0xffcc00, 1); g.fillCircle(-12, -104, 16); g.fillCircle(8, -102, 14);
  g.fillStyle(0x111100, 1); g.fillCircle(-12, -104, 9); g.fillCircle(8, -102, 8);
  g.fillStyle(0xffffff, 0.7); g.fillCircle(-16, -108, 5); g.fillCircle(4, -106, 4);

  // Open mouth
  g.fillStyle(0x1a4414, 1); g.fillEllipse(-44, -70, 36, 20);
  g.fillStyle(0x330000, 1); g.fillEllipse(-44, -70, 28, 14);
  g.fillStyle(0xeeddcc, 1);
  g.fillTriangle(-58, -76, -48, -76, -55, -64);
  g.fillTriangle(-44, -76, -34, -76, -42, -66);

  g.fillStyle(0x1a4414, 1); g.fillRoundedRect(-28, -116, 46, 9, 3);
  g.fillStyle(0x2a7020, 1); g.fillCircle(28, -88, 18); g.fillCircle(-66, -88, 14);
  g.fillStyle(0x44aa30, 1); g.fillCircle(28, -88, 11); g.fillCircle(-66, -88, 8);
}
