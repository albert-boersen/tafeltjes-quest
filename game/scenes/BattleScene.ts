import Phaser from 'phaser';
import { createKnight, KnightHandle } from '../gfx/knight';
import { EnemyHandle, WORLDS, WorldDef } from '../gfx/worlds';
import { recordResult, tickCooldowns } from '../state/cooldown';
import {
  playCorrect, playWrong, playAttack, playDragonRoar,
  playTimerTick, playTimerUrgent, playVictory, playDefeat, playWorldTransition, playCombo,
} from '../audio/soundFX';

interface BattleData {
  table: number;
  difficulty: string;
  timeLimit: number;
}

export class BattleScene extends Phaser.Scene {
  private data2!: BattleData;
  private knightHp = 100;
  private enemyHp = 100;
  private knightHpBar!: Phaser.GameObjects.Graphics;
  private enemyHpBar!: Phaser.GameObjects.Graphics;
  private questionText!: Phaser.GameObjects.Text;
  private inputDisplay!: Phaser.GameObjects.Text;
  private feedbackText!: Phaser.GameObjects.Text;
  private timerBar!: Phaser.GameObjects.Graphics;
  private timerText!: Phaser.GameObjects.Text;
  private knight!: KnightHandle;
  private enemy!: EnemyHandle;
  private bgContainer?: Phaser.GameObjects.Container;
  private currentWorld?: WorldDef;
  private knightBaseX = 0;
  private knightBaseY = 0;
  private enemyBaseX = 0;
  private enemyBaseY = 0;
  private charScale = 1;
  private currentAnswer = 0;
  private playerInput = '';
  private timeLeft = 15;
  private timerEvent?: Phaser.Time.TimerEvent;
  private correctStreak = 0;
  private totalCorrect = 0;
  private totalWrong = 0;
  private roundsDone = 0;
  private readonly TOTAL_ROUNDS = 10;
  private locked = false;
  private choiceContainer?: Phaser.GameObjects.Container;
  private hudDepth = 10;
  private question = { a: 0, b: 0 };

  constructor() { super('BattleScene'); }

  init(data: BattleData) {
    this.data2 = data;
    this.knightHp = 100;
    this.enemyHp = 100;
    this.playerInput = '';
    this.correctStreak = 0;
    this.totalCorrect = 0;
    this.totalWrong = 0;
    this.roundsDone = 0;
    this.locked = false;
    this.currentWorld = undefined;
    tickCooldowns(data.table);
  }

  create() {
    const W = this.scale.width;
    const H = this.scale.height;

    this.charScale = Math.max(0.55, Math.min(1.4, H / 576));
    const hudTop = H - 170;

    this.knightBaseX = Math.round(78 * this.charScale) + 35;
    this.knightBaseY = hudTop - Math.round(92 * this.charScale);
    // enemyBaseX/Y will be set when first world is picked in nextQuestion

    // Initial background (castle, will be swapped on first question)
    const firstWorld = WORLDS[0];
    this.bgContainer = firstWorld.drawBg(this, W, H);
    this.bgContainer.setDepth(0);

    this.knight = createKnight(this, this.knightBaseX, this.knightBaseY);
    this.knight.container.setScale(this.charScale).setDepth(5);
    this.tweens.add({ targets: this.knight.container, y: this.knightBaseY - 10, duration: 1200, yoyo: true, repeat: -1, ease: 'Sine.inOut' });

    // Placeholder enemy will be replaced by nextQuestion
    this.computeEnemyPos(firstWorld, W, H);
    this.enemy = firstWorld.createEnemy(this, this.enemyBaseX, this.enemyBaseY);
    this.enemy.container.setScale(this.charScale).setDepth(5);
    this.currentWorld = firstWorld;
    this.tweens.add({ targets: this.enemy.container, y: this.enemyBaseY + 12, duration: 1500, yoyo: true, repeat: -1, ease: 'Sine.inOut' });

    this.createHUD(W, H);
    this.createParticles(W, H);
    this.setupKeyboard();

    this.cameras.main.fadeIn(400);
    this.nextQuestion();
  }

  private computeEnemyPos(world: WorldDef, W: number, H: number) {
    const hudTop = H - 170;
    // No x-flip: characters face left naturally, position by right (back) extent
    this.enemyBaseX = W - Math.round(world.enemyRight * this.charScale) - 35;
    this.enemyBaseY = hudTop - Math.round(world.enemyFoot * this.charScale);
  }

  private swapWorld(newWorld: WorldDef, onDone: () => void) {
    if (newWorld.id === this.currentWorld?.id) { onDone(); return; }

    const W = this.scale.width; const H = this.scale.height;
    playWorldTransition();

    const overlay = this.add.rectangle(W / 2, H / 2, W, H, 0x000000).setAlpha(0).setDepth(200);
    this.tweens.add({
      targets: overlay, alpha: 0.92, duration: 160,
      onComplete: () => {
        // Destroy old background
        this.bgContainer?.destroy();
        this.bgContainer = newWorld.drawBg(this, W, H);
        this.bgContainer.setDepth(0);

        // Destroy old enemy
        this.tweens.killTweensOf(this.enemy.container);
        this.enemy.container.destroy();
        this.computeEnemyPos(newWorld, W, H);
        this.enemy = newWorld.createEnemy(this, this.enemyBaseX, this.enemyBaseY);
        this.enemy.container.setScale(this.charScale).setDepth(5);
        this.tweens.add({ targets: this.enemy.container, y: this.enemyBaseY + 12, duration: 1500, yoyo: true, repeat: -1, ease: 'Sine.inOut' });

        this.currentWorld = newWorld;

        this.tweens.add({
          targets: overlay, alpha: 0, duration: 180,
          onComplete: () => { overlay.destroy(); onDone(); },
        });
      },
    });
  }

  private createHUD(W: number, H: number) {
    const panelH = 150;
    const panelY = H - panelH - 10;
    const hpBarW = Math.min(220, Math.max(80, W / 2 - 230));
    const isSchildknaap = this.data2.difficulty === 'schildknaap';

    const panel = this.add.graphics().setDepth(this.hudDepth);
    panel.fillStyle(0x0a0520, 0.88);
    panel.fillRoundedRect(10, panelY - 6, W - 20, panelH + 16, 14);
    panel.lineStyle(2, 0x4a2890, 1);
    panel.strokeRoundedRect(10, panelY - 6, W - 20, panelH + 16, 14);

    this.add.text(20, panelY + 2, '⚔ Ridder', { fontFamily: 'Cinzel, serif', fontSize: '15px', color: '#88aaff', fontStyle: 'bold' }).setDepth(this.hudDepth);
    this.knightHpBar = this.add.graphics().setDepth(this.hudDepth);
    this.drawHpBar(this.knightHpBar, 20, panelY + 24, hpBarW, this.knightHp, 0x27ae60);

    this.add.text(W - hpBarW - 20, panelY + 2, '👾 Vijand', { fontFamily: 'Cinzel, serif', fontSize: '15px', color: '#ff8888', fontStyle: 'bold' }).setDepth(this.hudDepth);
    this.enemyHpBar = this.add.graphics().setDepth(this.hudDepth);
    this.drawHpBar(this.enemyHpBar, W - hpBarW - 20, panelY + 24, hpBarW, this.enemyHp, 0xc0392b);

    this.add.text(W / 2, panelY + 2, `Tafel van ${this.data2.table}`, {
      fontFamily: 'Cinzel, serif', fontSize: '16px', color: '#f5c842', fontStyle: 'bold',
    }).setOrigin(0.5, 0).setDepth(this.hudDepth);

    this.timerBar = this.add.graphics().setDepth(this.hudDepth);
    this.timerText = this.add.text(W / 2, panelY + 24, '', {
      fontFamily: 'Cinzel, serif', fontSize: '13px', color: '#aaaacc',
    }).setOrigin(0.5, 0).setDepth(this.hudDepth);

    if (isSchildknaap) {
      // Question floats center-screen with its own dark backdrop
      const qy = Math.round(H * 0.38);
      const qFontPx = Math.round(Math.max(34, Math.min(52, W / 18)));
      const qBg = this.add.graphics().setDepth(14);
      qBg.fillStyle(0x060318, 0.94);
      qBg.fillRoundedRect(W / 2 - 220, qy - 44, 440, 88, 22);
      qBg.lineStyle(3, 0x7744cc, 1);
      qBg.strokeRoundedRect(W / 2 - 220, qy - 44, 440, 88, 22);
      this.questionText = this.add.text(W / 2, qy, '', {
        fontFamily: 'Cinzel, serif', fontSize: `${qFontPx}px`, color: '#ffffff', fontStyle: 'bold',
        stroke: '#2d1b69', strokeThickness: 5,
      }).setOrigin(0.5).setDepth(15);
    } else {
      const questionFontPx = Math.round(Math.max(26, Math.min(40, W / 28)));
      this.questionText = this.add.text(W / 2, panelY + 44, '', {
        fontFamily: 'Cinzel, serif', fontSize: `${questionFontPx}px`, color: '#ffffff', fontStyle: 'bold',
        stroke: '#2d1b69', strokeThickness: 4,
      }).setOrigin(0.5, 0).setDepth(this.hudDepth);
    }

    if (!isSchildknaap) {
      const inputBg = this.add.graphics().setDepth(this.hudDepth);
      inputBg.fillStyle(0x1a0a3e, 1);
      inputBg.fillRoundedRect(W / 2 - 90, panelY + 95, 180, 46, 10);
      inputBg.lineStyle(2, 0xf5c842, 1);
      inputBg.strokeRoundedRect(W / 2 - 90, panelY + 95, 180, 46, 10);

      this.inputDisplay = this.add.text(W / 2, panelY + 118, '_', {
        fontFamily: 'Cinzel, serif', fontSize: '28px', color: '#f5c842', fontStyle: 'bold',
      }).setOrigin(0.5).setDepth(this.hudDepth);
    } else {
      this.inputDisplay = this.add.text(-9999, -9999, '');
    }

    this.feedbackText = this.add.text(-9999, -9999, '');
  }

  private createParticles(W: number, H: number) {
    this.add.particles(0, 0, '__DEFAULT', {
      x: { min: 0, max: W }, y: H,
      speedY: { min: -40, max: -80 },
      scale: { start: 0.5, end: 0 },
      alpha: { start: 0.7, end: 0 },
      tint: [0xf5c842, 0xd4b8ff],
      lifespan: 4000, frequency: 300, quantity: 1,
    }).setDepth(7);
  }

  private setupKeyboard() {
    const isSchildknaap = this.data2.difficulty === 'schildknaap';
    this.input.keyboard!.on('keydown', (event: KeyboardEvent) => {
      if (this.locked) return;
      if (isSchildknaap) {
        const num = parseInt(event.key, 10);
        if (num >= 1 && num <= 4) this.selectChoice(num - 1);
      } else {
        if (event.key >= '0' && event.key <= '9') {
          if (this.playerInput.length < 4) { this.playerInput += event.key; this.updateInputDisplay(); }
        } else if (event.key === 'Backspace') {
          this.playerInput = this.playerInput.slice(0, -1); this.updateInputDisplay();
        } else if (event.key === 'Enter' && this.playerInput.length > 0) {
          this.submitAnswer(parseInt(this.playerInput, 10));
        }
      }
    });
  }

  private updateInputDisplay() {
    this.inputDisplay.setText(this.playerInput || '_');
  }

  private pickNextWorld(): WorldDef {
    const others = WORLDS.filter(w => w.id !== this.currentWorld?.id);
    return Phaser.Utils.Array.GetRandom(others) as WorldDef;
  }

  private nextQuestion() {
    if (this.roundsDone >= this.TOTAL_ROUNDS) { this.endBattle(); return; }
    this.playerInput = '';
    this.updateInputDisplay();
    this.feedbackText.setText('');
    this.locked = true; // lock during world transition

    const nextWorld = this.pickNextWorld();
    this.swapWorld(nextWorld, () => {
      this.locked = false;
      this.destroyChoiceButtons();

      const b = Phaser.Utils.Array.GetRandom([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) as number;
      const a = this.data2.table;
      this.question = { a, b };
      this.currentAnswer = a * b;
      this.questionText.setText(`${b} × ${a} = ?`);
      this.questionText.setAlpha(0).setScale(1.3);
      this.tweens.add({ targets: this.questionText, alpha: 1, scaleX: 1, scaleY: 1, duration: 200, ease: 'Back.out' });

      if (this.data2.difficulty === 'schildknaap') {
        this.createChoiceButtons(this.generateChoices(this.currentAnswer, a));
      }

      this.startTimer();
    });
  }

  private generateChoices(correct: number, table: number): number[] {
    const choices = new Set<number>([correct]);
    const candidates = [correct - 1, correct + 1, correct - table, correct + table,
      correct - 2, correct + 2, correct - table * 2, correct + table * 2];
    for (const c of candidates) {
      if (c > 0 && c !== correct) choices.add(c);
      if (choices.size === 4) break;
    }
    // Fill with random if needed
    while (choices.size < 4) choices.add(correct + Math.floor(Math.random() * 20) - 10);
    const arr = Array.from(choices).slice(0, 4);
    return arr.sort(() => Math.random() - 0.5);
  }

  private createChoiceButtons(choices: number[]) {
    const W = this.scale.width; const H = this.scale.height;
    // Float above the HUD panel, below the question text (~H*0.38)
    const btnW = Math.min(190, Math.round(W * 0.28));
    const btnH = 62;
    const gap = 14;
    const topY = Math.round(H * 0.52);

    // Panel background enclosing the 2×2 grid
    const panelW = 2 * btnW + gap + 36;
    const panelH = 2 * btnH + gap + 36;
    const panelX = W / 2 - panelW / 2;
    const panelBg = this.add.graphics().setDepth(14);
    panelBg.fillStyle(0x060318, 0.94);
    panelBg.fillRoundedRect(panelX, topY - 18, panelW, panelH, 18);
    panelBg.lineStyle(3, 0x7744cc, 1);
    panelBg.strokeRoundedRect(panelX, topY - 18, panelW, panelH, 18);

    this.choiceContainer = this.add.container(0, 0).setDepth(15);
    this.choiceContainer.add(panelBg);

    choices.forEach((val, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const cx = col === 0 ? W / 2 - btnW / 2 - gap / 2 : W / 2 + btnW / 2 + gap / 2;
      const cy = topY + row * (btnH + gap) + btnH / 2;

      const bg = this.add.graphics();
      const drawBtnBg = (hover: boolean) => {
        bg.clear();
        bg.fillStyle(hover ? 0x5a2fb8 : 0x2d1b69, 1);
        bg.fillRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 12);
        bg.lineStyle(2, 0xf5c842, 1);
        bg.strokeRoundedRect(-btnW / 2, -btnH / 2, btnW, btnH, 12);
      };
      drawBtnBg(false);

      const label = this.add.text(0, 2, `${val}`, {
        fontFamily: 'Cinzel, serif', fontSize: '32px', color: '#ffffff', fontStyle: 'bold',
      }).setOrigin(0.5);

      const hint = this.add.text(-btnW / 2 + 8, -btnH / 2 + 6, `${i + 1}`, {
        fontFamily: 'Cinzel, serif', fontSize: '13px', color: '#f5c842',
      });

      const btn = this.add.container(cx, cy, [bg, label, hint]);
      btn.setSize(btnW, btnH).setInteractive({ cursor: 'pointer' });
      btn.on('pointerover', () => drawBtnBg(true));
      btn.on('pointerout', () => drawBtnBg(false));
      btn.on('pointerdown', () => { this.selectChoice(i); });

      (btn as any).__choiceVal = val;
      this.choiceContainer!.add(btn);
    });
  }

  private selectChoice(index: number) {
    if (this.locked || !this.choiceContainer) return;
    // Skip non-button children (e.g. the panel bg Graphics)
    const btns = (this.choiceContainer.list as any[]).filter(b => '__choiceVal' in b);
    const btn = btns[index];
    if (!btn) return;
    this.submitAnswer(btn.__choiceVal as number);
  }

  private destroyChoiceButtons() {
    if (this.choiceContainer) {
      this.choiceContainer.destroy(true);
      this.choiceContainer = undefined;
    }
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
        if (this.timeLeft <= 3 && this.timeLeft > 0) playTimerUrgent();
        else if (this.timeLeft <= 6 && this.timeLeft > 3) playTimerTick();
        if (this.timeLeft <= 0) this.onTimeout();
      },
    });
  }

  private updateTimerBar() {
    const W = this.scale.width; const H = this.scale.height;
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
    playWrong();
    this.showFeedback(false, this.currentAnswer);
    this.enemyAttacks();
    this.knightHp = Math.max(0, this.knightHp - 20);
    this.time.delayedCall(1800, () => {
      this.redrawKnightHp();
      if (this.knightHp <= 0) { this.endBattle(); return; }
      this.nextQuestion();
    });
  }

  private submitAnswer(guess: number) {
    if (this.locked) return;
    this.locked = true;
    this.timerEvent?.remove();
    const correct = guess === this.currentAnswer;
    this.roundsDone++;

    if (correct) {
      this.totalCorrect++;
      this.correctStreak++;
      playCorrect();
      this.showFeedback(true);
      this.knightAttacks();
      const dmg = this.correctStreak >= 3 ? 15 : 10;
      this.enemyHp = Math.max(0, this.enemyHp - dmg);
      if (this.correctStreak >= 3) { this.showCombo(); playCombo(); }
      this.time.delayedCall(1600, () => {
        this.redrawEnemyHp();
        if (this.enemyHp <= 0) { this.endBattle(); return; }
        this.nextQuestion();
      });
    } else {
      this.totalWrong++;
      this.correctStreak = 0;
      playWrong();
      this.showFeedback(false, this.currentAnswer);
      this.enemyAttacks();
      this.knightHp = Math.max(0, this.knightHp - 20);
      this.time.delayedCall(1800, () => {
        this.redrawKnightHp();
        if (this.knightHp <= 0) { this.endBattle(); return; }
        this.nextQuestion();
      });
    }
  }

  private showFeedback(correct: boolean, showAnswer?: number) {
    const W = this.scale.width; const H = this.scale.height;
    const msg = correct ? '✓  Goed gedaan!' : `✗  Fout!   Antwoord: ${showAnswer}`;
    const bgFill = correct ? 0x0d3b1e : 0x3b0d0d;
    const borderColor = correct ? 0x27ae60 : 0xe74c3c;
    const textColor = correct ? '#2ecc71' : '#ff6666';

    const popup = this.add.container(W / 2, H - 185).setDepth(100);
    const bg = this.add.graphics();
    bg.fillStyle(bgFill, 0.95);
    bg.fillRoundedRect(-200, -26, 400, 52, 26);
    bg.lineStyle(3, borderColor, 1);
    bg.strokeRoundedRect(-200, -26, 400, 52, 26);
    const label = this.add.text(0, 0, msg, {
      fontFamily: 'Cinzel, serif', fontSize: '26px', color: textColor, fontStyle: 'bold',
    }).setOrigin(0.5);
    popup.add([bg, label]);
    popup.setAlpha(0).setScale(0.75);
    this.tweens.add({
      targets: popup, alpha: 1, scaleX: 1, scaleY: 1, duration: 180, ease: 'Back.out',
      onComplete: () => this.tweens.add({
        targets: popup, alpha: 0, y: H - 210, duration: 380, delay: 1000,
        onComplete: () => popup.destroy(),
      }),
    });
  }

  private showCombo() {
    const W = this.scale.width;
    const labels = ['', '', '', '🔥 x3 COMBO!', '⚡ x4 COMBO!', '💥 x5 COMBO!'];
    const label = labels[Math.min(this.correctStreak, labels.length - 1)] || `🌟 x${this.correctStreak} COMBO!`;
    const ct = this.add.text(W / 2, this.scale.height * 0.3, label, {
      fontFamily: 'Cinzel, serif', fontSize: '36px', color: '#ffcc00', fontStyle: 'bold',
      stroke: '#7a4400', strokeThickness: 5,
    }).setOrigin(0.5).setAlpha(0).setDepth(100);
    this.tweens.add({
      targets: ct, alpha: 1, y: this.scale.height * 0.25, duration: 300, ease: 'Back.out',
      onComplete: () => this.tweens.add({ targets: ct, alpha: 0, y: this.scale.height * 0.2, duration: 500, delay: 600, onComplete: () => ct.destroy() }),
    });
  }

  private knightAttacks() {
    this.knight.setAttacking(true);
    this.knight.flashSword(this);
    const kx = this.knightBaseX;
    const ky = this.knightBaseY;
    const cs = this.charScale;

    // 1. Windup: lean back
    this.tweens.add({
      targets: this.knight.container,
      x: kx - 20, angle: -8,
      duration: 90, ease: 'Power2.in',
      onComplete: () => {
        playAttack();
        // 2. Lunge forward
        this.tweens.add({
          targets: this.knight.container,
          x: kx + 160, angle: 14,
          scaleX: cs * 1.08, scaleY: cs * 1.08,
          duration: 120, ease: 'Power3.in',
          onComplete: () => {
            this.spawnSwordSlash(kx + 160, ky - 30);
            this.spawnSpellEffect(kx + 160, ky, this.enemyBaseX, this.enemyBaseY);
            this.cameras.main.shake(90, 0.006);
            // 3. Bounce back
            this.tweens.add({
              targets: this.knight.container,
              x: kx + 30, angle: 0,
              scaleX: cs, scaleY: cs,
              duration: 110, ease: 'Power2.out',
              onComplete: () => {
                // 4. Return
                this.tweens.add({
                  targets: this.knight.container,
                  x: kx, duration: 300, ease: 'Power1.out',
                  onComplete: () => this.knight.setAttacking(false),
                });
              },
            });
          },
        });
      },
    });
  }

  private enemyAttacks() {
    this.enemy.setReacting(true);
    playDragonRoar();
    this.cameras.main.shake(300, 0.008);

    this.tweens.add({
      targets: this.enemy.container, x: this.enemyBaseX - 120, duration: 200, ease: 'Power2.in',
      onComplete: () => {
        this.spawnFireEffect(this.enemyBaseX - 120, this.enemyBaseY);
        this.tweens.add({ targets: this.enemy.container, x: this.enemyBaseX, duration: 360, ease: 'Power2.out' });
        this.time.delayedCall(420, () => this.enemy.setReacting(false));
      },
    });

    const flash = this.add.rectangle(this.knightBaseX, this.knightBaseY, 120, 180, 0xff3333, 0.55).setDepth(8);
    this.tweens.add({ targets: flash, alpha: 0, duration: 500, onComplete: () => flash.destroy() });
  }

  private spawnSwordSlash(x: number, y: number) {
    const g = this.add.graphics().setDepth(20);
    // Multiple diagonal lines making a slash arc
    for (let i = -2; i <= 2; i++) {
      const alpha = 1 - Math.abs(i) * 0.18;
      g.lineStyle(4 - Math.abs(i), 0xffffff, alpha);
      g.lineBetween(x + i * 7 - 22, y - 32, x + i * 7 + 22, y + 32);
    }
    g.lineStyle(8, 0xf5c842, 0.65);
    g.lineBetween(x - 18, y - 28, x + 18, y + 28);
    this.tweens.add({ targets: g, alpha: 0, scaleX: 1.6, scaleY: 1.3, duration: 240, ease: 'Power2.out', onComplete: () => g.destroy() });
  }

  private spawnSpellEffect(fromX: number, fromY: number, toX: number, toY: number) {
    const proj = this.add.circle(fromX, fromY, 12, 0xf5c842).setDepth(15);
    const trail = this.add.particles(fromX, fromY, '__DEFAULT', {
      follow: proj, scale: { start: 0.7, end: 0 },
      alpha: { start: 0.9, end: 0 },
      tint: [0xf5c842, 0xffaa00, 0xffffff],
      lifespan: 280, frequency: 18,
    }).setDepth(14);
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
      const circle = this.add.circle(x, y, Phaser.Math.Between(4, 12), color).setDepth(15);
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
      const circle = this.add.circle(x, y, Phaser.Math.Between(3, 9), color).setDepth(15);
      this.tweens.add({
        targets: circle,
        x: x + Math.cos(angle) * speed, y: y + Math.sin(angle) * speed,
        alpha: 0, scaleX: 0, scaleY: 0,
        duration: Phaser.Math.Between(350, 650), ease: 'Power2.out',
        onComplete: () => circle.destroy(),
      });
    }
    const flash = this.add.circle(x, y, 38, 0xffffff, 0.65).setDepth(15);
    this.tweens.add({ targets: flash, alpha: 0, scaleX: 2.8, scaleY: 2.8, duration: 260, onComplete: () => flash.destroy() });
    const star = this.add.star(x, y, 6, 12, 28, 0xf5c842).setDepth(15);
    this.tweens.add({ targets: star, alpha: 0, scaleX: 3, scaleY: 3, angle: 90, duration: 420, onComplete: () => star.destroy() });
  }

  private drawHpBar(g: Phaser.GameObjects.Graphics, x: number, y: number, w: number, hp: number, color: number) {
    g.clear();
    g.fillStyle(0x2c1b50, 1); g.fillRoundedRect(x, y, w, 16, 8);
    if (hp > 0) { g.fillStyle(color, 1); g.fillRoundedRect(x + 1, y + 1, (w - 2) * hp / 100, 14, 7); }
    g.lineStyle(1, 0x8855cc, 0.7); g.strokeRoundedRect(x, y, w, 16, 8);
    const lbl = this.add.text(x + w / 2, y + 8, `${hp}%`, {
      fontFamily: 'Cinzel, serif', fontSize: '12px', color: '#ffffff',
    }).setOrigin(0.5).setDepth(this.hudDepth);
    this.time.delayedCall(50, () => lbl.destroy());
  }

  private redrawKnightHp() {
    const W = this.scale.width; const H = this.scale.height;
    const hpBarW = Math.min(220, Math.max(80, W / 2 - 230));
    this.drawHpBar(this.knightHpBar, 20, H - 160 + 26, hpBarW, this.knightHp, 0x27ae60);
  }

  private redrawEnemyHp() {
    const W = this.scale.width; const H = this.scale.height;
    const hpBarW = Math.min(220, Math.max(80, W / 2 - 230));
    this.drawHpBar(this.enemyHpBar, W - hpBarW - 20, H - 160 + 26, hpBarW, this.enemyHp, 0xc0392b);
  }

  private endBattle() {
    this.timerEvent?.remove();
    this.locked = true;
    const total = this.totalCorrect + this.totalWrong;
    const perfect = total > 0 && this.totalCorrect === total;
    recordResult(this.data2.table, perfect);

    const won = this.enemyHp <= 0 || (this.knightHp > 0 && this.roundsDone >= this.TOTAL_ROUNDS && this.totalCorrect > this.totalWrong);
    if (won) playVictory(); else playDefeat();

    this.cameras.main.fade(600, 0, 0, 0);
    this.time.delayedCall(600, () => {
      this.scene.start('ResultScene', {
        won, table: this.data2.table, difficulty: this.data2.difficulty,
        totalCorrect: this.totalCorrect, totalWrong: this.totalWrong,
        knightHp: this.knightHp, enemyHp: this.enemyHp,
      });
    });
  }
}
