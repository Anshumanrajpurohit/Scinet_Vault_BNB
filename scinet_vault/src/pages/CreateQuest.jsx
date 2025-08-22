import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../context/AppDataContext';

const CreateQuest = () => {
  const { addQuest } = useAppData();
  const nav = useNavigate();
  const [title, setTitle] = useState('');
  const [reward, setReward] = useState('');
  const [description, setDescription] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    const id = addQuest({ title, reward, description });
    nav(`/quests/${id}`);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold">Create Quest</h1>
      <form onSubmit={onSubmit} className="mt-4 space-y-3 bg-slate-900 border border-white/10 rounded-2xl p-4">
        <input className="w-full px-3 py-2 rounded bg-black border border-white/10" placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)} />
        <input className="w-full px-3 py-2 rounded bg-black border border-white/10" placeholder="Reward (e.g., 1 BNB)" value={reward} onChange={(e)=>setReward(e.target.value)} />
        <textarea className="w-full px-3 py-2 rounded bg-black border border-white/10" rows={6} placeholder="Description" value={description} onChange={(e)=>setDescription(e.target.value)} />
        <button className="btn-primary text-white px-4 py-2 rounded-lg">Create</button>
      </form>
    </div>
  );
};

export default CreateQuest;
