import React from 'react';

const MagicBackground = () => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="magic-beam" style={{
        top: '-10%', left: '-10%',
        background: 'radial-gradient(closest-side, rgba(168,85,247,0.35), transparent 70%)',
        animationDelay: '0s', animationDuration: '36s'
      }} />
      <div className="magic-beam" style={{
        bottom: '-20%', right: '-15%',
        background: 'radial-gradient(closest-side, rgba(59,130,246,0.35), transparent 70%)',
        animationDelay: '6s', animationDuration: '40s'
      }} />
      <div className="magic-beam" style={{
        top: '20%', right: '10%',
        background: 'radial-gradient(closest-side, rgba(236,72,153,0.25), transparent 70%)',
        animationDelay: '12s', animationDuration: '32s'
      }} />
      <div className="magic-beam" style={{
        bottom: '5%', left: '25%',
        background: 'radial-gradient(closest-side, rgba(34,197,94,0.25), transparent 70%)',
        animationDelay: '18s', animationDuration: '38s'
      }} />
    </div>
  );
};

export default MagicBackground;
