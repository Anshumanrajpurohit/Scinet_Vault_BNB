import React from 'react';

const ReproScorePanel = ({ score = 0, diagnostics = [] }) => {
  return (
    <div className="rounded-2xl border border-white/10 p-4 bg-white/5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Reproducibility Analysis</h3>
        <span className="text-2xl font-bold">{score}</span>
      </div>
      <ul className="mt-3 list-disc list-inside text-sm text-gray-300">
        {diagnostics.length === 0 ? (
          <li>No diagnostics yet.</li>
        ) : diagnostics.map((d, i) => <li key={i}>{d}</li>)}
      </ul>
    </div>
  );
};

export default ReproScorePanel;
