import React from 'react';
import { useParams } from 'react-router-dom';
import { useAppData } from '../context/AppDataContext';

const VersionHistory = () => {
  const { id } = useParams();
  const { data } = useAppData();
  const research = data.researches.find(r => String(r.id) === String(id));
  const versions = research?.versions || [];
  return (
    <div className="  mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold">Version History</h1>
      <ul className="mt-4 space-y-3">
        {versions.map(v => (
          <li key={v.id} className="glass-card border border-white/10 rounded-xl p-4">
            <div className="text-sm text-gray-400">{v.createdAt?.slice(0,10)} • CID: {v.cid}</div>
            <div className="text-sm text-gray-300 mt-1">Score: {v.score}</div>
          </li>
        ))}
        {versions.length === 0 && <li>No versions yet.</li>}
      </ul>
    </div>
  );
};

export default VersionHistory;
