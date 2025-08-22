import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wallet, Menu, X, Beaker, Home, Upload, Search, User, Vote } from 'lucide-react';
import { useAuth } from '../App';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isConnected, walletAddress, isLoading, connectWallet, disconnectWallet } = useAuth();
  const navigate = useNavigate();

  const handleWalletConnect = async () => {
    if (!isConnected) {
      await connectWallet();
      // Redirect to welcome page after successful connection
      navigate('/welcome');
    } else {
      disconnectWallet();
      navigate('/');
    }
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const navigationItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home, authRequired: true },
    { name: 'Upload', path: '/upload', icon: Upload, authRequired: true },
    { name: 'Explore', path: '/explore', icon: Search, authRequired: true },
    { name: 'Profile', path: '/profile', icon: User, authRequired: true },
    { name: 'DAO', path: '/dao', icon: Vote, authRequired: true },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="glass-nav bg-white/80 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50 shadow-glass"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={isConnected ? "/dashboard" : "/"} className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="bg-gradient-to-br from-primary-600 to-purple-500 p-2.5 rounded-2xl shadow-lg"
            >
              <Beaker className="h-6 w-6 text-white" />
            </motion.div>
            <span className="text-xl font-bold text-gradient">
              SciNet Vault
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {isConnected && navigationItems.map((item) => (
              <motion.div key={item.name} whileHover={{ y: -2 }}>
                <Link
                  to={item.path}
                  className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-all duration-300 px-3 py-2 rounded-xl hover:bg-white/50 group"
                >
                  <item.icon className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Wallet Connection Button */}
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleWalletConnect}
              disabled={isLoading}
              className="btn-primary text-white px-6 py-2.5 rounded-2xl font-semibold shadow-lg hover:shadow-primary transition-all duration-400 flex items-center space-x-2 relative overflow-hidden"
            >
              <Wallet className="h-4 w-4" />
              <span>
                {isLoading ? 'Connecting...' : isConnected ? formatAddress(walletAddress) : 'Connect Wallet'}
              </span>
            </motion.button>

            {/* Mobile menu button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-xl text-gray-400 hover:text-gray-500 hover:bg-white/50 transition-all duration-200"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/20 pt-4 pb-4"
          >
            <div className="space-y-2">
              {isConnected && navigationItems.map((item) => (
                <motion.div key={item.name} whileHover={{ x: 5 }}>
                  <Link
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-3 text-gray-600 hover:text-primary-600 transition-all duration-300 py-3 px-4 rounded-xl hover:bg-white/50 group"
                  >
                    <item.icon className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
