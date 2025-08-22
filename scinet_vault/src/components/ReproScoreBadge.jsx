import React from 'react';

const colorByScore = (s) => {
  if (s >= 80) return 'bg-green-600/20 text-green-300 border-green-600/30';
  if (s >= 50) return 'bg-yellow-600/20 text-yellow-300 border-yellow-600/30';
  return 'bg-red-600/20 text-red-300 border-red-600/30';
};

const ReproScoreBadge = ({ score = 0 }) => (
  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm border ${colorByScore(score)}`}>
    Reproducibility: <strong className="ml-2">{score}</strong>
  </span>
);

export default ReproScoreBadge;
