import React from 'react';
import { useParams } from 'react-router-dom';
import { useAppData } from '../context/AppDataContext';
import VersionDiffViewer from '../components/VersionDiffViewer';

const VersionDiff = () => {
  const { id } = useParams();
  const { data } = useAppData();
  const research = data.researches.find(r => String(r.id) === String(id));
  const [a, b] = research?.versions?.slice(0, 2) || [];
  return (
    <div className="  mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold">Version Diff</h1>
      {a && b ? (
        <div className="mt-4">
          <VersionDiffViewer before={b.manifest} after={a.manifest} />
        </div>
      ) : (
        <p className="text-gray-300 mt-2">Need at least two versions to compare.</p>
      )}
    </div>
  );
};

export default VersionDiff;
