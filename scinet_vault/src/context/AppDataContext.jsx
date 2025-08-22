import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AppDataContext = createContext(null);

const STORAGE_KEY = 'scinet_vault_app_data_v1';

const initialState = {
  researches: [], // [{id, title, type, description, category, tags[], authors[], isVerified, createdAt, versions: [{id, cid, manifest, score, diagnostics, createdAt}]}]
  reviews: [],    // [{id, researchId, title, content, rating, author, createdAt}]
  quests: [],     // [{id, title, reward, description, status, createdAt}]
};

const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : initialState;
  } catch {
    return initialState;
  }
};

export const AppDataProvider = ({ children }) => {
  const [data, setData] = useState(load());

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
  }, [data]);

  const addResearch = (research) => {
    const id = crypto.randomUUID?.() || String(Date.now());
    setData((d) => ({ ...d, researches: [{ ...research, id, createdAt: new Date().toISOString(), versions: research.versions || [] }, ...d.researches] }));
    return id;
  };

  const addVersion = (researchId, version) => {
    setData((d) => ({
      ...d,
      researches: d.researches.map((r) => r.id === researchId ? {
        ...r,
        versions: [{ id: crypto.randomUUID?.() || String(Date.now()), createdAt: new Date().toISOString(), ...version }, ...r.versions]
      } : r),
    }));
  };

  const addReview = (review) => {
    const id = crypto.randomUUID?.() || String(Date.now());
    setData((d) => ({ ...d, reviews: [{ id, createdAt: new Date().toISOString(), ...review }, ...d.reviews] }));
    return id;
  };

  const addQuest = (quest) => {
    const id = crypto.randomUUID?.() || String(Date.now());
    setData((d) => ({ ...d, quests: [{ id, status: 'open', createdAt: new Date().toISOString(), ...quest }, ...d.quests] }));
    return id;
  };

  const updateQuest = (id, updates) => {
    setData((d) => ({
      ...d,
      quests: d.quests.map((q) => q.id === id ? { ...q, ...updates } : q),
    }));
  };

  const value = useMemo(() => ({
    data,
    addResearch,
    addVersion,
    addReview,
    addQuest,
    updateQuest,
  }), [data]);

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
};

export const useAppData = () => {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider');
  return ctx;
};
