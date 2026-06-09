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

      new Phaser.Game({
        type: Phaser.AUTO,
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
