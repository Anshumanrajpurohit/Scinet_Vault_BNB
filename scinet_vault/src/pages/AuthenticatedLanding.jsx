import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Rocket, Upload, Search, Users, Vote, Trophy, Zap } from 'lucide-react';
import { useAuth } from '../App';

const AuthenticatedLanding = () => {
  const { walletAddress } = useAuth();
  const navigate = useNavigate();

  const quickActions = [
    {
      icon: Upload,
      title: 'Upload Research',
      description: 'Share your latest findings',
      action: () => navigate('/upload'),
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Search,
      title: 'Explore Research',
      description: 'Discover new publications',
      action: () => navigate('/explore'),
      color: 'from-green-500 to-green-600',
    },
    {
      icon: Users,
      title: 'Join Collaboration',
      description: 'Connect with researchers',
      action: () => navigate('/profile'),
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: Vote,
      title: 'DAO Governance',
      description: 'Participate in decisions',
      action: () => navigate('/dao'),
      color: 'from-orange-500 to-orange-600',
    },
  ];

  const achievements = [
    { icon: Trophy, label: 'Verified Researcher', earned: true },
    { icon: Zap, label: 'Early Adopter', earned: true },
    { icon: Users, label: 'Collaborator', earned: false },
    { icon: Vote, label: 'Active Governance', earned: false },
  ];

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
  <div className="bg-transparent text-gray-100">
      {/* Welcome Hero */}
      <section className="relative overflow-hidden py-20">
        {/* Removed opaque gradient; rely on LightRays + glass cards */}
        <div className="relative   mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <Rocket className="h-16 w-16 mx-auto mb-4" />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-bold mb-4"
            >
              Welcome to SciNet Vault!
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl mb-6 text-purple-100"
            >
              Connected as: <span className="font-mono bg-white/20 px-3 py-1 rounded-lg">{formatAddress(walletAddress)}</span>
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg text-purple-100 mb-8 max-w-2xl mx-auto"
            >
              You're now part of the decentralized science revolution. Start exploring, 
              collaborating, and contributing to the future of research.
            </motion.p>
            
            <motion.button
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/dashboard')}
              className="glass-card border border-white/20 px-8 py-4 rounded-2xl text-lg font-semibold shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 mx-auto"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="h-5 w-5" />
            </motion.button>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-20">
  <div className="  mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">
              What would you like to do?
            </h2>
            <p className="text-xl text-gray-300">
              Choose from these popular actions to get started
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                onClick={action.action}
                className="glass-card rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group border border-white/10"
              >
                <div className={`bg-gradient-to-r ${action.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-100 mb-2">{action.title}</h3>
                <p className="text-gray-300 mb-4">{action.description}</p>
                <div className="flex items-center text-primary-600 font-semibold group-hover:text-purple-600 transition-colors duration-300">
                  <span>Get Started</span>
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
  <section className="py-20">
        <div className="  mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">
              Your Achievements
            </h2>
            <p className="text-xl text-gray-300">
              Track your progress in the SciNet Vault ecosystem
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`p-6 rounded-2xl text-center ${
                  achievement.earned 
                    ? 'glass-card border-2 border-primary-900/40' 
                    : 'glass-card border-2 border-gray-800'
                }`}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  achievement.earned 
                    ? 'bg-gradient-to-r from-primary-600 to-purple-500 text-white' 
                    : 'bg-gray-300 text-gray-500'
                }`}>
                  <achievement.icon className="h-8 w-8" />
                </div>
                <h3 className={`font-bold mb-2 ${
                  achievement.earned ? 'text-gray-100' : 'text-gray-500'
                }`}>
                  {achievement.label}
                </h3>
                <div className={`text-sm font-semibold ${
                  achievement.earned ? 'text-green-600' : 'text-gray-400'
                }`}>
                  {achievement.earned ? 'Earned' : 'Locked'}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Next Steps */}
  <section className="py-20 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Ready to Revolutionize Science?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl mb-8 text-gray-300"
          >
            Start by uploading your first research paper or exploring the vast library 
            of verified scientific publications.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/upload')}
              className="bg-gradient-to-r from-primary-600 to-purple-500 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              Upload Research
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/explore')}
              className="border-2 border-white/20 text-white px-8 py-4 rounded-2xl text-lg font-semibold backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
            >
              Explore Papers
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AuthenticatedLanding;
