'use client';

import dynamic from 'next/dynamic';

const GameCanvas = dynamic(() => import('@/components/GameCanvas'), { ssr: false });

export default function Home() {
  return (
    <>
      {/* Shown only on touch devices in portrait orientation */}
      <div className="rotate-hint" aria-hidden="true">
        <svg className="rotate-phone" viewBox="0 0 64 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="2" width="56" height="96" rx="10" stroke="#f5c842" strokeWidth="3" fill="#2d1b69"/>
          <rect x="10" y="14" width="44" height="64" rx="4" fill="#1a0a2e" stroke="#4a2890" strokeWidth="1.5"/>
          <circle cx="32" cy="88" r="4.5" fill="#f5c842" opacity="0.5"/>
          {/* Sword on screen */}
          <line x1="32" y1="24" x2="32" y2="66" stroke="#f5c842" strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="22" y1="43" x2="42" y2="43" stroke="#f5c842" strokeWidth="2" strokeLinecap="round"/>
          <ellipse cx="32" cy="68" rx="4" ry="3" fill="#f5c842"/>
        </svg>
        <p className="rotate-title">Draai je scherm</p>
        <p className="rotate-sub">Tafeltjes Quest werkt horizontaal</p>
      </div>
      <div id="game-container">
        <GameCanvas />
      </div>
    </>
  );
}
