import Phaser from 'phaser';

export interface KnightHandle {
  container: Phaser.GameObjects.Container;
  setAttacking(on: boolean): void;
  /** Flash the sword with a brief golden glow (added to container, removed automatically) */
  flashSword(scene: Phaser.Scene): void;
}

export function createKnight(scene: Phaser.Scene, x: number, y: number): KnightHandle {
  const container = scene.add.container(x, y);
  const idle = scene.add.graphics();
  const atk = scene.add.graphics();

  drawIdle(idle);
  drawAttack(atk);
  atk.setVisible(false);

  container.add([idle, atk]);
  return {
    container,
    setAttacking(on) {
      idle.setVisible(!on);
      atk.setVisible(on);
    },
    flashSword(scene: Phaser.Scene) {
      // Bright golden glow over the sword area in container-local space
      const glow = scene.add.graphics();
      glow.fillStyle(0xf5c842, 0.55);
      glow.fillRect(36, -120, 22, 130);
      glow.fillStyle(0xffffff, 0.35);
      glow.fillRect(38, -118, 8, 120);
      container.add(glow);
      scene.tweens.add({
        targets: glow, alpha: 0, scaleX: 2.2, scaleY: 1.1, duration: 340,
        ease: 'Power2.out',
        onComplete: () => { container.remove(glow, true); },
      });
    },
  };
}

// (0,0) = center of torso. Total ~220px tall including plume and boots.
function drawIdle(g: Phaser.GameObjects.Graphics) {
  // Shadow
  g.fillStyle(0x000000, 0.15);
  g.fillEllipse(2, 98, 95, 14);

  // Boots
  g.fillStyle(0x1e1e2e, 1);
  g.fillRoundedRect(-25, 68, 24, 22, { tl: 3, tr: 3, bl: 10, br: 3 });
  g.fillRoundedRect(3, 68, 24, 22, { tl: 3, tr: 3, bl: 3, br: 10 });
  g.fillStyle(0x2e2e3e, 1);
  g.fillRect(-23, 69, 10, 4);
  g.fillRect(5, 69, 10, 4);

  // Legs
  g.fillStyle(0x7788cc, 1);
  g.fillRoundedRect(-23, 10, 20, 62, 5);
  g.fillRoundedRect(3, 10, 20, 62, 5);
  g.fillStyle(0x99aadd, 0.5);
  g.fillRect(-20, 14, 5, 22);
  g.fillRect(6, 14, 5, 22);
  // Knee plates
  g.fillStyle(0x5566aa, 1);
  g.fillRoundedRect(-25, 42, 24, 16, 5);
  g.fillRoundedRect(1, 42, 24, 16, 5);
  g.fillStyle(0x6677bb, 1);
  g.fillRoundedRect(-24, 43, 22, 13, 4);
  g.fillRoundedRect(2, 43, 22, 13, 4);

  // Belt
  g.fillStyle(0x5a3a00, 1);
  g.fillRect(-27, 8, 54, 8);
  g.fillStyle(0xf5c842, 1);
  g.fillRect(-8, 9, 16, 6);
  g.lineStyle(1, 0xbb9900, 1);
  g.strokeRect(-8, 9, 16, 6);

  // Torso
  g.fillStyle(0x6677bb, 1);
  g.fillRoundedRect(-27, -56, 54, 68, 7);
  g.fillStyle(0x8899dd, 1);
  g.fillRoundedRect(-21, -50, 42, 56, 5);
  // Chest center line & horizontal bands
  g.lineStyle(1, 0x6677bb, 0.7);
  g.lineBetween(0, -50, 0, 8);
  g.lineBetween(-21, -22, 21, -22);
  g.lineBetween(-21, 4, 21, 4);
  // Armor shine strip
  g.fillStyle(0xccddff, 0.28);
  g.fillRect(-25, -54, 5, 62);

  // Shoulder pauldrons
  g.fillStyle(0x5566aa, 1);
  g.fillEllipse(-36, -48, 30, 24);
  g.fillEllipse(36, -48, 30, 24);
  g.fillStyle(0x7788cc, 1);
  g.fillEllipse(-36, -52, 26, 18);
  g.fillEllipse(36, -52, 26, 18);
  g.fillStyle(0x99aadd, 0.4);
  g.fillEllipse(-38, -56, 14, 8);
  g.fillEllipse(38, -56, 14, 8);

  // Left arm
  g.fillStyle(0x7788cc, 1);
  g.fillRoundedRect(-40, -46, 15, 62, 5);
  g.fillStyle(0x5566aa, 1);
  g.fillEllipse(-32, -8, 18, 14);
  g.fillStyle(0x5566aa, 1);
  g.fillRoundedRect(-41, 12, 17, 20, 5);
  g.fillStyle(0x7788cc, 1);
  g.fillRoundedRect(-40, 13, 15, 18, 4);

  // Right arm
  g.fillStyle(0x7788cc, 1);
  g.fillRoundedRect(25, -46, 15, 62, 5);
  g.fillStyle(0x5566aa, 1);
  g.fillEllipse(32, -8, 18, 14);
  g.fillStyle(0x5566aa, 1);
  g.fillRoundedRect(24, 12, 17, 20, 5);
  g.fillStyle(0x7788cc, 1);
  g.fillRoundedRect(25, 13, 15, 18, 4);

  // Shield (left)
  g.fillStyle(0xaa2222, 1);
  g.fillRoundedRect(-72, -54, 34, 56, { tl: 10, tr: 10, bl: 17, br: 17 });
  g.fillStyle(0xc0392b, 1);
  g.fillRoundedRect(-70, -52, 30, 52, { tl: 8, tr: 8, bl: 14, br: 14 });
  g.lineStyle(2, 0x7a0000, 0.8);
  g.strokeRoundedRect(-70, -52, 30, 52, { tl: 8, tr: 8, bl: 14, br: 14 });
  // Cross
  g.fillStyle(0xf5c842, 1);
  g.fillRect(-57, -50, 5, 48);
  g.fillRect(-70, -31, 30, 5);
  // Center gem
  g.fillStyle(0xfff0aa, 1);
  g.fillCircle(-54, -29, 5);
  g.fillStyle(0xf5c842, 1);
  g.fillCircle(-54, -29, 3);

  // Sword blade (right side, pointing up)
  g.fillStyle(0xccd0e0, 1);
  g.fillRect(42, -96, 9, 116);
  g.fillTriangle(42, -96, 51, -96, 46, -116);
  // Blade edge shine
  g.fillStyle(0xffffff, 0.45);
  g.fillRect(42, -94, 3, 108);
  // Blade fuller
  g.fillStyle(0xaab0c0, 0.5);
  g.fillRect(46, -92, 2, 106);
  // Crossguard
  g.fillStyle(0xf5c842, 1);
  g.fillRoundedRect(33, 16, 26, 8, 4);
  g.lineStyle(1, 0xbb9900, 1);
  g.strokeRoundedRect(33, 16, 26, 8, 4);
  // Handle
  g.fillStyle(0x8b5e14, 1);
  g.fillRoundedRect(40, 24, 12, 26, 4);
  g.lineStyle(2, 0x5a3a00, 0.6);
  for (let hy = 28; hy < 48; hy += 7) g.lineBetween(40, hy, 52, hy);
  // Pommel
  g.fillStyle(0xf5c842, 1);
  g.fillCircle(46, 50, 8);
  g.lineStyle(1, 0xbb9900, 1);
  g.strokeCircle(46, 50, 8);
  g.fillStyle(0xfff0aa, 1);
  g.fillCircle(46, 50, 4);

  // Neck
  g.fillStyle(0xffd0a0, 1);
  g.fillRoundedRect(-10, -62, 20, 12, 4);

  // Helmet
  g.fillStyle(0x5566aa, 1);
  g.fillRoundedRect(-30, -108, 60, 50, { tl: 30, tr: 30, bl: 4, br: 4 });
  g.fillStyle(0x6677bb, 1);
  g.fillRoundedRect(-27, -106, 54, 46, { tl: 28, tr: 28, bl: 4, br: 4 });
  // Helmet shine
  g.fillStyle(0xaabbdd, 0.4);
  g.fillRoundedRect(-22, -102, 22, 28, { tl: 18, tr: 4, bl: 4, br: 4 });
  // Cheek guards
  g.fillStyle(0x4455999, 1);
  g.fillStyle(0x445599, 1);
  g.fillRoundedRect(-34, -76, 9, 28, { tl: 3, tr: 0, bl: 8, br: 0 });
  g.fillRoundedRect(25, -76, 9, 28, { tl: 0, tr: 3, bl: 0, br: 8 });
  // Visor
  g.fillStyle(0x14141e, 1);
  g.fillRoundedRect(-24, -76, 48, 18, 4);
  // Visor slits
  g.fillStyle(0x0a0a14, 1);
  for (let vx = -20; vx < 20; vx += 10) g.fillRoundedRect(vx, -76, 6, 18, 2);
  // Eye glow
  g.fillStyle(0x4488ff, 0.55);
  g.fillRect(-22, -75, 12, 7);

  // Plume (5 feathers)
  const featherX = [-18, -9, 0, 9, 18];
  const featherY = [-130, -136, -138, -136, -130];
  featherX.forEach((fx, i) => {
    g.fillStyle(0xaa1122, 0.9);
    g.fillEllipse(fx, featherY[i], 14, 34);
    g.fillStyle(0xdd2233, 0.9);
    g.fillEllipse(fx, featherY[i] + 4, 10, 24);
  });
  g.fillStyle(0x881122, 1);
  g.fillRect(-22, -108, 44, 8);
}

function drawAttack(g: Phaser.GameObjects.Graphics) {
  // Same character but leaning forward, sword raised diagonally
  const lean = -12; // shift body left (forward)

  g.fillStyle(0x000000, 0.15);
  g.fillEllipse(lean + 10, 98, 95, 14);

  g.fillStyle(0x1e1e2e, 1);
  g.fillRoundedRect(lean - 20, 68, 24, 22, { tl: 3, tr: 3, bl: 10, br: 3 });
  g.fillRoundedRect(lean + 8, 68, 24, 22, { tl: 3, tr: 3, bl: 3, br: 10 });

  g.fillStyle(0x7788cc, 1);
  g.fillRoundedRect(lean - 20, 10, 20, 62, 5);
  g.fillRoundedRect(lean + 8, 10, 20, 62, 5);
  g.fillStyle(0x5566aa, 1);
  g.fillRoundedRect(lean - 22, 42, 24, 16, 5);
  g.fillRoundedRect(lean + 6, 42, 24, 16, 5);

  g.fillStyle(0x5a3a00, 1);
  g.fillRect(lean - 24, 8, 54, 8);
  g.fillStyle(0xf5c842, 1);
  g.fillRect(lean - 5, 9, 16, 6);

  g.fillStyle(0x6677bb, 1);
  g.fillRoundedRect(lean - 24, -56, 54, 68, 7);
  g.fillStyle(0x8899dd, 1);
  g.fillRoundedRect(lean - 18, -50, 42, 56, 5);
  g.fillStyle(0xccddff, 0.28);
  g.fillRect(lean - 22, -54, 5, 62);
  g.lineStyle(1, 0x6677bb, 0.7);
  g.lineBetween(lean, -50, lean, 8);

  g.fillStyle(0x5566aa, 1);
  g.fillEllipse(lean - 34, -48, 30, 24);
  g.fillEllipse(lean + 38, -48, 30, 24);
  g.fillStyle(0x7788cc, 1);
  g.fillEllipse(lean - 34, -52, 26, 18);
  g.fillEllipse(lean + 38, -52, 26, 18);

  // Left arm (shield thrust forward)
  g.fillStyle(0x7788cc, 1);
  g.fillRoundedRect(lean - 38, -46, 15, 62, 5);
  g.fillStyle(0x5566aa, 1);
  g.fillRoundedRect(lean - 39, 12, 17, 20, 5);

  // Shield forward (shifted more to the left)
  g.fillStyle(0xaa2222, 1);
  g.fillRoundedRect(lean - 78, -54, 34, 56, { tl: 10, tr: 10, bl: 17, br: 17 });
  g.fillStyle(0xc0392b, 1);
  g.fillRoundedRect(lean - 76, -52, 30, 52, { tl: 8, tr: 8, bl: 14, br: 14 });
  g.fillStyle(0xf5c842, 1);
  g.fillRect(lean - 63, -50, 5, 48);
  g.fillRect(lean - 76, -31, 30, 5);
  g.fillStyle(0xfff0aa, 1);
  g.fillCircle(lean - 60, -29, 5);

  // Right arm RAISED (sword arm up)
  g.fillStyle(0x7788cc, 1);
  g.fillRoundedRect(lean + 28, -72, 15, 45, 5);
  g.fillStyle(0x5566aa, 1);
  g.fillEllipse(lean + 36, -48, 18, 14);

  // Sword raised diagonally (pointing up-right)
  // Rotate: blade goes from lower-right to upper-left
  const sx = lean + 52, sy = -20;
  g.fillStyle(0xccd0e0, 1);
  // Draw sword at a diagonal
  for (let t = 0; t < 120; t++) {
    const bx = sx - t * 0.7;
    const by = sy - t * 0.8;
    g.fillRect(bx, by, 9, 3);
  }
  g.fillStyle(0xffffff, 0.45);
  for (let t = 0; t < 115; t++) {
    g.fillRect(sx - t * 0.7, sy - t * 0.8, 3, 2);
  }
  // Crossguard
  g.fillStyle(0xf5c842, 1);
  g.fillRoundedRect(lean + 35, -26, 26, 8, 4);
  g.fillStyle(0x8b5e14, 1);
  g.fillRoundedRect(lean + 42, -20, 12, 26, 4);
  g.fillStyle(0xf5c842, 1);
  g.fillCircle(lean + 48, 6, 8);

  // Neck & helmet (same position, slightly forward)
  g.fillStyle(0xffd0a0, 1);
  g.fillRoundedRect(lean - 8, -62, 20, 12, 4);

  g.fillStyle(0x5566aa, 1);
  g.fillRoundedRect(lean - 28, -108, 60, 50, { tl: 30, tr: 30, bl: 4, br: 4 });
  g.fillStyle(0x6677bb, 1);
  g.fillRoundedRect(lean - 25, -106, 54, 46, { tl: 28, tr: 28, bl: 4, br: 4 });
  g.fillStyle(0xaabbdd, 0.4);
  g.fillRoundedRect(lean - 20, -102, 22, 28, { tl: 18, tr: 4, bl: 4, br: 4 });
  g.fillStyle(0x445599, 1);
  g.fillRoundedRect(lean - 32, -76, 9, 28, { tl: 3, tr: 0, bl: 8, br: 0 });
  g.fillRoundedRect(lean + 27, -76, 9, 28, { tl: 0, tr: 3, bl: 0, br: 8 });
  g.fillStyle(0x14141e, 1);
  g.fillRoundedRect(lean - 22, -76, 48, 18, 4);
  for (let vx = lean - 18; vx < lean + 22; vx += 10) g.fillRoundedRect(vx, -76, 6, 18, 2);
  g.fillStyle(0x4488ff, 0.55);
  g.fillRect(lean - 20, -75, 12, 7);

  // Plume
  const featherX = [-18, -9, 0, 9, 18];
  const featherY = [-130, -136, -138, -136, -130];
  featherX.forEach((fx, i) => {
    g.fillStyle(0xaa1122, 0.9);
    g.fillEllipse(lean + fx, featherY[i], 14, 34);
    g.fillStyle(0xdd2233, 0.9);
    g.fillEllipse(lean + fx, featherY[i] + 4, 10, 24);
  });
  g.fillStyle(0x881122, 1);
  g.fillRect(lean - 20, -108, 44, 8);
}
