import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppData } from '../context/AppDataContext';
import ReproScorePanel from '../components/ReproScorePanel';
import { SupabaseService } from '../services/SupabaseService';
import { motion, AnimatePresence } from 'framer-motion';

const ResearchDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data } = useAppData();
  const [row, setRow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (SupabaseService.isConfigured()) {
          const rec = await SupabaseService.getResearchById(id);
          if (!cancelled) setRow(rec);
        } else {
          // fallback: find in local context
          const research = data.researches.find(r => String(r.id) === String(id));
          if (!cancelled) setRow(research || null);
        }
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Failed to load');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true };
  }, [id, data]);

  if (loading) return <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">Loading…</div>;
  if (!row) return <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">Not found.</div>;

  const authors = Array.isArray(row.authors) && row.authors.length ? row.authors : ['Unknown'];
  const tags = Array.isArray(row.tags) ? row.tags : [];
  const title = row.title || row?.title;
  const description = row.description || '';
  const publicUrl = row.public_url;

  // Full-screen overlay with detail and download
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/70 z-50 flex items-stretch justify-stretch p-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => navigate(-1)}
      >
        <motion.div
          className="w-full h-full glass-card border border-white/10 rounded-none overflow-hidden flex flex-col"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 30, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 z-10 px-4 md:px-6 py-3 md:py-4 border-b border-white/10 flex items-center justify-between bg-black/40 backdrop-blur supports-[backdrop-filter]:bg-black/30">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/explore')}
                className="px-3 py-1.5 rounded-md bg-white/10 text-gray-100 hover:bg-white/20"
              >
                Back
              </button>
              <h1 className="text-xl md:text-2xl font-bold text-gray-100 line-clamp-1">{title}</h1>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="px-3 py-1.5 rounded-md bg-white/10 text-gray-100 hover:bg-white/20"
            >
              Close
            </button>
          </div>
          <div className="p-4 md:p-6 space-y-4 overflow-y-auto flex-1">
            <div className="max-w-7xl mx-auto w-full">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <p className="text-gray-300 leading-relaxed">{description}</p>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tags.map(t => <span key={t} className="px-2 py-1 bg-slate-800 text-gray-300 text-xs rounded-md">{t}</span>)}
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  <div className="text-sm text-gray-400">
                    <div className="font-semibold text-gray-300 mb-1">Authors</div>
                    <div>{authors.join(', ')}</div>
                  </div>
                  {publicUrl && (
                    <a
                      href={publicUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-full px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-500"
                    >
                      Download PDF
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ResearchDetail;
