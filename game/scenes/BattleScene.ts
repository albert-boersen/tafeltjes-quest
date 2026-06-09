import Phaser from 'phaser';
import { drawCastleBackground } from '../gfx/castle';
import { createKnight, KnightHandle } from '../gfx/knight';
import { createDragon, DragonHandle } from '../gfx/dragon';

interface BattleData {
  table: number;
  difficulty: string;
  timeLimit: number;
}

export class BattleScene extends Phaser.Scene {
  private data2!: BattleData;
  private knightHp = 100;
  private dragonHp = 100;
  private knightHpBar!: Phaser.GameObjects.Graphics;
  private dragonHpBar!: Phaser.GameObjects.Graphics;
  private questionText!: Phaser.GameObjects.Text;
  private inputDisplay!: Phaser.GameObjects.Text;
  private feedbackText!: Phaser.GameObjects.Text;
  private timerBar!: Phaser.GameObjects.Graphics;
  private timerText!: Phaser.GameObjects.Text;
  private knight!: KnightHandle;
  private dragon!: DragonHandle;
  private knightBaseX = 160;
  private dragonBaseX = 0;
  private knightBaseY = 0;
  private dragonBaseY = 0;
  private currentAnswer = 0;
  private playerInput = '';
  private timeLeft = 15;
  private timerEvent?: Phaser.Time.TimerEvent;
  private correctStreak = 0;
  private totalCorrect = 0;
  private totalWrong = 0;
  private question = { a: 0, b: 0 };
  private roundsDone = 0;
  private readonly TOTAL_ROUNDS = 10;
  private locked = false;

  constructor() { super('BattleScene'); }

  init(data: BattleData) {
    this.data2 = data;
    this.knightHp = 100;
    this.dragonHp = 100;
    this.playerInput = '';
    this.correctStreak = 0;
    this.totalCorrect = 0;
    this.totalWrong = 0;
    this.roundsDone = 0;
    this.locked = false;
  }

  create() {
    const W = this.scale.width;
    const H = this.scale.height;

    // Character bounding extents at scale=1 (measured from their local origin):
    //   Knight:  left=78px (shield), right=55px (sword), top=135px (plume), foot=92px
    //   Dragon:  after x-flip: right=162px (wing), left=150px (tail), top=158px (wing), foot=136px
    const charScale = Math.max(0.55, Math.min(1.4, H / 576));
    const hudTop = H - 170;

    this.knightBaseX = Math.round(78 * charScale) + 35;
    this.knightBaseY = hudTop - Math.round(92 * charScale);

    this.dragonBaseX = W - Math.round(162 * charScale) - 35;
    this.dragonBaseY = hudTop - Math.round(136 * charScale);

    drawCastleBackground(this, W, H);

    this.knight = createKnight(this, this.knightBaseX, this.knightBaseY);
    this.knight.container.setScale(charScale);

    this.dragon = createDragon(this, this.dragonBaseX, this.dragonBaseY);
    this.dragon.container.setScale(-charScale, charScale);

    // Idle float
    this.tweens.add({ targets: this.knight.container, y: this.knightBaseY - 10, duration: 1200, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    this.tweens.add({ targets: this.dragon.container, y: this.dragonBaseY + 12, duration: 1500, yoyo: true, repeat: -1, ease: 'Sine.inOut' });

    this.createHUD(W, H);
    this.createAnswerInput(W, H);
    this.createParticles(W, H);
    this.setupKeyboard();

    this.cameras.main.fadeIn(400);
    this.nextQuestion();
  }

  private createHUD(W: number, H: number) {
    const panelH = 150;
    const panelY = H - panelH - 10;
    // HP bars must not reach the centre region (question needs ~420px centred)
    const hpBarW = Math.min(220, Math.max(80, W / 2 - 230));

    const panel = this.add.graphics();
    panel.fillStyle(0x0a0520, 0.88);
    panel.fillRoundedRect(10, panelY - 6, W - 20, panelH + 16, 14);
    panel.lineStyle(2, 0x4a2890, 1);
    panel.strokeRoundedRect(10, panelY - 6, W - 20, panelH + 16, 14);

    // Knight HP (left)
    this.add.text(20, panelY + 2, '⚔ Ridder', { fontFamily: 'Georgia, serif', fontSize: '15px', color: '#88aaff', fontStyle: 'bold' });
    this.knightHpBar = this.add.graphics();
    this.drawHpBar(this.knightHpBar, 20, panelY + 24, hpBarW, this.knightHp, 0x27ae60);

    // Dragon HP (right)
    this.add.text(W - hpBarW - 20, panelY + 2, '🐉 Draak', { fontFamily: 'Georgia, serif', fontSize: '15px', color: '#ff8888', fontStyle: 'bold' });
    this.dragonHpBar = this.add.graphics();
    this.drawHpBar(this.dragonHpBar, W - hpBarW - 20, panelY + 24, hpBarW, this.dragonHp, 0xc0392b);

    // Centre: table label, timer, question, input — all tightly stacked
    this.add.text(W / 2, panelY + 2, `Tafel van ${this.data2.table}`, {
      fontFamily: 'Georgia, serif', fontSize: '16px', color: '#f5c842', fontStyle: 'bold',
    }).setOrigin(0.5, 0);

    this.timerBar = this.add.graphics();
    this.timerText = this.add.text(W / 2, panelY + 24, '', {
      fontFamily: 'Georgia, serif', fontSize: '13px', color: '#aaaacc',
    }).setOrigin(0.5, 0);

    const questionFontPx = Math.round(Math.max(26, Math.min(40, W / 28)));
    this.questionText = this.add.text(W / 2, panelY + 44, '', {
      fontFamily: 'Georgia, serif', fontSize: `${questionFontPx}px`, color: '#ffffff', fontStyle: 'bold',
      stroke: '#2d1b69', strokeThickness: 4,
    }).setOrigin(0.5, 0);

    // Input box at the bottom of the panel
    const inputBg = this.add.graphics();
    inputBg.fillStyle(0x1a0a3e, 1);
    inputBg.fillRoundedRect(W / 2 - 90, panelY + 95, 180, 46, 10);
    inputBg.lineStyle(2, 0xf5c842, 1);
    inputBg.strokeRoundedRect(W / 2 - 90, panelY + 95, 180, 46, 10);

    this.inputDisplay = this.add.text(W / 2, panelY + 118, '_', {
      fontFamily: 'Georgia, serif', fontSize: '28px', color: '#f5c842', fontStyle: 'bold',
    }).setOrigin(0.5);

    // feedbackText is unused — feedback now shown as floating popup via showFeedback()
    this.feedbackText = this.add.text(-9999, -9999, '');
  }

  private createAnswerInput(_W: number, _H: number) {
    // Input is now created directly inside createHUD for correct layout
  }

  private createParticles(W: number, H: number) {
    this.add.particles(0, 0, '__DEFAULT', {
      x: { min: 0, max: W }, y: H,
      speedY: { min: -40, max: -80 },
      scale: { start: 0.5, end: 0 },
      alpha: { start: 0.7, end: 0 },
      tint: [0xf5c842, 0xd4b8ff],
      lifespan: 4000, frequency: 300, quantity: 1,
    });
  }

  private setupKeyboard() {
    this.input.keyboard!.on('keydown', (event: KeyboardEvent) => {
      if (this.locked) return;
      if (event.key >= '0' && event.key <= '9') {
        if (this.playerInput.length < 4) {
          this.playerInput += event.key;
          this.updateInputDisplay();
        }
      } else if (event.key === 'Backspace') {
        this.playerInput = this.playerInput.slice(0, -1);
        this.updateInputDisplay();
      } else if (event.key === 'Enter' && this.playerInput.length > 0) {
        this.submitAnswer();
      }
    });
  }

  private updateInputDisplay() {
    this.inputDisplay.setText(this.playerInput || '_');
  }

  private nextQuestion() {
    if (this.roundsDone >= this.TOTAL_ROUNDS) { this.endBattle(); return; }
    this.playerInput = '';
    this.updateInputDisplay();
    this.feedbackText.setText('');
    this.locked = false;

    const b = Phaser.Utils.Array.GetRandom([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) as number;
    const a = this.data2.table;
    this.question = { a, b };
    this.currentAnswer = a * b;
    this.questionText.setText(`${b} × ${a} = ?`);
    this.questionText.setAlpha(0).setScale(1.3);
    this.tweens.add({ targets: this.questionText, alpha: 1, scaleX: 1, scaleY: 1, duration: 200, ease: 'Back.out' });
    this.startTimer();
  }

  private startTimer() {
    this.timerEvent?.remove();
    this.timeLeft = this.data2.timeLimit;
    this.updateTimerBar();
    this.timerEvent = this.time.addEvent({
      delay: 1000,
      repeat: this.data2.timeLimit - 1,
      callback: () => {
        this.timeLeft--;
        this.updateTimerBar();
        if (this.timeLeft <= 0) this.onTimeout();
      },
    });
  }

  private updateTimerBar() {
    const W = this.scale.width;
    const H = this.scale.height;
    const panelY = H - 160;
    const barW = 180;
    const ratio = this.timeLeft / this.data2.timeLimit;
    const color = ratio > 0.5 ? 0x27ae60 : ratio > 0.25 ? 0xf39c12 : 0xc0392b;
    this.timerBar.clear();
    this.timerBar.fillStyle(0x2c1b50, 1);
    this.timerBar.fillRoundedRect(W / 2 - barW / 2, panelY + 22, barW, 10, 5);
    this.timerBar.fillStyle(color, 1);
    this.timerBar.fillRoundedRect(W / 2 - barW / 2, panelY + 22, barW * ratio, 10, 5);
    this.timerText.setText(`${this.timeLeft}s`);
  }

  private onTimeout() {
    if (this.locked) return;
    this.locked = true;
    this.timerEvent?.remove();
    this.correctStreak = 0;
    this.totalWrong++;
    this.roundsDone++;
    this.showFeedback(false, this.currentAnswer);
    this.dragonAttacks();
    this.knightHp = Math.max(0, this.knightHp - 20);
    this.time.delayedCall(1800, () => {
      this.drawHpBar(this.knightHpBar, 30, this.scale.height - 160 + 26, 220, this.knightHp, 0x27ae60);
      if (this.knightHp <= 0) { this.endBattle(); return; }
      this.nextQuestion();
    });
  }

  private submitAnswer() {
    if (this.locked) return;
    this.locked = true;
    this.timerEvent?.remove();
    const guess = parseInt(this.playerInput, 10);
    const correct = guess === this.currentAnswer;
    this.roundsDone++;

    if (correct) {
      this.totalCorrect++;
      this.correctStreak++;
      this.showFeedback(true);
      this.knightAttacks();
      const dmg = this.correctStreak >= 3 ? 15 : 10;
      this.dragonHp = Math.max(0, this.dragonHp - dmg);
      if (this.correctStreak >= 3) this.showCombo();
      this.time.delayedCall(1600, () => {
        this.drawHpBar(this.dragonHpBar, this.scale.width - 260, this.scale.height - 160 + 26, 220, this.dragonHp, 0xc0392b);
        if (this.dragonHp <= 0) { this.endBattle(); return; }
        this.nextQuestion();
      });
    } else {
      this.totalWrong++;
      this.correctStreak = 0;
      this.showFeedback(false, this.currentAnswer);
      this.dragonAttacks();
      this.knightHp = Math.max(0, this.knightHp - 20);
      this.time.delayedCall(1800, () => {
        this.drawHpBar(this.knightHpBar, 30, this.scale.height - 160 + 26, 220, this.knightHp, 0x27ae60);
        if (this.knightHp <= 0) { this.endBattle(); return; }
        this.nextQuestion();
      });
    }
  }

  private showFeedback(correct: boolean, showAnswer?: number) {
    const W = this.scale.width;
    const H = this.scale.height;
    const msg = correct ? '✓  Goed gedaan!' : `✗  Fout!   Antwoord: ${showAnswer}`;
    const bgFill = correct ? 0x0d3b1e : 0x3b0d0d;
    const borderColor = correct ? 0x27ae60 : 0xe74c3c;
    const textColor = correct ? '#2ecc71' : '#ff6666';

    const popup = this.add.container(W / 2, H - 185);

    const bg = this.add.graphics();
    bg.fillStyle(bgFill, 0.95);
    bg.fillRoundedRect(-200, -26, 400, 52, 26);
    bg.lineStyle(3, borderColor, 1);
    bg.strokeRoundedRect(-200, -26, 400, 52, 26);

    const label = this.add.text(0, 0, msg, {
      fontFamily: 'Georgia, serif',
      fontSize: '26px',
      color: textColor,
      fontStyle: 'bold',
    }).setOrigin(0.5);

    popup.add([bg, label]);
    popup.setAlpha(0).setScale(0.75);
    popup.setDepth(100);

    this.tweens.add({
      targets: popup, alpha: 1, scaleX: 1, scaleY: 1, duration: 180, ease: 'Back.out',
      onComplete: () => {
        this.tweens.add({
          targets: popup, alpha: 0, y: H - 210, duration: 380, delay: 1000,
          onComplete: () => popup.destroy(),
        });
      },
    });
  }

  private showCombo() {
    const W = this.scale.width;
    const labels = ['', '', '', '🔥 x3 COMBO!', '⚡ x4 COMBO!', '💥 x5 COMBO!'];
    const label = labels[Math.min(this.correctStreak, labels.length - 1)] || `🌟 x${this.correctStreak} COMBO!`;
    const ct = this.add.text(W / 2, this.scale.height * 0.3, label, {
      fontFamily: 'Georgia, serif', fontSize: '36px', color: '#ffcc00', fontStyle: 'bold',
      stroke: '#7a4400', strokeThickness: 5,
    }).setOrigin(0.5).setAlpha(0);
    this.tweens.add({
      targets: ct, alpha: 1, y: this.scale.height * 0.25, duration: 300, ease: 'Back.out',
      onComplete: () => this.tweens.add({ targets: ct, alpha: 0, y: this.scale.height * 0.2, duration: 500, delay: 600, onComplete: () => ct.destroy() }),
    });
  }

  private knightAttacks() {
    this.knight.setAttacking(true);
    const H = this.scale.height;

    this.tweens.add({
      targets: this.knight.container, x: this.knightBaseX + 120, duration: 200, ease: 'Power2.in',
      onComplete: () => {
        this.spawnSpellEffect(this.knightBaseX + 120, this.knightBaseY, this.dragonBaseX, this.dragonBaseY);
        this.tweens.add({ targets: this.knight.container, x: this.knightBaseX, duration: 320, ease: 'Power2.out' });
        this.time.delayedCall(260, () => this.knight.setAttacking(false));
      },
    });
  }

  private dragonAttacks() {
    this.dragon.setRoaring(true);
    this.cameras.main.shake(300, 0.008);

    this.tweens.add({
      targets: this.dragon.container, x: this.dragonBaseX - 120, duration: 200, ease: 'Power2.in',
      onComplete: () => {
        this.spawnFireEffect(this.dragonBaseX - 120, this.dragonBaseY);
        this.tweens.add({ targets: this.dragon.container, x: this.dragonBaseX, duration: 360, ease: 'Power2.out' });
        this.time.delayedCall(420, () => this.dragon.setRoaring(false));
      },
    });

    // Knight hit flash: temporary red overlay at knight position
    const flash = this.add.rectangle(this.knightBaseX, this.knightBaseY, 120, 180, 0xff3333, 0.55);
    this.tweens.add({ targets: flash, alpha: 0, duration: 500, onComplete: () => flash.destroy() });
  }

  private spawnSpellEffect(fromX: number, fromY: number, toX: number, toY: number) {
    const proj = this.add.circle(fromX, fromY, 12, 0xf5c842);
    const trail = this.add.particles(fromX, fromY, '__DEFAULT', {
      follow: proj,
      scale: { start: 0.7, end: 0 },
      alpha: { start: 0.9, end: 0 },
      tint: [0xf5c842, 0xffaa00, 0xffffff],
      lifespan: 280, frequency: 18,
    });
    this.tweens.add({
      targets: proj, x: toX, y: toY, duration: 320, ease: 'Power1.in',
      onComplete: () => {
        trail.destroy(); proj.destroy();
        this.spawnHitEffect(toX, toY);
        this.cameras.main.shake(140, 0.006);
      },
    });
  }

  private spawnFireEffect(x: number, y: number) {
    for (let i = 0; i < 14; i++) {
      const angle = (i / 14) * Math.PI * 2;
      const speed = Phaser.Math.Between(60, 150);
      const color = Phaser.Utils.Array.GetRandom([0xff6600, 0xffcc00, 0xff3300, 0xff8800]) as number;
      const circle = this.add.circle(x, y, Phaser.Math.Between(4, 12), color);
      this.tweens.add({
        targets: circle,
        x: x + Math.cos(angle) * speed, y: y + Math.sin(angle) * speed,
        alpha: 0, scaleX: 0, scaleY: 0,
        duration: Phaser.Math.Between(400, 750), ease: 'Power2.out',
        onComplete: () => circle.destroy(),
      });
    }
  }

  private spawnHitEffect(x: number, y: number) {
    for (let i = 0; i < 18; i++) {
      const angle = (i / 18) * Math.PI * 2;
      const speed = Phaser.Math.Between(40, 130);
      const color = Phaser.Utils.Array.GetRandom([0xf5c842, 0xffffff, 0xffaa00, 0xddddff]) as number;
      const circle = this.add.circle(x, y, Phaser.Math.Between(3, 9), color);
      this.tweens.add({
        targets: circle,
        x: x + Math.cos(angle) * speed, y: y + Math.sin(angle) * speed,
        alpha: 0, scaleX: 0, scaleY: 0,
        duration: Phaser.Math.Between(350, 650), ease: 'Power2.out',
        onComplete: () => circle.destroy(),
      });
    }
    const flash = this.add.circle(x, y, 38, 0xffffff, 0.65);
    this.tweens.add({ targets: flash, alpha: 0, scaleX: 2.8, scaleY: 2.8, duration: 260, onComplete: () => flash.destroy() });
    const star = this.add.star(x, y, 6, 12, 28, 0xf5c842);
    this.tweens.add({ targets: star, alpha: 0, scaleX: 3, scaleY: 3, angle: 90, duration: 420, onComplete: () => star.destroy() });
  }

  private drawHpBar(g: Phaser.GameObjects.Graphics, x: number, y: number, w: number, hp: number, color: number) {
    g.clear();
    g.fillStyle(0x2c1b50, 1);
    g.fillRoundedRect(x, y, w, 16, 8);
    if (hp > 0) {
      g.fillStyle(color, 1);
      g.fillRoundedRect(x + 1, y + 1, (w - 2) * hp / 100, 14, 7);
    }
    g.lineStyle(1, 0x8855cc, 0.7);
    g.strokeRoundedRect(x, y, w, 16, 8);
    const label = this.add.text(x + w / 2, y + 8, `${hp}%`, {
      fontFamily: 'Georgia, serif', fontSize: '12px', color: '#ffffff',
    }).setOrigin(0.5);
    this.time.delayedCall(50, () => label.destroy());
  }

  private endBattle() {
    this.timerEvent?.remove();
    this.locked = true;
    const won = this.dragonHp <= 0 || (this.knightHp > 0 && this.roundsDone >= this.TOTAL_ROUNDS && this.totalCorrect > this.totalWrong);
    this.cameras.main.fade(600, 0, 0, 0);
    this.time.delayedCall(600, () => {
      this.scene.start('ResultScene', {
        won, table: this.data2.table, difficulty: this.data2.difficulty,
        totalCorrect: this.totalCorrect, totalWrong: this.totalWrong,
        knightHp: this.knightHp, dragonHp: this.dragonHp,
      });
    });
  }
}
