import Phaser from 'phaser';
import { drawCastleBackground } from '../gfx/castle';

interface ResultData {
  won: boolean;
  table: number;
  difficulty: string;
  totalCorrect: number;
  totalWrong: number;
  knightHp: number;
  dragonHp: number;
}

export class ResultScene extends Phaser.Scene {
  constructor() { super('ResultScene'); }

  init() {}

  create(data: ResultData) {
    const W = this.scale.width;
    const H = this.scale.height;

    drawCastleBackground(this, W, H);

    this.cameras.main.fadeIn(500);

    if (data.won) {
      this.showVictory(data, W, H);
    } else {
      this.showDefeat(data, W, H);
    }

    this.showStats(data, W, H);
    this.showButtons(W, H, data);
  }

  private showVictory(data: ResultData, W: number, H: number) {
    // Victory fireworks
    for (let i = 0; i < 8; i++) {
      this.time.delayedCall(i * 200, () => {
        this.spawnFirework(
          Phaser.Math.Between(100, W - 100),
          Phaser.Math.Between(60, H * 0.4)
        );
      });
    }

    // Repeating fireworks
    this.time.addEvent({
      delay: 1800,
      loop: true,
      callback: () => {
        this.spawnFirework(
          Phaser.Math.Between(80, W - 80),
          Phaser.Math.Between(40, H * 0.45)
        );
      },
    });

    // Title
    const shadowTitle = this.add.text(W / 2 + 4, H * 0.18 + 4, 'GEWONNEN!', {
      fontFamily: 'Georgia, serif', fontSize: '72px', color: '#7a4400', fontStyle: 'bold',
    }).setOrigin(0.5).setAlpha(0);

    const title = this.add.text(W / 2, H * 0.18, 'GEWONNEN!', {
      fontFamily: 'Georgia, serif', fontSize: '72px', color: '#f5c842', fontStyle: 'bold',
      stroke: '#8b5a00', strokeThickness: 8,
    }).setOrigin(0.5).setAlpha(0).setScale(0.5);

    this.tweens.add({ targets: [title, shadowTitle], alpha: 1, scaleX: 1, scaleY: 1, duration: 600, ease: 'Back.out' });
    this.tweens.add({ targets: title, scaleX: 1.04, scaleY: 1.04, duration: 1500, yoyo: true, repeat: -1, ease: 'Sine.inOut', delay: 700 });

    this.add.text(W / 2, H * 0.18 + 62, '⚔ De draak is verslagen! ⚔', {
      fontFamily: 'Georgia, serif', fontSize: '22px', color: '#d4b8ff',
    }).setOrigin(0.5).setAlpha(0);

    const medals: Record<string, string> = {
      leerling: '🥉 Leerling Ridder',
      ridder: '🥈 Ridder van het Koninkrijk',
      meester: '🥇 Meester Tovenaar',
    };
    const rank = this.add.text(W / 2, H * 0.18 + 95, medals[data.difficulty] || '⭐ Ridder', {
      fontFamily: 'Georgia, serif', fontSize: '20px', color: '#f5c842',
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({ targets: rank, alpha: 1, duration: 500, delay: 800 });
  }

  private showDefeat(data: ResultData, W: number, H: number) {
    // Dark overlay
    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0.35);
    overlay.fillRect(0, 0, W, H);

    // Falling embers
    this.add.particles(0, 0, '__DEFAULT', {
      x: { min: 0, max: W },
      y: -10,
      speedY: { min: 60, max: 120 },
      speedX: { min: -20, max: 20 },
      scale: { start: 0.5, end: 0 },
      alpha: { start: 0.8, end: 0 },
      tint: [0xff4400, 0xff8800, 0xffcc00],
      lifespan: 3000,
      frequency: 100,
      quantity: 2,
    });

    const title = this.add.text(W / 2, H * 0.18, 'VERLOREN...', {
      fontFamily: 'Georgia, serif', fontSize: '68px', color: '#cc3333', fontStyle: 'bold',
      stroke: '#5a0000', strokeThickness: 8,
    }).setOrigin(0.5).setAlpha(0).setScale(1.3);

    this.tweens.add({ targets: title, alpha: 1, scaleX: 1, scaleY: 1, duration: 600, ease: 'Power2.out' });

    this.add.text(W / 2, H * 0.18 + 60, 'De draak heeft het kasteel veroverd...', {
      fontFamily: 'Georgia, serif', fontSize: '20px', color: '#ff9988',
    }).setOrigin(0.5);

    this.add.text(W / 2, H * 0.18 + 90, 'Maar ridders geven nooit op! Probeer opnieuw.', {
      fontFamily: 'Georgia, serif', fontSize: '17px', color: '#ffccaa',
    }).setOrigin(0.5);
  }

  private showStats(data: ResultData, W: number, H: number) {
    const panelX = W / 2 - 200;
    const panelY = H * 0.46;
    const panelW = 400;
    const panelH = 140;

    const panel = this.add.graphics();
    panel.fillStyle(0x0d0530, 0.88);
    panel.fillRoundedRect(panelX, panelY, panelW, panelH, 14);
    panel.lineStyle(2, 0x4a2890, 1);
    panel.strokeRoundedRect(panelX, panelY, panelW, panelH, 14);

    const total = data.totalCorrect + data.totalWrong;
    const pct = total > 0 ? Math.round((data.totalCorrect / total) * 100) : 0;
    const accuracy = pct >= 90 ? '⭐⭐⭐' : pct >= 70 ? '⭐⭐' : pct >= 50 ? '⭐' : '';

    const stats = [
      [`Tafel van ${data.table}`, `Moeilijkheid: ${data.difficulty}`],
      [`✓ Goed: ${data.totalCorrect}`, `✗ Fout: ${data.totalWrong}`],
      [`Nauwkeurigheid: ${pct}%  ${accuracy}`, ''],
    ];

    stats.forEach(([left, right], i) => {
      this.add.text(panelX + 20, panelY + 16 + i * 36, left, {
        fontFamily: 'Georgia, serif', fontSize: '18px', color: '#e0d0ff',
      });
      if (right) {
        this.add.text(panelX + panelW - 20, panelY + 16 + i * 36, right, {
          fontFamily: 'Georgia, serif', fontSize: '18px', color: '#e0d0ff',
        }).setOrigin(1, 0);
      }
    });

    // Accuracy bar
    const barY = panelY + panelH - 22;
    panel.fillStyle(0x2c1b50, 1);
    panel.fillRoundedRect(panelX + 20, barY, panelW - 40, 12, 6);
    if (pct > 0) {
      panel.fillStyle(pct >= 70 ? 0x27ae60 : 0xf39c12, 1);
      panel.fillRoundedRect(panelX + 20, barY, (panelW - 40) * pct / 100, 12, 6);
    }
  }

  private showButtons(W: number, H: number, data: ResultData) {
    const btnY = H * 0.78;

    // Retry same table
    this.makeButton(W / 2 - 120, btnY, 210, 52, 'Opnieuw proberen', 0x2d6a4f, 0x27ae60, () => {
      this.cameras.main.fade(400, 0, 0, 0);
      this.time.delayedCall(400, () => this.scene.start('BattleScene', {
        table: data.table, difficulty: data.difficulty,
        timeLimit: { leerling: 30, ridder: 15, meester: 8 }[data.difficulty] ?? 15,
      }));
    });

    // Back to menu
    this.makeButton(W / 2 + 120, btnY, 210, 52, 'Terug naar menu', 0x4a2890, 0x6b3fc0, () => {
      this.cameras.main.fade(400, 0, 0, 0);
      this.time.delayedCall(400, () => this.scene.start('MenuScene'));
    });
  }

  private makeButton(x: number, y: number, w: number, h: number, label: string, colorBase: number, colorHover: number, cb: () => void) {
    const container = this.add.container(x, y);
    const bg = this.add.graphics();
    const drawBg = (c: number) => {
      bg.clear();
      bg.fillStyle(c, 1);
      bg.fillRoundedRect(-w / 2, -h / 2, w, h, 12);
      bg.lineStyle(2, 0xf5c842, 1);
      bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 12);
    };
    drawBg(colorBase);
    const text = this.add.text(0, 0, label, {
      fontFamily: 'Georgia, serif', fontSize: '17px', color: '#ffffff', fontStyle: 'bold',
    }).setOrigin(0.5);
    container.add([bg, text]);
    container.setSize(w, h).setInteractive({ cursor: 'pointer' });
    container.on('pointerover', () => drawBg(colorHover));
    container.on('pointerout', () => drawBg(colorBase));
    container.on('pointerdown', cb);
  }

  private spawnFirework(x: number, y: number) {
    const colors = [0xf5c842, 0xff6688, 0x66ddff, 0xaaffaa, 0xff88ff, 0xffffff];
    const count = Phaser.Math.Between(12, 20);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const speed = Phaser.Math.Between(50, 160);
      const color = Phaser.Utils.Array.GetRandom(colors) as number;
      const r = Phaser.Math.Between(3, 7);
      const circle = this.add.circle(x, y, r, color);
      this.tweens.add({
        targets: circle,
        x: x + Math.cos(angle) * speed,
        y: y + Math.sin(angle) * speed,
        alpha: 0, scaleX: 0.2, scaleY: 0.2,
        duration: Phaser.Math.Between(500, 900),
        ease: 'Power2.out',
        onComplete: () => circle.destroy(),
      });
    }

    const flash = this.add.circle(x, y, 18, 0xffffff, 0.7);
    this.tweens.add({ targets: flash, alpha: 0, scaleX: 3, scaleY: 3, duration: 200, onComplete: () => flash.destroy() });
  }
}
