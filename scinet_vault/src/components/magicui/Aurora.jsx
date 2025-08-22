import React from 'react';

const Aurora = () => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[140%] h-96 opacity-30"
           style={{
             background: 'conic-gradient(from 180deg at 50% 50%, rgba(168,85,247,0.6), rgba(59,130,246,0.6), rgba(236,72,153,0.6), rgba(168,85,247,0.6))',
             filter: 'blur(60px)',
             maskImage: 'radial-gradient(closest-side, rgba(255,255,255,0.8), transparent)',
             WebkitMaskImage: 'radial-gradient(closest-side, rgba(255,255,255,0.8), transparent)'
           }} />
    </div>
  );
};

export default Aurora;
