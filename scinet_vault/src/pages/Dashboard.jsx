import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  FileText, 
  Database, 
  Users, 
  TrendingUp, 
  Award, 
  Calendar,
  Search,
  Filter,
  Upload,
  Eye,
  Download,
  Share2
} from 'lucide-react';

const Dashboard = () => {
  const [selectedTab, setSelectedTab] = useState('overview');

  // Mock data
  const stats = [
    { label: 'Research Papers', value: '12', icon: FileText, color: 'bg-blue-500' },
    { label: 'Datasets', value: '8', icon: Database, color: 'bg-green-500' },
    { label: 'Collaborations', value: '24', icon: Users, color: 'bg-purple-500' },
    { label: 'Citations', value: '156', icon: TrendingUp, color: 'bg-orange-500' },
  ];

  const recentPapers = [
    {
      id: 1,
      title: 'Quantum Computing Applications in Cryptography',
      status: 'Published',
      date: '2025-08-20',
      views: 1250,
      downloads: 89,
      collaborators: 3,
    },
    {
      id: 2,
      title: 'Machine Learning for Climate Prediction Models',
      status: 'Under Review',
      date: '2025-08-18',
      views: 340,
      downloads: 23,
      collaborators: 5,
    },
    {
      id: 3,
      title: 'Blockchain Implementation in Healthcare Data',
      status: 'Draft',
      date: '2025-08-15',
      views: 45,
      downloads: 2,
      collaborators: 2,
    },
  ];

  const recentDatasets = [
    {
      id: 1,
      name: 'COVID-19 Genomic Sequences Dataset',
      size: '2.4 GB',
      downloads: 245,
      lastUpdated: '2025-08-19',
    },
    {
      id: 2,
      name: 'Climate Temperature Records 1950-2025',
      size: '890 MB',
      downloads: 123,
      lastUpdated: '2025-08-17',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Published': return 'bg-green-100 text-green-800';
      case 'Under Review': return 'bg-yellow-100 text-yellow-800';
      case 'Draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
  <div className="bg-transparent py-8 relative text-gray-100">
  {/* Background elements removed to let LightRays show through */}

      <div className="relative   mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-100 mb-2">
            Research Dashboard
          </h1>
          <p className="text-gray-300 text-lg">Welcome back! Here's an overview of your research activity.</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
                className="group glass-card rounded-3xl p-6 hover:shadow-xl transition-all duration-500 relative border border-white/10"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-100 mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              
              {/* Shimmer Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {['overview', 'papers', 'datasets'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm capitalize transition-colors duration-200 ${
                    selectedTab === tab
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
        </motion.div>

        {/* Content based on selected tab */}
        <motion.div
          key={selectedTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {selectedTab === 'overview' && (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Recent Papers */}
              <div className="glass-card rounded-2xl p-6 shadow-lg border border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-100">Recent Papers</h3>
                  <button className="text-primary-600 hover:text-primary-700 font-medium">
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {recentPapers.slice(0, 3).map((paper) => (
                    <div key={paper.id} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-100 mb-1">{paper.title}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <span className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {paper.date}
                            </span>
                            <span className="flex items-center">
                              <Eye className="h-4 w-4 mr-1" />
                              {paper.views}
                            </span>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(paper.status)}`}>
                          {paper.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Datasets */}
              <div className="glass-card rounded-2xl p-6 shadow-lg border border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-100">Recent Datasets</h3>
                  <button className="text-primary-600 hover:text-primary-700 font-medium">
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {recentDatasets.map((dataset) => (
                    <div key={dataset.id} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
                      <h4 className="font-semibold text-gray-100 mb-1">{dataset.name}</h4>
                      <div className="flex items-center justify-between text-sm text-gray-400">
                        <div className="flex items-center space-x-4">
                          <span>{dataset.size}</span>
                          <span className="flex items-center">
                            <Download className="h-4 w-4 mr-1" />
                            {dataset.downloads}
                          </span>
                        </div>
                        <span>{dataset.lastUpdated}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'papers' && (
            <div className="glass-card rounded-2xl p-6 shadow-lg border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-100">My Research Papers</h3>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search papers..."
                      className="pl-10 pr-4 py-2 border border-white/10 bg-transparent text-gray-100 rounded-lg backdrop-blur focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                    <Filter className="h-5 w-5" />
                    <span>Filter</span>
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                {recentPapers.map((paper) => (
                  <div key={paper.id} className="glass-card border border-white/10 rounded-xl p-6 hover:border-primary-300 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-100 mb-2">{paper.title}</h4>
                        <div className="flex items-center space-x-6 text-sm text-gray-400">
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {paper.date}
                          </span>
                          <span className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            {paper.views} views
                          </span>
                          <span className="flex items-center">
                            <Download className="h-4 w-4 mr-1" />
                            {paper.downloads} downloads
                          </span>
                          <span className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {paper.collaborators} collaborators
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(paper.status)}`}>
                          {paper.status}
                        </span>
                        <button className="p-2 text-gray-400 hover:text-gray-600">
                          <Share2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedTab === 'datasets' && (
            <div className="glass-card rounded-2xl p-6 shadow-lg border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-100">My Datasets</h3>
                <button className="bg-gradient-to-r from-primary-600 to-purple-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-shadow">
                  <Plus className="h-4 w-4 mr-2 inline" />
                  New Dataset
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {recentDatasets.map((dataset) => (
                  <div key={dataset.id} className="glass-card border border-white/10 rounded-xl p-6 hover:border-primary-300 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-100 mb-2">{dataset.name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>Size: {dataset.size}</span>
                          <span>{dataset.downloads} downloads</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">Updated: {dataset.lastUpdated}</p>
                      </div>
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
