import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppData } from '../context/AppDataContext';
import { Search } from 'lucide-react';

const Quests = () => {
  const { data } = useAppData();

  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all'); // all | open | in_review | paid
  const [sortBy, setSortBy] = useState('newest'); // newest | oldest | reward-desc | reward-asc

  const parseReward = (r) => {
    if (!r) return 0;
    const num = parseFloat(String(r).replace(/[^0-9.]/g, ''));
    return isNaN(num) ? 0 : num;
  };

  const filtered = useMemo(() => {
    let list = [...data.quests];
    // search
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((x) =>
        String(x.title || '').toLowerCase().includes(q) ||
        String(x.description || '').toLowerCase().includes(q) ||
        String(x.reward || '').toLowerCase().includes(q)
      );
    }
    // status filter
    if (status !== 'all') {
      list = list.filter((x) => x.status === status);
    }
    // sort
    list.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'reward-desc') return parseReward(b.reward) - parseReward(a.reward);
      if (sortBy === 'reward-asc') return parseReward(a.reward) - parseReward(b.reward);
      return 0;
    });
    return list;
  }, [data.quests, query, status, sortBy]);

  const stats = useMemo(() => {
    const total = data.quests.length;
    const open = data.quests.filter((q) => q.status === 'open').length;
    const inReview = data.quests.filter((q) => q.status === 'in_review').length;
    const paid = data.quests.filter((q) => q.status === 'paid').length;
    return { total, open, inReview, paid };
  }, [data.quests]);

  const statusBadge = (st) => {
    switch (st) {
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'in_review':
        return 'bg-yellow-100 text-yellow-800';
      case 'paid':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header + CTA */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold">Research Quests</h1>
        <Link to="/quests/new" className=" text-white px-4 py-2 rounded-lg border-2 border-amber-100 bg-blue-300">Create Quest</Link>
      </div>

      {/* Stats and quick filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="glass-card rounded-xl p-4 border border-white/10 text-center">
          <div className="text-sm text-gray-400">Total</div>
          <div className="text-2xl font-bold">{stats.total}</div>
        </div>
        <button onClick={() => setStatus('open')} className={`glass-card rounded-xl p-4 border border-white/10 text-center ${status==='open' ? 'ring-2 ring-primary-500' : ''}`}>
          <div className="text-sm text-gray-400">Open</div>
          <div className="text-2xl font-bold">{stats.open}</div>
        </button>
        <button onClick={() => setStatus('in_review')} className={`glass-card rounded-xl p-4 border border-white/10 text-center ${status==='in_review' ? 'ring-2 ring-primary-500' : ''}`}>
          <div className="text-sm text-gray-400">In Review</div>
          <div className="text-2xl font-bold">{stats.inReview}</div>
        </button>
        <button onClick={() => setStatus('paid')} className={`glass-card rounded-xl p-4 border border-white/10 text-center ${status==='paid' ? 'ring-2 ring-primary-500' : ''}`}>
          <div className="text-sm text-gray-400">Paid</div>
          <div className="text-2xl font-bold">{stats.paid}</div>
        </button>
      </div>

      {/* Filters bar */}
      <div className="glass-card border border-white/10 rounded-2xl p-4 mb-6">
        <div className="grid gap-3 md:grid-cols-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search quests..."
              className="w-full pl-10 pr-3 py-2 rounded bg-transparent backdrop-blur border border-white/10"
            />
          </div>

          {/* Status select */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 rounded bg-transparent backdrop-blur border border-white/10"
          >
            <option value="all">All statuses</option>
            <option value="open">Open</option>
            <option value="in_review">In Review</option>
            <option value="paid">Paid</option>
          </select>

          {/* Sort select */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2 rounded bg-transparent backdrop-blur border border-white/10"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="reward-desc">Reward: High to Low</option>
            <option value="reward-asc">Reward: Low to High</option>
          </select>
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="glass-card border border-white/10 rounded-2xl p-6 text-center text-gray-400">No quests match your filters.</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((q) => (
            <Link key={q.id} to={`/quests/${q.id}`} className="group glass-card border border-white/10 rounded-2xl p-4 hover:border-primary-300 transition-all">
              <div className="flex items-start justify-between">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusBadge(q.status)}`}>{q.status.replace('_',' ')}</span>
                <span className="px-2 py-1 rounded-lg text-xs font-semibold bg-primary-100 text-primary-700">{q.reward || 'N/A'}</span>
              </div>
              <h3 className="font-semibold mt-2 text-gray-100 group-hover:text-white">{q.title}</h3>
              <p className="text-gray-300 mt-1 line-clamp-2">{q.description}</p>
              <div className="mt-3 text-xs text-gray-400">{q.createdAt ? new Date(q.createdAt).toLocaleString() : ''}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Quests;
