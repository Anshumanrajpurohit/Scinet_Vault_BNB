import React from 'react';

const Beam = ({ className = '', style = {} }) => (
  <div
    className={`absolute rounded-full blur-3xl opacity-60 ${className}`}
    style={style}
  />
);

const BackgroundBeams = () => {
  // Animated gradient blobs drifting subtly
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <Beam
        className="w-[60vw] h-[60vw]"
        style={{
          top: '-10%', left: '-15%',
          background: 'radial-gradient(closest-side, rgba(168,85,247,0.35), transparent 70%)',
          animation: 'magic-float 36s ease-in-out infinite',
        }}
      />
      <Beam
        className="w-[50vw] h-[50vw]"
        style={{
          bottom: '-20%', right: '-10%',
          background: 'radial-gradient(closest-side, rgba(59,130,246,0.30), transparent 70%)',
          animation: 'magic-float 40s ease-in-out infinite',
          animationDelay: '6s',
        }}
      />
      <Beam
        className="w-[40vw] h-[40vw]"
        style={{
          top: '20%', right: '5%',
          background: 'radial-gradient(closest-side, rgba(236,72,153,0.25), transparent 70%)',
          animation: 'magic-float 32s ease-in-out infinite',
          animationDelay: '12s',
        }}
      />
      <Beam
        className="w-[45vw] h-[45vw]"
        style={{
          bottom: '5%', left: '20%',
          background: 'radial-gradient(closest-side, rgba(34,197,94,0.22), transparent 70%)',
          animation: 'magic-float 38s ease-in-out infinite',
          animationDelay: '18s',
        }}
      />
    </div>
  );
};

export default BackgroundBeams;
