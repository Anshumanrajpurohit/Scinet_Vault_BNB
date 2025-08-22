import React from 'react';
import { Link } from 'react-router-dom';
import { useAppData } from '../context/AppDataContext';

const Quests = () => {
  const { data } = useAppData();
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Research Quests</h1>
        <Link to="/quests/new" className="btn-primary text-white px-4 py-2 rounded-lg">Create Quest</Link>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.quests.map(q => (
          <Link key={q.id} to={`/quests/${q.id}`} className="bg-slate-900 border border-white/10 rounded-2xl p-4 hover:border-primary-300">
            <div className="text-sm text-gray-400">Reward: {q.reward || 'N/A'} • {q.status}</div>
            <h3 className="font-semibold mt-1">{q.title}</h3>
            <p className="text-gray-300 mt-1 line-clamp-2">{q.description}</p>
          </Link>
        ))}
        {data.quests.length === 0 && <p className="text-gray-400">No quests yet.</p>}
      </div>
    </div>
  );
};

export default Quests;
