import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppData } from '../context/AppDataContext';

const PeerReviews = () => {
  const { data, addReview } = useAppData();
  const [params] = useSearchParams();
  const researchId = params.get('research');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);

  const reviews = data.reviews.filter(r => !researchId || String(r.researchId) === String(researchId));

  const onSubmit = (e) => {
    e.preventDefault();
    if (!researchId) return alert('Open from a research to review it.');
    addReview({ researchId, title, content, rating, author: 'You' });
    setTitle(''); setContent(''); setRating(5);
  };

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold">Peer Reviews</h1>
      <div className="grid lg:grid-cols-2 gap-6 mt-4">
  <div className="glass-card border border-white/10 rounded-2xl p-4">
          <h3 className="font-semibold mb-2">Write a Review</h3>
          <form onSubmit={onSubmit} className="space-y-3">
            <input className="w-full px-3 py-2 rounded bg-transparent backdrop-blur border border-white/10" placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)} />
            <textarea className="w-full px-3 py-2 rounded bg-transparent backdrop-blur border border-white/10" rows={4} placeholder="Your review" value={content} onChange={(e)=>setContent(e.target.value)} />
            <div>
              <label className="block text-sm mb-1">Rating</label>
              <input type="number" min={1} max={5} className="w-24 px-3 py-2 rounded bg-transparent backdrop-blur border border-white/10" value={rating} onChange={(e)=>setRating(Number(e.target.value))} />
            </div>
            <button className="btn-primary text-white px-4 py-2 rounded-lg">Submit Review</button>
          </form>
        </div>
        <div className="space-y-3">
          {reviews.map(rv => (
            <div key={rv.id} className="glass-card border border-white/10 rounded-2xl p-4">
              <div className="text-sm text-gray-400">Rating: {rv.rating} • {rv.createdAt?.slice(0,10)}</div>
              <h4 className="font-semibold mt-1">{rv.title}</h4>
              <p className="text-gray-300 mt-1">{rv.content}</p>
            </div>
          ))}
          {reviews.length === 0 && <p className="text-gray-400">No reviews yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default PeerReviews;
