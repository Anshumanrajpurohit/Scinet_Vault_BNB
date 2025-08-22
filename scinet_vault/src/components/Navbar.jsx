import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wallet, Menu, X, Home, Upload, User, Vote, MessageSquare, Trophy, Search } from 'lucide-react';
import { useAuth } from '../App';
import logo from '../assets/logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isConnected, walletAddress, isLoading, connectWallet, disconnectWallet } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
  { name: 'Reviews', path: '/reviews', icon: MessageSquare, authRequired: true },
  { name: 'Quests', path: '/quests', icon: Trophy, authRequired: true },
    { name: 'Profile', path: '/profile', icon: User, authRequired: true },
    { name: 'DAO', path: '/dao', icon: Vote, authRequired: true },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
  className="font-sans bg-black/30 backdrop-blur-md border-b border-white/10 fixed top-0 left-0 w-full z-50 shadow-glass"
    >
      <div className="mx-auto px-8 max-sm:px-6">
        <div className="flex justify-between items-center py-4">
          {/* Brand */}
          <Link to={isConnected ? "/dashboard" : "/"} className="flex items-center space-x-3" id="logo">
            <motion.img
              whileHover={{ scale: 1.05 }}
              src={logo}
              alt="SciNet Vault Logo"
              className="h-9 max-md:h-6 max-sm:h-[1.6rem] scale-100 hover:scale-125 duration-75 ease-in-out rounded-xl object-contain ring-1 ring-white/20"
            />
            <span className="text-xl font-bold text-gradient">SciNet Vault</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 group">
            {isConnected && navigationItems.map((item) => {
              const active = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
              return (
                <motion.div key={item.name} whileHover={{ y: -2 }}>
                  <Link
                    to={item.path}
                    aria-current={active ? 'page' : undefined}
                    className={`flex items-center space-x-2 transition-all duration-300 px-1 py-2 rounded-xl uppercase tracking-widest text-sm ${
                      active ? 'text-white' : 'text-gray-300 hover:text-gray-400'
                    }`}
                  >
                    <item.icon className="h-4 w-4 opacity-70" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* Right Controls: Wallet, Mobile Menu */}
          <div className="flex items-center gap-4">
            {/* Wallet Connection Button */}
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleWalletConnect}
              disabled={isLoading}
              className="btn-primary text-white px-6 py-2.5 rounded-2xl font-semibold shadow-lg hover:shadow-primary transition-all duration-400 hidden md:inline-flex items-center space-x-2 relative overflow-hidden"
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
              className="md:hidden inline-flex items-center justify-center p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
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
              {isConnected && navigationItems.map((item) => {
                const active = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                return (
                  <motion.div key={item.name} whileHover={{ x: 5 }}>
                    <Link
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center space-x-3 transition-all duration-300 py-3 px-4 rounded-xl group ${
                        active ? 'text-white bg-white/10' : 'text-gray-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <item.icon className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  </motion.div>
                );
              })}
              {/* Mobile wallet button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleWalletConnect}
                disabled={isLoading}
                className="w-full mt-2 btn-primary text-white px-6 py-3 rounded-2xl font-semibold flex items-center justify-center space-x-2"
              >
                <Wallet className="h-4 w-4" />
                <span>{isLoading ? 'Connecting...' : isConnected ? formatAddress(walletAddress) : 'Connect Wallet'}</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
