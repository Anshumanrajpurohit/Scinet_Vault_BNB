import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import './App.css';

// Context for wallet and authentication
const AuthContext = createContext();

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PublicLanding from './pages/PublicLanding';
import AuthenticatedLanding from './pages/AuthenticatedLanding';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import ResearchExplorer from './pages/ResearchExplorer';
import Profile from './pages/Profile';
import DAOVoting from './pages/DAOVoting';

// Web3 wallet connection logic
const useWallet = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        setIsLoading(true);
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setIsConnected(true);
          localStorage.setItem('walletConnected', 'true');
          localStorage.setItem('walletAddress', accounts[0]);
        }
      } catch (error) {
        console.error('Error connecting wallet:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      alert('Please install MetaMask to use this application');
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress('');
    localStorage.removeItem('walletConnected');
    localStorage.removeItem('walletAddress');
  };

  // Check for existing connection on load
  useEffect(() => {
    const checkConnection = async () => {
      const savedConnection = localStorage.getItem('walletConnected');
      const savedAddress = localStorage.getItem('walletAddress');
      
      if (savedConnection === 'true' && savedAddress) {
        if (typeof window.ethereum !== 'undefined') {
          try {
            const accounts = await window.ethereum.request({
              method: 'eth_accounts',
            });
            if (accounts.includes(savedAddress)) {
              setWalletAddress(savedAddress);
              setIsConnected(true);
            }
          } catch (error) {
            console.error('Error checking wallet connection:', error);
          }
        }
      }
    };

    checkConnection();
  }, []);

  return {
    isConnected,
    walletAddress,
    isLoading,
    connectWallet,
    disconnectWallet,
  };
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const wallet = useWallet();
  
  return (
    <AuthContext.Provider value={wallet}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isConnected } = useAuth();
  
  return isConnected ? children : <Navigate to="/" replace />;
};

// Main App Component
function App() {
  return (
    <AuthProvider>
      <Router>
  <div className="bg-gradient-to-br from-black via-slate-900 to-black text-gray-100">
          <Navbar />
          <AnimatePresence mode="wait">
            <Routes>
              {/* Public landing page */}
              <Route path="/" element={<PublicLanding />} />
              
              {/* Authenticated landing page */}
              <Route 
                path="/welcome" 
                element={
                  <ProtectedRoute>
                    <AuthenticatedLanding />
                  </ProtectedRoute>
                } 
              />
              
              {/* Main platform routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/upload" 
                element={
                  <ProtectedRoute>
                    <Upload />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/explore" 
                element={
                  <ProtectedRoute>
                    <ResearchExplorer />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/dao" 
                element={
                  <ProtectedRoute>
                    <DAOVoting />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </AnimatePresence>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
