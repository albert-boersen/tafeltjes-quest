import Phaser from 'phaser';
import { drawCastleBackground } from '../gfx/castle';
import { createKnight } from '../gfx/knight';
import { createDragon } from '../gfx/dragon';

export class MenuScene extends Phaser.Scene {
  private stars: Phaser.GameObjects.Arc[] = [];
  private selectedTable = 5;
  private selectedDifficulty: 'leerling' | 'ridder' | 'meester' = 'ridder';
  private tableButtons: Phaser.GameObjects.Container[] = [];
  private diffBtns: Record<string, Phaser.GameObjects.Container> = {};

  constructor() {
    super('MenuScene');
  }

  create() {
    const W = this.scale.width;
    const H = this.scale.height;

    // Draw castle background
    drawCastleBackground(this, W, H);

    // Starfield
    for (let i = 0; i < 80; i++) {
      const s = this.add.circle(
        Phaser.Math.Between(0, W),
        Phaser.Math.Between(0, H * 0.55),
        Phaser.Math.Between(1, 2),
        0xffffff,
        Phaser.Math.FloatBetween(0.3, 1)
      );
      this.stars.push(s);
    }

    // Menu characters are decorative — cap smaller so they don't crowd the UI
    const charScale = Math.max(0.38, Math.min(0.85, H / 576 * 0.75));

    // Knight: left bounding edge 78px → keep shield inside left margin
    const knightX = Math.round(78 * charScale) + 26;
    const knightY = H * 0.50;
    const { container: knightC } = createKnight(this, knightX, knightY);
    knightC.setScale(charScale);
    this.tweens.add({ targets: knightC, y: knightY - 10, duration: 1200, yoyo: true, repeat: -1, ease: 'Sine.inOut' });

    // Dragon: after x-flip right bounding edge 162px → keep wing inside right margin
    const dragonX = W - Math.round(162 * charScale) - 26;
    const dragonY = H * 0.48;
    const { container: dragonC } = createDragon(this, dragonX, dragonY);
    dragonC.setScale(-charScale, charScale);
    this.tweens.add({ targets: dragonC, y: dragonY + 10, duration: 1500, yoyo: true, repeat: -1, ease: 'Sine.inOut' });

    // --- Responsive Y layout (all relative to H) ---
    const titleY      = Math.round(H * 0.10);
    const subtitleY   = Math.round(H * 0.20);
    const tableLabelY = Math.round(H * 0.30);
    const tableBtnY   = Math.round(H * 0.39);
    const diffLabelY  = Math.round(H * 0.51);
    const diffBtnY    = Math.round(H * 0.60);
    const startBtnY   = Math.round(H * 0.76);

    // Responsive font sizes
    const titleSize   = `${Math.round(Math.max(32, Math.min(60, H * 0.09)))}px`;
    const sectionSize = `${Math.round(Math.max(14, Math.min(22, H * 0.037)))}px`;
    const subSize     = `${Math.round(Math.max(13, Math.min(20, H * 0.033)))}px`;

    // Title
    const titleShadow = this.add.text(W / 2 + 3, titleY + 3, 'TAFELTJES QUEST', {
      fontFamily: 'Georgia, serif', fontSize: titleSize, color: '#6b3a00', fontStyle: 'bold',
    }).setOrigin(0.5);
    const title = this.add.text(W / 2, titleY, 'TAFELTJES QUEST', {
      fontFamily: 'Georgia, serif', fontSize: titleSize, color: '#f5c842', fontStyle: 'bold',
      stroke: '#7a4500', strokeThickness: 6,
    }).setOrigin(0.5);

    this.tweens.add({ targets: [title, titleShadow], scaleX: 1.03, scaleY: 1.03, duration: 2000, yoyo: true, repeat: -1, ease: 'Sine.inOut' });

    // Subtitle
    this.add.text(W / 2, subtitleY, 'Versla de draak met je rekenkracht!', {
      fontFamily: 'Georgia, serif', fontSize: subSize, color: '#d4b8ff',
    }).setOrigin(0.5);

    // Table selector label
    this.add.text(W / 2, tableLabelY, '— Kies je tafel —', {
      fontFamily: 'Georgia, serif', fontSize: sectionSize, color: '#f5c842', fontStyle: 'bold',
    }).setOrigin(0.5);

    // Table buttons 1–10: fit within center area between characters
    const tables = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const gap = 8;
    const maxTableAreaW = Math.min(720, W - 160); // leave room for edge characters
    const btnW = Math.max(40, Math.floor((maxTableAreaW - 9 * gap) / 10));
    const btnH = Math.round(btnW * 0.68);
    const tableFontPx = Math.round(Math.max(14, btnW * 0.32));
    const totalW = tables.length * btnW + (tables.length - 1) * gap;
    const startX = (W - totalW) / 2;

    tables.forEach((t, i) => {
      const x = startX + i * (btnW + gap) + btnW / 2;
      const btn = this.makeTableButton(x, tableBtnY, btnW, btnH, t, tableFontPx);
      this.tableButtons.push(btn);
    });

    this.refreshTableButtons();

    // Difficulty label
    this.add.text(W / 2, diffLabelY, '— Moeilijkheidsgraad —', {
      fontFamily: 'Georgia, serif', fontSize: sectionSize, color: '#f5c842', fontStyle: 'bold',
    }).setOrigin(0.5);

    // Difficulty buttons
    const diffs: { key: 'leerling' | 'ridder' | 'meester'; label: string; desc: string }[] = [
      { key: 'leerling', label: 'Leerling', desc: '30s per som' },
      { key: 'ridder', label: 'Ridder', desc: '15s per som' },
      { key: 'meester', label: 'Meester', desc: '8s per som' },
    ];

    const diffW = Math.min(180, Math.round((W - 80) / 3) - 16);
    const diffH = Math.round(diffW * 0.34);
    diffs.forEach((d, i) => {
      const x = W / 2 + (i - 1) * (diffW + 16);
      const btn = this.makeDiffButton(x, diffBtnY, diffW, diffH, d.label, d.desc, d.key);
      this.diffBtns[d.key] = btn;
    });

    this.refreshDiffButtons();

    // Start button
    this.makeStartButton(W / 2, startBtnY);

    // Footer
    this.add.text(W / 2, H - 18, 'Gebruik pijltjestoetsen of klik om te selecteren', {
      fontFamily: 'Georgia, serif', fontSize: '13px', color: '#8866aa',
    }).setOrigin(0.5);

    // Particle emitter: floating sparkles
    const sparkles = this.add.particles(0, 0, '__DEFAULT', {
      x: { min: 0, max: W },
      y: H + 10,
      speedY: { min: -60, max: -120 },
      speedX: { min: -15, max: 15 },
      scale: { start: 0.6, end: 0 },
      alpha: { start: 1, end: 0 },
      tint: [0xf5c842, 0xffffff, 0xd4b8ff, 0xff8800],
      lifespan: 3000,
      frequency: 180,
      quantity: 1,
    });

    // Torch flicker: small circles near torches
    this.time.addEvent({
      delay: 80,
      loop: true,
      callback: () => {
        const torchPositions = [80, W - 80];
        torchPositions.forEach(tx => {
          const circle = this.add.circle(tx + Phaser.Math.Between(-4, 4), H * 0.38 + Phaser.Math.Between(-8, 0), 5, 0xff6600, 0.7);
          this.tweens.add({ targets: circle, alpha: 0, scaleX: 2, scaleY: 2, duration: 300, onComplete: () => circle.destroy() });
        });
      },
    });

    // Keyboard: arrows to change table
    this.input.keyboard!.on('keydown-LEFT', () => {
      this.selectedTable = Math.max(1, this.selectedTable - 1);
      this.refreshTableButtons();
    });
    this.input.keyboard!.on('keydown-RIGHT', () => {
      this.selectedTable = Math.min(10, this.selectedTable + 1);
      this.refreshTableButtons();
    });
    this.input.keyboard!.on('keydown-ENTER', () => this.startGame());
  }

  private makeTableButton(x: number, y: number, w: number, h: number, table: number, fontPx = 22) {
    const container = this.add.container(x, y);

    const bg = this.add.graphics();
    bg.fillStyle(0x3d1a6b, 1);
    bg.fillRoundedRect(-w / 2, -h / 2, w, h, 8);
    bg.lineStyle(2, 0xf5c842, 1);
    bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 8);

    const label = this.add.text(0, 0, `${table}`, {
      fontFamily: 'Georgia, serif', fontSize: `${fontPx}px`, color: '#ffffff', fontStyle: 'bold',
    }).setOrigin(0.5);

    container.add([bg, label]);
    container.setSize(w, h);
    container.setInteractive({ cursor: 'pointer' });
    container.on('pointerdown', () => {
      this.selectedTable = table;
      this.refreshTableButtons();
    });

    (container as any).__table = table;
    (container as any).__bg = bg;
    (container as any).__label = label;
    (container as any).__w = w;
    (container as any).__h = h;

    return container;
  }

  private refreshTableButtons() {
    this.tableButtons.forEach(btn => {
      const t = (btn as any).__table as number;
      const bg = (btn as any).__bg as Phaser.GameObjects.Graphics;
      const label = (btn as any).__label as Phaser.GameObjects.Text;
      const w = ((btn as any).__w as number) || 68;
      const h = ((btn as any).__h as number) || 46;
      const r = Math.max(4, Math.round(w * 0.12));
      bg.clear();
      if (t === this.selectedTable) {
        bg.fillStyle(0xf5c842, 1);
        bg.fillRoundedRect(-w / 2, -h / 2, w, h, r);
        bg.lineStyle(3, 0xffffff, 1);
        bg.strokeRoundedRect(-w / 2, -h / 2, w, h, r);
        label.setTint(0x1a0a2e);
        btn.setScale(1.1);
      } else {
        bg.fillStyle(0x3d1a6b, 1);
        bg.fillRoundedRect(-w / 2, -h / 2, w, h, r);
        bg.lineStyle(2, 0x8855cc, 1);
        bg.strokeRoundedRect(-w / 2, -h / 2, w, h, r);
        label.clearTint();
        btn.setScale(1);
      }
    });
  }

  private makeDiffButton(x: number, y: number, w: number, h: number, label: string, desc: string, key: string) {
    const container = this.add.container(x, y);
    const bg = this.add.graphics();
    const title = this.add.text(0, -10, label, {
      fontFamily: 'Georgia, serif', fontSize: '18px', color: '#f5c842', fontStyle: 'bold',
    }).setOrigin(0.5);
    const sub = this.add.text(0, 12, desc, {
      fontFamily: 'Georgia, serif', fontSize: '13px', color: '#d4b8ff',
    }).setOrigin(0.5);

    container.add([bg, title, sub]);
    container.setSize(w, h);
    container.setInteractive({ cursor: 'pointer' });
    container.on('pointerdown', () => {
      this.selectedDifficulty = key as any;
      this.refreshDiffButtons();
    });

    (container as any).__key = key;
    (container as any).__bg = bg;
    (container as any).__w = w;
    (container as any).__h = h;

    return container;
  }

  private refreshDiffButtons() {
    Object.entries(this.diffBtns).forEach(([key, btn]) => {
      const bg = (btn as any).__bg as Phaser.GameObjects.Graphics;
      const w = (btn as any).__w as number;
      const h = (btn as any).__h as number;
      bg.clear();
      if (key === this.selectedDifficulty) {
        bg.fillStyle(0x6b2fa0, 1);
        bg.fillRoundedRect(-w / 2, -h / 2, w, h, 10);
        bg.lineStyle(2, 0xf5c842, 1);
        bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 10);
        btn.setScale(1.05);
      } else {
        bg.fillStyle(0x2d1b69, 1);
        bg.fillRoundedRect(-w / 2, -h / 2, w, h, 10);
        bg.lineStyle(2, 0x5533aa, 1);
        bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 10);
        btn.setScale(1);
      }
    });
  }

  private makeStartButton(x: number, y: number) {
    const container = this.add.container(x, y);
    const w = 240, h = 64;

    const bg = this.add.graphics();
    bg.fillStyle(0xc0392b, 1);
    bg.fillRoundedRect(-w / 2, -h / 2, w, h, 14);
    bg.lineStyle(3, 0xf5c842, 1);
    bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 14);

    const label = this.add.text(0, 0, '⚔  AANVALLEN!  ⚔', {
      fontFamily: 'Georgia, serif', fontSize: '24px', color: '#ffffff', fontStyle: 'bold',
    }).setOrigin(0.5);

    container.add([bg, label]);
    container.setSize(w, h);
    container.setInteractive({ cursor: 'pointer' });

    this.tweens.add({ targets: container, scaleX: 1.04, scaleY: 1.04, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.inOut' });

    container.on('pointerover', () => { bg.clear(); bg.fillStyle(0xe74c3c, 1); bg.fillRoundedRect(-w/2,-h/2,w,h,14); bg.lineStyle(3,0xf5c842,1); bg.strokeRoundedRect(-w/2,-h/2,w,h,14); });
    container.on('pointerout', () => { bg.clear(); bg.fillStyle(0xc0392b, 1); bg.fillRoundedRect(-w/2,-h/2,w,h,14); bg.lineStyle(3,0xf5c842,1); bg.strokeRoundedRect(-w/2,-h/2,w,h,14); });
    container.on('pointerdown', () => this.startGame());
  }

  private startGame() {
    const timeMap = { leerling: 30, ridder: 15, meester: 8 };
    this.cameras.main.fade(500, 0, 0, 0);
    this.time.delayedCall(500, () => {
      this.scene.start('BattleScene', {
        table: this.selectedTable,
        difficulty: this.selectedDifficulty,
        timeLimit: timeMap[this.selectedDifficulty],
      });
    });
  }
}
