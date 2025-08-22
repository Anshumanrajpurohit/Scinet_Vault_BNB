import React from 'react';
import { useParams } from 'react-router-dom';
import { useAppData } from '../context/AppDataContext';

const QuestDetail = () => {
  const { id } = useParams();
  const { data, updateQuest } = useAppData();
  const quest = data.quests.find(q => String(q.id) === String(id));
  if (!quest) return <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">Not found.</div>;
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold">{quest.title}</h1>
      <div className="text-sm text-gray-400">Reward: {quest.reward || 'N/A'} • {quest.status}</div>
      <p className="text-gray-300 mt-2">{quest.description}</p>
      <div className="mt-4 space-x-2">
        <button onClick={()=>updateQuest(quest.id, { status: 'open' })} className="btn-secondary text-white px-3 py-1 rounded">Mark Open</button>
        <button onClick={()=>updateQuest(quest.id, { status: 'in_review' })} className="btn-secondary text-white px-3 py-1 rounded">In Review</button>
        <button onClick={()=>updateQuest(quest.id, { status: 'paid' })} className="btn-primary text-white px-3 py-1 rounded">Mark Paid</button>
      </div>
    </div>
  );
};

export default QuestDetail;
