import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Heart, 
  Share2, 
  Calendar,
  User,
  Tag,
  FileText,
  Database,
  ExternalLink,
  Star
} from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { SupabaseService } from '../services/SupabaseService';
import ReproScoreBadge from '../components/ReproScoreBadge';
import { useNavigate } from 'react-router-dom';

const ResearchExplorer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const { data } = useAppData();
  const navigate = useNavigate();
  const [dbItems, setDbItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (SupabaseService.isConfigured()) {
          const rows = await SupabaseService.listResearch({ limit: 200 });
          if (!cancelled) setDbItems(rows);
        } else {
          if (!cancelled) setError('Storage not configured');
        }
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Failed to load');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true };
  }, []);

  // Source only from DB (Supabase)
  const researchData = useMemo(() => dbItems.map(row => ({
    id: row.id,
    type: row.type || 'paper',
    title: row.title,
    authors: Array.isArray(row.authors) && row.authors.length ? row.authors : ['Unknown'],
    description: row.description || '',
    category: row.category || 'Other',
    tags: Array.isArray(row.tags) ? row.tags : [],
    publishDate: (row.created_at || new Date().toISOString()).slice(0,10),
    views: row.views || 0,
    downloads: row.downloads || 0,
    likes: row.likes || 0,
    rating: 4.5,
    isVerified: !!row.is_verified,
    isPremium: false,
    publicUrl: row.public_url,
  })), [dbItems]);

  const categories = [
    'all', 'Computer Science', 'Biology', 'Chemistry', 'Physics', 
    'Mathematics', 'Medicine', 'Engineering', 'Environmental Science'
  ];

  const filteredResearch = researchData.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesType = selectedType === 'all' || item.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const sortedResearch = [...filteredResearch].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.publishDate) - new Date(a.publishDate);
      case 'oldest':
        return new Date(a.publishDate) - new Date(b.publishDate);
      case 'popular':
        return b.views - a.views;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const handleLike = (id) => {
    console.log('Liked research:', id);
  };

  // No download in list view per request

  const handleShare = (id) => {
    console.log('Share research:', id);
  };

  return (
              <div className="py-8 text-gray-100 bg-transparent">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Research Explorer</h1>
          <p className="text-white">Discover verified research papers and datasets from the global scientific community</p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-6 shadow-lg mb-8 border border-white/10"
        >
          <div className="grid md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                              type="text"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              placeholder="Search research papers, datasets, authors..."
                              className="w-full pl-10 pr-4 py-3 border border-white/10 bg-transparent backdrop-blur text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full px-4 py-3 border border-white/10 bg-transparent backdrop-blur text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                            className="w-full px-4 py-3 border border-white/10 bg-transparent backdrop-blur text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="paper">Papers</option>
                <option value="dataset">Datasets</option>
              </select>
            </div>
          </div>

          {/* Sort Options */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
            <div className="text-sm text-gray-500">
              {sortedResearch.length} results found
            </div>
          </div>
        </motion.div>

        {/* Research Grid */}
        <div className="space-y-6">
          {sortedResearch.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="glass-card rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1" onClick={() => navigate(`/research/${item.id}`)}>
                  {/* Header */}
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`p-2 rounded-lg ${
                      item.type === 'paper' ? 'bg-blue-100' : 'bg-green-100'
                    }`}>
                      {item.type === 'paper' ? (
                        <FileText className="h-5 w-5 text-blue-600" />
                      ) : (
                        <Database className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.type === 'paper' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {item.type}
                      </span>
                      
                      {item.isVerified && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center">
                          <Star className="h-3 w-3 mr-1" />
                          Verified
                        </span>
                      )}
                      
                      {item.isPremium && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          Premium
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title and Authors */}
                  <h3 onClick={()=>navigate(`/research/${item.id}`)} className="text-xl font-bold text-gray-100 mb-2 hover:text-primary-400 cursor-pointer">
                    {item.title}
                  </h3>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      <span>{item.authors.join(', ')}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{item.publishDate}</span>
                    </div>
                    <div className="flex items-center">
                      <Tag className="h-4 w-4 mr-1" />
                      <span>{item.category}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 mb-4 line-clamp-2">{item.description}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-slate-800 text-gray-300 text-xs rounded-md hover:bg-slate-700 cursor-pointer"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center space-x-6 text-sm text-gray-400">
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      <span>{item.views} views</span>
                    </div>
                    <div className="flex items-center">
                      <Download className="h-4 w-4 mr-1" />
                      <span>{item.downloads} downloads</span>
                    </div>
                    <div className="flex items-center">
                      <Heart className="h-4 w-4 mr-1" />
                      <span>{item.likes} likes</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1 text-yellow-500 fill-current" />
                      <span>{item.rating}</span>
                    </div>
                    {typeof item.latestScore === 'number' && (
                      <ReproScoreBadge score={item.latestScore} />
                    )}
                  </div>
                </div>

                {/* Actions (no Download in list) */}
                <div className="flex flex-col space-y-2 ml-6">
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleLike(item.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Heart className="h-4 w-4" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleShare(item.id)}
                      className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                    >
                      <Share2 className="h-4 w-4" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 text-gray-400 hover:text-green-500 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Load More */}
        {sortedResearch.length >= 4 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-12"
          >
            <button className="text-xl px-10 py-4 border-none outline-none rounded-md cursor-pointer uppercase bg-gray-900 text-gray-100 font-bold transition-all duration-600 shadow-[0px_0px_60px_#1f4c65] scale-100 active:scale-95 hover:bg-gradient-to-r hover:from-[rgba(2,29,78,0.681)] hover:to-[rgba(31,215,232,0.873)] hover:text-[#040426] transform origin-center">
              Load More Research
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ResearchExplorer;
