import Phaser from 'phaser';
import { drawCastleBackground } from '../gfx/castle';
import { createKnight, KnightHandle } from '../gfx/knight';
import { KNIGHT_THEMES, setSelectedTheme, KnightTheme } from '../state/character';
import { playClick } from '../audio/soundFX';

export class CharacterScene extends Phaser.Scene {
  private battleData!: object;
  private selectedThemeIdx = 0;
  private knightPreview?: KnightHandle;
  private themeCards: Phaser.GameObjects.Container[] = [];

  constructor() { super('CharacterScene'); }

  init(data: object) {
    this.battleData = data;
    this.selectedThemeIdx = 0;
  }

  create() {
    const W = this.scale.width;
    const H = this.scale.height;

    drawCastleBackground(this, W, H);

    // Dark overlay for readability
    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0.45);
    overlay.fillRect(0, 0, W, H);

    this.cameras.main.fadeIn(350);

    // Title
    this.add.text(W / 2, Math.round(H * 0.07), 'KIES JE RIDDER', {
      fontFamily: "'Cinzel Decorative', serif",
      fontSize: `${Math.round(Math.max(24, Math.min(44, H * 0.07)))}px`,
      color: '#f5c842', fontStyle: 'bold',
      stroke: '#7a4500', strokeThickness: 3,
    }).setOrigin(0.5);

    this.add.text(W / 2, Math.round(H * 0.14), 'Kies de uitrusting voor je ridder', {
      fontFamily: 'Cinzel, serif', fontSize: '16px', color: '#d4b8ff',
    }).setOrigin(0.5);

    // Knight preview area (left/center)
    const previewX = Math.round(W * 0.3);
    const previewY = Math.round(H * 0.52);
    const knightScale = Math.max(0.7, Math.min(1.5, H / 576 * 1.1));
    this.buildKnightPreview(previewX, previewY, knightScale);

    // Theme cards (right side)
    this.buildThemeCards(W, H);

    // Start button
    this.makeStartButton(W, H);
  }

  private buildKnightPreview(x: number, y: number, scale: number) {
    this.knightPreview?.container.destroy();
    const theme = KNIGHT_THEMES[this.selectedThemeIdx];
    this.knightPreview = createKnight(this, x, y, theme.colors);
    this.knightPreview.container.setScale(scale).setDepth(5);
    this.tweens.add({
      targets: this.knightPreview.container,
      y: y - 12, duration: 1400, yoyo: true, repeat: -1, ease: 'Sine.inOut',
    });

    // Theme name below preview
    if ((this as any).__themeLabel) {
      ((this as any).__themeLabel as Phaser.GameObjects.Text).destroy();
    }
    const label = this.add.text(x, y + 180, theme.label, {
      fontFamily: 'Cinzel, serif', fontSize: '20px',
      color: `#${theme.accentColor.toString(16).padStart(6, '0')}`,
      fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(6);
    (this as any).__themeLabel = label;
  }

  private buildThemeCards(W: number, H: number) {
    this.themeCards.forEach(c => c.destroy());
    this.themeCards = [];

    const cardW = Math.min(200, Math.round((W * 0.42 - 40) / 2));
    const cardH = Math.round(cardW * 0.55);
    const gap = 14;
    const startX = Math.round(W * 0.58);
    const startY = Math.round(H * 0.28);

    KNIGHT_THEMES.forEach((theme, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const cx = startX + col * (cardW + gap) + cardW / 2;
      const cy = startY + row * (cardH + gap) + cardH / 2;

      const card = this.makeThemeCard(cx, cy, cardW, cardH, theme, i);
      this.themeCards.push(card);
    });

    this.refreshCards();
  }

  private makeThemeCard(x: number, y: number, w: number, h: number, theme: KnightTheme, idx: number) {
    const card = this.add.container(x, y).setDepth(10);

    const bg = this.add.graphics();
    card.add(bg);

    // Color swatches: 3 stripes (armor | shield | plume)
    const sw = Math.floor((w - 24) / 3);
    const sy = -8;
    const sh = 24;
    [theme.colors.armorMain, theme.colors.shieldColor, theme.colors.plumeColor].forEach((col, ci) => {
      const stripe = this.add.graphics();
      stripe.fillStyle(col, 1);
      stripe.fillRoundedRect(-w / 2 + 12 + ci * (sw + 4), sy, sw, sh, 4);
      card.add(stripe);
    });

    const label = this.add.text(0, h / 2 - 18, theme.label, {
      fontFamily: 'Cinzel, serif', fontSize: '13px', color: '#ffffff', fontStyle: 'bold',
    }).setOrigin(0.5);
    card.add(label);

    card.setSize(w, h).setInteractive({ cursor: 'pointer' });
    card.on('pointerdown', () => {
      playClick();
      this.selectedThemeIdx = idx;
      setSelectedTheme(theme.id);
      this.refreshCards();
      const previewX = Math.round(this.scale.width * 0.3);
      const previewY = Math.round(this.scale.height * 0.52);
      const knightScale = Math.max(0.7, Math.min(1.5, this.scale.height / 576 * 1.1));
      this.tweens.killAll();
      this.buildKnightPreview(previewX, previewY, knightScale);
    });
    card.on('pointerover', () => { (card as any).__hover = true; this.drawCardBg(bg, w, h, theme, idx, true); });
    card.on('pointerout', () => { (card as any).__hover = false; this.drawCardBg(bg, w, h, theme, idx, false); });

    (card as any).__idx = idx;
    (card as any).__theme = theme;
    (card as any).__w = w;
    (card as any).__h = h;

    return card;
  }

  private drawCardBg(bg: Phaser.GameObjects.Graphics, w: number, h: number, theme: KnightTheme, idx: number, hover: boolean) {
    const selected = idx === this.selectedThemeIdx;
    bg.clear();
    bg.fillStyle(selected ? 0x1a0a40 : hover ? 0x160830 : 0x0d0520, 1);
    bg.fillRoundedRect(-w / 2, -h / 2, w, h, 10);
    bg.lineStyle(selected ? 3 : 1, selected ? theme.accentColor : 0x443366, 1);
    bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 10);
  }

  private refreshCards() {
    this.themeCards.forEach(card => {
      const idx = (card as any).__idx as number;
      const theme = (card as any).__theme as KnightTheme;
      const w = (card as any).__w as number;
      const h = (card as any).__h as number;
      const bg = (card.list[0]) as Phaser.GameObjects.Graphics;
      this.drawCardBg(bg, w, h, theme, idx, false);
    });
  }

  private makeStartButton(W: number, H: number) {
    const bw = 220, bh = 58;
    const by = Math.round(H * 0.88);
    const btn = this.add.container(W / 2, by).setDepth(10);

    const bg = this.add.graphics();
    const drawBg = (hover: boolean) => {
      bg.clear();
      bg.fillStyle(hover ? 0xe74c3c : 0xc0392b, 1);
      bg.fillRoundedRect(-bw / 2, -bh / 2, bw, bh, 14);
      bg.lineStyle(3, 0xf5c842, 1);
      bg.strokeRoundedRect(-bw / 2, -bh / 2, bw, bh, 14);
    };
    drawBg(false);

    const label = this.add.text(0, 0, 'De strijd in!', {
      fontFamily: 'Cinzel, serif', fontSize: '22px', color: '#ffffff', fontStyle: 'bold',
    }).setOrigin(0.5);

    btn.add([bg, label]);
    btn.setSize(bw, bh).setInteractive({ cursor: 'pointer' });
    btn.on('pointerover', () => drawBg(true));
    btn.on('pointerout', () => drawBg(false));
    btn.on('pointerdown', () => {
      playClick();
      setSelectedTheme(KNIGHT_THEMES[this.selectedThemeIdx].id);
      this.cameras.main.fade(400, 0, 0, 0);
      this.time.delayedCall(400, () => this.scene.start('BattleScene', this.battleData));
    });

    this.tweens.add({ targets: btn, scaleX: 1.04, scaleY: 1.04, duration: 800, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
  }
}
