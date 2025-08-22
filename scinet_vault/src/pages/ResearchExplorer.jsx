import React, { useState } from 'react';
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

const ResearchExplorer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Mock research data
  const researchData = [
    {
      id: 1,
      type: 'paper',
      title: 'Quantum Computing Applications in Cryptography',
      authors: ['Dr. Sarah Chen', 'Prof. Michael Johnson'],
      description: 'A comprehensive study on the applications of quantum computing in modern cryptographic systems and their implications for cybersecurity.',
      category: 'Computer Science',
      tags: ['quantum computing', 'cryptography', 'cybersecurity'],
      publishDate: '2025-08-20',
      views: 1250,
      downloads: 89,
      likes: 45,
      rating: 4.8,
      isVerified: true,
      isPremium: false,
    },
    {
      id: 2,
      type: 'dataset',
      title: 'COVID-19 Genomic Sequences Dataset',
      authors: ['Dr. Emily Rodriguez', 'Dr. James Park'],
      description: 'Complete genomic sequences of COVID-19 variants collected from 50+ countries between 2020-2025.',
      category: 'Biology',
      tags: ['covid-19', 'genomics', 'variants', 'epidemiology'],
      publishDate: '2025-08-18',
      views: 2340,
      downloads: 156,
      likes: 78,
      rating: 4.9,
      isVerified: true,
      isPremium: true,
    },
    {
      id: 3,
      type: 'paper',
      title: 'Machine Learning for Climate Prediction Models',
      authors: ['Prof. David Wilson', 'Dr. Anna Liu'],
      description: 'Novel approaches using deep learning and neural networks for improved accuracy in long-term climate predictions.',
      category: 'Environmental Science',
      tags: ['machine learning', 'climate', 'prediction', 'AI'],
      publishDate: '2025-08-15',
      views: 890,
      downloads: 67,
      likes: 34,
      rating: 4.6,
      isVerified: true,
      isPremium: false,
    },
    {
      id: 4,
      type: 'paper',
      title: 'Blockchain Implementation in Healthcare Data Management',
      authors: ['Dr. Alex Thompson'],
      description: 'Exploring the potential of blockchain technology for secure and interoperable healthcare data management systems.',
      category: 'Medicine',
      tags: ['blockchain', 'healthcare', 'data management', 'security'],
      publishDate: '2025-08-12',
      views: 567,
      downloads: 43,
      likes: 22,
      rating: 4.4,
      isVerified: false,
      isPremium: false,
    },
  ];

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

  const handleDownload = (id) => {
    console.log('Download research:', id);
  };

  const handleShare = (id) => {
    console.log('Share research:', id);
  };

  return (
  <div className="bg-gradient-to-br from-black via-slate-900 to-black py-8 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Research Explorer</h1>
          <p className="text-gray-600">Discover verified research papers and datasets from the global scientific community</p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-900 rounded-2xl p-6 shadow-lg mb-8 border border-white/10"
        >
          <div className="grid md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search research papers, datasets, authors..."
                  className="w-full pl-10 pr-4 py-3 border border-white/10 bg-black text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-white/10 bg-black text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                className="w-full px-4 py-3 border border-white/10 bg-black text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
              className="bg-slate-900 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
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
                  <h3 className="text-xl font-bold text-gray-100 mb-2 hover:text-primary-400 cursor-pointer">
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
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col space-y-2 ml-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDownload(item.id)}
                    className="bg-gradient-to-r from-primary-600 to-purple-500 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </motion.button>
                  
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
            <button className="bg-black text-primary-300 border-2 border-primary-900/40 px-8 py-3 rounded-xl font-semibold hover:bg-white/10 hover:text-white transition-all duration-300">
              Load More Research
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ResearchExplorer;
