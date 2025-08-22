import React from 'react';

const VersionDiffViewer = ({ before, after }) => {
  return (
    <div className="rounded-2xl border border-white/10 p-4 bg-white/5">
      <h3 className="text-lg font-semibold mb-2">Diff Viewer</h3>
      <pre className="text-xs whitespace-pre-wrap text-gray-300">
        {JSON.stringify({ before, after }, null, 2)}
      </pre>
    </div>
  );
};

export default VersionDiffViewer;
