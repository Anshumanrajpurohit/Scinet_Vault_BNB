import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppData } from '../context/AppDataContext';
import ReproScorePanel from '../components/ReproScorePanel';

const ResearchDetail = () => {
  const { id } = useParams();
  const { data } = useAppData();
  const research = data.researches.find(r => String(r.id) === String(id));
  if (!research) return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">Not found.</div>;

  const latest = research.versions?.[0];
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold">{research.title}</h1>
      <p className="text-gray-300 mt-2">{research.description}</p>

      <div className="mt-6 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-4">
            <h3 className="font-semibold mb-2">Latest Version</h3>
            <div className="text-sm text-gray-400">CID: {latest?.cid || '—'} • {latest?.createdAt?.slice(0,10)}</div>
            <div className="mt-3">
              <ReproScorePanel score={latest?.score || 0} diagnostics={latest?.diagnostics || []} />
            </div>
          </div>
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-4">
            <h3 className="font-semibold mb-2">Files</h3>
            <ul className="text-sm text-gray-300 list-disc list-inside">
              {latest?.manifest?.files?.map(f => <li key={f.name}>{f.name} <span className="text-gray-500">({f.size} bytes)</span></li>) || <li>No files listed.</li>}
            </ul>
          </div>
        </div>
        <div className="space-y-3">
          <Link className="btn-primary block text-center text-white px-4 py-2 rounded-lg" to={`/research/${id}/versions`}>View Version History</Link>
          <Link className="btn-secondary block text-center text-white px-4 py-2 rounded-lg" to={`/research/${id}/diff`}>Compare Versions</Link>
          <Link className="btn-secondary block text-center text-white px-4 py-2 rounded-lg" to={`/reviews?research=${id}`}>See Reviews</Link>
          {latest?.manifest?.files?.some(f=>/\.ipynb$/i.test(f.name)) && (
            <Link className="btn-secondary block text-center text-white px-4 py-2 rounded-lg" to={`/notebooks/${latest.cid}`}>Run Notebook</Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResearchDetail;
