'use client';

import { useEffect, useRef } from 'react';

export default function GameCanvas() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    (async () => {
      const Phaser = (await import('phaser')).default;
      const { MenuScene } = await import('@/game/scenes/MenuScene');
      const { CharacterScene } = await import('@/game/scenes/CharacterScene');
      const { BattleScene } = await import('@/game/scenes/BattleScene');
      const { ResultScene } = await import('@/game/scenes/ResultScene');

      // Make all Text objects render at native screen density before boot
      (Phaser.GameObjects.Text as any).DEFAULT_RESOLUTION = window.devicePixelRatio || 2;

      // Canvas mode throws if arc() is called with a negative radius, which Phaser can
      // produce when fillRoundedRect/strokeRoundedRect receives a zero/negative dimension
      // (e.g. a progress bar at 0%, a timer bar at exactly 0s). Patch both methods to
      // skip the draw silently in those cases.
      const gp = Phaser.GameObjects.Graphics.prototype as any;
      (['fillRoundedRect', 'strokeRoundedRect'] as const).forEach(name => {
        const orig = gp[name];
        gp[name] = function(x: number, y: number, w: number, h: number, r?: number | object) {
          if (w <= 0 || h <= 0) return this;
          if (typeof r === 'number') r = Math.min(r, w / 2, h / 2);
          return orig.call(this, x, y, w, h, r);
        };
      });

      new Phaser.Game({
        type: Phaser.CANVAS,
        backgroundColor: '#1a0a2e',
        antialias: true,
        roundPixels: true,
        parent: 'game-container',
        scene: [MenuScene, CharacterScene, BattleScene, ResultScene],
        scale: {
          mode: Phaser.Scale.RESIZE,
          autoCenter: Phaser.Scale.CENTER_BOTH,
          width: window.innerWidth,
          height: window.innerHeight,
        },
      });
    })();
  }, []);

  return null;
}
