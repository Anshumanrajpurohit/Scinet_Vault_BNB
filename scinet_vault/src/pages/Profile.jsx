import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Award, 
  FileText, 
  Database, 
  Users, 
  Calendar,
  Edit,
  Copy,
  ExternalLink,
  Trophy,
  Star,
  GitBranch,
  Zap,
  Shield,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../App';

const Profile = () => {
  const { walletAddress } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock user data
  const userData = {
    name: 'Dr. Sarah Chen',
    title: 'Senior Research Scientist',
    institution: 'MIT Computer Science Lab',
    joinDate: '2024-12-15',
    bio: 'Passionate researcher focusing on quantum computing applications in cryptography and cybersecurity. Committed to open science and collaborative research.',
    researchInterests: ['Quantum Computing', 'Cryptography', 'Cybersecurity', 'Blockchain'],
    stats: {
      papers: 12,
      datasets: 8,
      citations: 156,
      collaborations: 24,
      reputation: 4.8,
    },
    achievements: [
      { id: 1, name: 'Verified Researcher', icon: Shield, color: 'text-blue-500', earned: true },
      { id: 2, name: 'Top Contributor', icon: Trophy, color: 'text-yellow-500', earned: true },
      { id: 3, name: 'Collaboration Master', icon: Users, color: 'text-green-500', earned: true },
      { id: 4, name: 'Data Pioneer', icon: Database, color: 'text-purple-500', earned: false },
      { id: 5, name: 'Innovation Leader', icon: Zap, color: 'text-orange-500', earned: false },
      { id: 6, name: 'Community Builder', icon: GitBranch, color: 'text-pink-500', earned: false },
    ],
    recentActivity: [
      { type: 'paper', title: 'Quantum Computing Applications in Cryptography', date: '2025-08-20' },
      { type: 'collaboration', title: 'Joined AI Ethics Research Group', date: '2025-08-18' },
      { type: 'dataset', title: 'Published Quantum Algorithm Dataset', date: '2025-08-15' },
    ],
    publications: [
      {
        id: 1,
        title: 'Quantum Computing Applications in Cryptography',
        type: 'paper',
        date: '2025-08-20',
        citations: 45,
        downloads: 289,
        status: 'published'
      },
      {
        id: 2,
        title: 'Blockchain Security Protocols Dataset',
        type: 'dataset',
        date: '2025-08-15',
        citations: 23,
        downloads: 156,
        status: 'published'
      },
    ]
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'paper': return FileText;
      case 'dataset': return Database;
      case 'collaboration': return Users;
      default: return FileText;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-lg mb-8"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {userData.name.split(' ').map(n => n[0]).join('')}
            </div>

            {/* Basic Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{userData.name}</h1>
                <div className="flex items-center space-x-1">
                  <Shield className="h-5 w-5 text-blue-500" />
                  <span className="text-sm text-blue-600 font-medium">Verified</span>
                </div>
              </div>
              
              <p className="text-lg text-gray-600 mb-1">{userData.title}</p>
              <p className="text-gray-500 mb-3">{userData.institution}</p>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Joined {userData.joinDate}</span>
                </div>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  <span>Wallet: {formatAddress(walletAddress)}</span>
                  <button
                    onClick={() => copyToClipboard(walletAddress)}
                    className="ml-1 text-gray-400 hover:text-gray-600"
                  >
                    <Copy className="h-3 w-3" />
                  </button>
                </div>
              </div>

              <p className="text-gray-600 max-w-2xl">{userData.bio}</p>
            </div>

            {/* Actions */}
            <div className="flex flex-col space-y-2">
              <button className="bg-gradient-to-r from-primary-600 to-purple-500 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-300 flex items-center space-x-2">
                <Edit className="h-4 w-4" />
                <span>Edit Profile</span>
              </button>
              <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-all duration-300 flex items-center space-x-2">
                <ExternalLink className="h-4 w-4" />
                <span>Share Profile</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
        >
          <div className="bg-white rounded-xl p-4 shadow-lg text-center">
            <FileText className="h-6 w-6 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{userData.stats.papers}</div>
            <div className="text-sm text-gray-600">Papers</div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-lg text-center">
            <Database className="h-6 w-6 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{userData.stats.datasets}</div>
            <div className="text-sm text-gray-600">Datasets</div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-lg text-center">
            <TrendingUp className="h-6 w-6 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{userData.stats.citations}</div>
            <div className="text-sm text-gray-600">Citations</div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-lg text-center">
            <Users className="h-6 w-6 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{userData.stats.collaborations}</div>
            <div className="text-sm text-gray-600">Collaborations</div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-lg text-center">
            <Star className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{userData.stats.reputation}</div>
            <div className="text-sm text-gray-600">Reputation</div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {['overview', 'publications', 'achievements', 'activity'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm capitalize transition-colors duration-200 ${
                    activeTab === tab
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

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Research Interests */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Research Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {userData.researchInterests.map((interest) => (
                    <span
                      key={interest}
                      className="px-3 py-1 bg-primary-100 text-primary-700 rounded-lg text-sm font-medium"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {userData.recentActivity.map((activity, index) => {
                    const Icon = getActivityIcon(activity.type);
                    return (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <Icon className="h-4 w-4 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{activity.title}</p>
                          <p className="text-sm text-gray-500">{activity.date}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'publications' && (
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Publications</h3>
              <div className="space-y-6">
                {userData.publications.map((pub) => (
                  <div key={pub.id} className="border-b border-gray-200 last:border-b-0 pb-6 last:pb-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            pub.type === 'paper' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {pub.type}
                          </span>
                          <span className="text-sm text-gray-500">{pub.date}</span>
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">{pub.title}</h4>
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <span>{pub.citations} citations</span>
                          <span>{pub.downloads} downloads</span>
                          <span className="capitalize">{pub.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Achievements & Badges</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userData.achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-6 rounded-xl border-2 text-center transition-all duration-300 ${
                      achievement.earned
                        ? 'border-green-200 bg-green-50'
                        : 'border-gray-200 bg-gray-50 opacity-60'
                    }`}
                  >
                    <achievement.icon className={`h-12 w-12 mx-auto mb-3 ${achievement.color}`} />
                    <h4 className="font-bold text-gray-900 mb-2">{achievement.name}</h4>
                    <div className={`text-sm font-medium ${
                      achievement.earned ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {achievement.earned ? 'Earned' : 'Locked'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Activity Timeline</h3>
              <div className="space-y-6">
                {userData.recentActivity.map((activity, index) => {
                  const Icon = getActivityIcon(activity.type);
                  return (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="p-3 bg-primary-100 rounded-full">
                        <Icon className="h-5 w-5 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{activity.title}</h4>
                        <p className="text-gray-600 mt-1">
                          {activity.type === 'paper' && 'Published a new research paper'}
                          {activity.type === 'dataset' && 'Shared a new dataset'}
                          {activity.type === 'collaboration' && 'Started a new collaboration'}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">{activity.date}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
