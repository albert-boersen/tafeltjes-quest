import Phaser from 'phaser';

export interface DragonHandle {
  container: Phaser.GameObjects.Container;
  setRoaring(on: boolean): void;
  setReacting(on: boolean): void;
}

export function createDragon(scene: Phaser.Scene, x: number, y: number): DragonHandle {
  const container = scene.add.container(x, y);
  const idle = scene.add.graphics();
  const roar = scene.add.graphics();

  drawIdle(idle);
  drawRoar(roar);
  roar.setVisible(false);

  container.add([idle, roar]);
  return {
    container,
    setRoaring(on) { idle.setVisible(!on); roar.setVisible(on); },
    setReacting(on) { idle.setVisible(!on); roar.setVisible(on); },
  };
}

// (0,0) = center of body. Dragon faces LEFT (towards the knight).
// Total ~230px tall, ~280px wide
function drawIdle(g: Phaser.GameObjects.Graphics) {
  // Shadow
  g.fillStyle(0x000000, 0.15);
  g.fillEllipse(0, 126, 160, 18);

  // TAIL (sweeping right and down)
  g.fillStyle(0xaa1a1a, 1);
  g.fillEllipse(80, 60, 60, 28);
  g.fillEllipse(110, 80, 40, 22);
  g.fillEllipse(130, 100, 28, 16);
  g.fillEllipse(140, 116, 18, 12);
  // Tail tip
  g.fillStyle(0x881414, 1);
  g.fillTriangle(130, 110, 148, 118, 135, 130);

  // WINGS
  // Left wing (pointing up-left)
  g.fillStyle(0x7a0e0e, 1);
  g.fillTriangle(-30, -30, -140, -140, -10, 10);
  g.fillTriangle(-30, -30, -100, -120, 0, 0);
  g.fillStyle(0x8f1212, 1);
  // Wing membrane segments
  g.fillTriangle(-30, -20, -120, -120, -20, 20);
  // Wing ribs
  g.lineStyle(2, 0x5a0808, 0.7);
  g.lineBetween(-30, -20, -130, -130);
  g.lineBetween(-28, -18, -100, -110);
  g.lineBetween(-25, -15, -70, -90);

  // Right wing (pointing up-right, smaller since behind body)
  g.fillStyle(0x7a0e0e, 0.8);
  g.fillTriangle(20, -30, 130, -140, 10, 10);
  g.fillTriangle(20, -30, 100, -120, 10, 0);
  g.lineStyle(2, 0x5a0808, 0.6);
  g.lineBetween(20, -22, 120, -130);
  g.lineBetween(18, -18, 90, -108);

  // BODY (main ellipse)
  g.fillStyle(0xaa1a1a, 1);
  g.fillEllipse(0, 30, 140, 100);
  g.fillStyle(0xcc2222, 1);
  g.fillEllipse(0, 26, 130, 92);

  // BELLY (lighter)
  g.fillStyle(0xff8866, 1);
  g.fillEllipse(0, 35, 80, 62);
  g.fillStyle(0xffaa88, 0.5);
  g.fillEllipse(-8, 28, 50, 40);

  // Scale pattern on body
  g.fillStyle(0x991111, 0.4);
  for (let sx = -50; sx <= 50; sx += 22) {
    for (let sy = -10; sy <= 50; sy += 18) {
      g.fillEllipse(sx, sy + 20, 20, 12);
    }
  }

  // SPINE SPIKES — bases sit on body top surface, neck/head draw over the left ones
  // sy values chosen so (sy+8) ≈ body top at that x: body top = 26 - 50*sqrt(1-(x/70)²)
  g.fillStyle(0x881111, 1);
  const spinePoints = [[-30, -27], [-14, -31], [2, -32], [18, -30], [34, -26], [50, -17]];
  spinePoints.forEach(([sx, sy]) => {
    g.fillTriangle(sx - 6, sy + 8, sx + 6, sy + 8, sx, sy - 22);
    g.fillStyle(0xaa1414, 1);
    g.fillTriangle(sx - 4, sy + 6, sx + 4, sy + 6, sx, sy - 16);
    g.fillStyle(0x881111, 1);
  });

  // NECK
  g.fillStyle(0xcc2222, 1);
  g.fillEllipse(-40, -18, 50, 40);
  g.fillEllipse(-58, -40, 44, 36);
  g.fillStyle(0xdd2828, 1);
  g.fillEllipse(-50, -28, 42, 32);

  // HEAD
  g.fillStyle(0xcc2222, 1);
  g.fillCircle(-80, -62, 50);
  g.fillStyle(0xdd2828, 1);
  g.fillCircle(-78, -64, 45);

  // SNOUT (pointing left)
  g.fillStyle(0xcc2222, 1);
  g.fillEllipse(-118, -58, 56, 36);
  g.fillStyle(0xdd2828, 1);
  g.fillEllipse(-116, -60, 50, 30);
  // Nostril
  g.fillStyle(0x881111, 1);
  g.fillCircle(-124, -58, 5);
  g.fillCircle(-116, -55, 5);

  // Eye
  g.fillStyle(0xffcc00, 1);
  g.fillCircle(-68, -72, 16);
  g.fillStyle(0xffe566, 1);
  g.fillCircle(-68, -72, 12);
  // Slit pupil
  g.fillStyle(0x1a0800, 1);
  g.fillEllipse(-68, -72, 7, 18);
  // Eye shine
  g.fillStyle(0xffffff, 0.8);
  g.fillCircle(-73, -78, 5);
  g.fillCircle(-71, -76, 2);

  // Brow ridge
  g.lineStyle(4, 0xaa1010, 1);
  g.lineBetween(-82, -84, -58, -80);
  g.lineStyle(0, 0, 0);

  // Teeth / closed mouth line
  g.lineStyle(3, 0x881111, 1);
  g.lineBetween(-140, -52, -96, -48);
  g.lineStyle(0, 0, 0);
  // Teeth tips visible
  g.fillStyle(0xeeeedd, 1);
  g.fillTriangle(-138, -52, -132, -52, -135, -42);
  g.fillTriangle(-126, -51, -120, -51, -123, -41);
  g.fillTriangle(-114, -50, -108, -50, -111, -40);

  // HORNS
  g.fillStyle(0x5a0a0a, 1);
  g.fillTriangle(-74, -108, -64, -80, -54, -112);
  g.fillTriangle(-60, -104, -50, -78, -42, -108);
  g.fillStyle(0x7a1a1a, 1);
  g.fillTriangle(-73, -106, -65, -82, -55, -110);
  g.fillTriangle(-59, -102, -51, -80, -43, -106);

  // LEGS
  g.fillStyle(0xaa1a1a, 1);
  g.fillRoundedRect(-35, 72, 28, 48, 6);
  g.fillRoundedRect(12, 72, 28, 48, 6);
  g.fillStyle(0xcc2222, 1);
  g.fillRoundedRect(-33, 73, 24, 44, 5);
  g.fillRoundedRect(14, 73, 24, 44, 5);

  // Claws
  g.fillStyle(0x2a2a2a, 1);
  const clawsL = [-42, -34, -26, -18];
  const clawsR = [8, 16, 24, 32];
  clawsL.forEach(cx => g.fillTriangle(cx, 118, cx + 8, 118, cx + 4, 134));
  clawsR.forEach(cx => g.fillTriangle(cx, 118, cx + 8, 118, cx + 4, 134));
}

function drawRoar(g: Phaser.GameObjects.Graphics) {
  // Same as idle but with open mouth and fire breath

  g.fillStyle(0x000000, 0.15);
  g.fillEllipse(0, 126, 160, 18);

  g.fillStyle(0xaa1a1a, 1);
  g.fillEllipse(80, 60, 60, 28);
  g.fillEllipse(110, 80, 40, 22);
  g.fillEllipse(130, 100, 28, 16);
  g.fillEllipse(140, 116, 18, 12);
  g.fillStyle(0x881414, 1);
  g.fillTriangle(130, 110, 148, 118, 135, 130);

  // Wings spread wider
  g.fillStyle(0x7a0e0e, 1);
  g.fillTriangle(-30, -30, -160, -160, -10, 10);
  g.fillTriangle(-30, -30, -110, -130, 0, 0);
  g.fillStyle(0x8f1212, 1);
  g.fillTriangle(-30, -20, -140, -145, -20, 20);
  g.lineStyle(2, 0x5a0808, 0.7);
  g.lineBetween(-30, -20, -148, -148);
  g.lineBetween(-28, -18, -112, -126);
  g.lineBetween(-25, -15, -76, -96);

  g.fillStyle(0x7a0e0e, 0.8);
  g.fillTriangle(20, -30, 150, -155, 10, 10);
  g.fillTriangle(20, -30, 112, -130, 10, 0);
  g.lineStyle(2, 0x5a0808, 0.6);
  g.lineBetween(20, -22, 138, -142);
  g.lineBetween(18, -18, 100, -118);

  g.fillStyle(0xaa1a1a, 1);
  g.fillEllipse(0, 30, 140, 100);
  g.fillStyle(0xcc2222, 1);
  g.fillEllipse(0, 26, 130, 92);
  g.fillStyle(0xff8866, 1);
  g.fillEllipse(0, 35, 80, 62);
  g.fillStyle(0xffaa88, 0.5);
  g.fillEllipse(-8, 28, 50, 40);
  g.fillStyle(0x991111, 0.4);
  for (let sx = -50; sx <= 50; sx += 22) {
    for (let sy = -10; sy <= 50; sy += 18) g.fillEllipse(sx, sy + 20, 20, 12);
  }

  // SPINE SPIKES — bases sit on body top surface, neck/head draw over the left ones
  g.fillStyle(0x881111, 1);
  const spinePoints = [[-30, -27], [-14, -31], [2, -32], [18, -30], [34, -26], [50, -17]];
  spinePoints.forEach(([sx, sy]) => {
    g.fillTriangle(sx - 6, sy + 8, sx + 6, sy + 8, sx, sy - 22);
    g.fillStyle(0xaa1414, 1);
    g.fillTriangle(sx - 4, sy + 6, sx + 4, sy + 6, sx, sy - 16);
    g.fillStyle(0x881111, 1);
  });

  g.fillStyle(0xcc2222, 1);
  g.fillEllipse(-40, -18, 50, 40);
  g.fillEllipse(-58, -40, 44, 36);
  g.fillStyle(0xdd2828, 1);
  g.fillEllipse(-50, -28, 42, 32);

  g.fillStyle(0xcc2222, 1);
  g.fillCircle(-80, -62, 50);
  g.fillStyle(0xdd2828, 1);
  g.fillCircle(-78, -64, 45);

  // OPEN MOUTH
  g.fillStyle(0xcc2222, 1);
  g.fillEllipse(-118, -62, 56, 40);
  g.fillStyle(0xdd2828, 1);
  g.fillEllipse(-116, -63, 50, 34);
  // Upper jaw
  g.fillStyle(0xcc2222, 1);
  g.fillEllipse(-116, -74, 52, 22);
  // Lower jaw (dropped open)
  g.fillStyle(0xbb1a1a, 1);
  g.fillEllipse(-116, -48, 52, 22);
  // Inside mouth (dark)
  g.fillStyle(0x400000, 1);
  g.fillEllipse(-116, -62, 44, 22);
  // Upper teeth
  g.fillStyle(0xeeeedd, 1);
  [-132, -122, -112, -102].forEach(tx => g.fillTriangle(tx, -68, tx + 8, -68, tx + 4, -56));
  // Lower teeth
  [-130, -120, -110, -100].forEach(tx => g.fillTriangle(tx, -56, tx + 8, -56, tx + 4, -44));
  // Tongue
  g.fillStyle(0xdd4444, 1);
  g.fillEllipse(-118, -52, 28, 12);

  // FIRE BREATH
  g.fillStyle(0xff6600, 0.9);
  g.fillTriangle(-152, -72, -152, -44, -240, -58);
  g.fillStyle(0xffaa00, 0.85);
  g.fillTriangle(-148, -68, -148, -50, -220, -60);
  g.fillStyle(0xffcc00, 0.8);
  g.fillTriangle(-144, -65, -144, -54, -200, -60);
  g.fillStyle(0xffffa0, 0.7);
  g.fillTriangle(-142, -63, -142, -56, -180, -60);
  g.fillStyle(0xffffff, 0.5);
  g.fillTriangle(-140, -62, -140, -58, -165, -60);

  // Nostril steam
  g.fillStyle(0xff8800, 0.5);
  g.fillCircle(-126, -50, 4);
  g.fillCircle(-118, -47, 3);

  // Eye (wider/alarmed)
  g.fillStyle(0xffcc00, 1);
  g.fillCircle(-68, -72, 18);
  g.fillStyle(0xffe566, 1);
  g.fillCircle(-68, -72, 14);
  g.fillStyle(0x1a0800, 1);
  g.fillEllipse(-68, -72, 6, 20);
  g.fillStyle(0xffffff, 0.8);
  g.fillCircle(-73, -78, 5);

  g.lineStyle(4, 0xaa1010, 1);
  g.lineBetween(-84, -86, -60, -82);
  g.lineStyle(0, 0, 0);

  g.fillStyle(0x5a0a0a, 1);
  g.fillTriangle(-74, -108, -64, -80, -54, -112);
  g.fillTriangle(-60, -104, -50, -78, -42, -108);
  g.fillStyle(0x7a1a1a, 1);
  g.fillTriangle(-73, -106, -65, -82, -55, -110);

  g.fillStyle(0xaa1a1a, 1);
  g.fillRoundedRect(-35, 72, 28, 48, 6);
  g.fillRoundedRect(12, 72, 28, 48, 6);
  g.fillStyle(0xcc2222, 1);
  g.fillRoundedRect(-33, 73, 24, 44, 5);
  g.fillRoundedRect(14, 73, 24, 44, 5);
  g.fillStyle(0x2a2a2a, 1);
  const clawsL = [-42, -34, -26, -18];
  const clawsR = [8, 16, 24, 32];
  clawsL.forEach(cx => g.fillTriangle(cx, 118, cx + 8, 118, cx + 4, 134));
  clawsR.forEach(cx => g.fillTriangle(cx, 118, cx + 8, 118, cx + 4, 134));
}
