import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import './App.css';
import { AppDataProvider } from './context/AppDataContext';
import LightRays from './pages/LightRays';

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
import ResearchDetail from './pages/ResearchDetail';
import VersionHistory from './pages/VersionHistory';
import VersionDiff from './pages/VersionDiff';
import PeerReviews from './pages/PeerReviews';
import ReviewDetail from './pages/ReviewDetail';
import Quests from './pages/Quests';
import CreateQuest from './pages/CreateQuest';
import QuestDetail from './pages/QuestDetail';
import NotebookRunner from './pages/NotebookRunner';
import Collaborate from './pages/Collaborate';

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
      <AppDataProvider>
      <Router>
  <div className="min-h-screen flex flex-col bg-transparent text-gray-100">
          <Navbar />
          <AppRoutesWithBackground />
        </div>
      </Router>
      </AppDataProvider>
    </AuthProvider>
  );
}

// Routes + conditional LightRays background wrapper
const AppRoutesWithBackground = () => {
  const location = useLocation();
  const raysRoutes = new Set([
    '/dashboard',
    '/upload',
    '/explore',
    '/reviews',
    '/quests',
    '/profile',
    '/dao',
  ]);
  const showRays = Array.from(raysRoutes).some((path) =>
    location.pathname === path || location.pathname.startsWith(path + '/')
  );
  return (
    <>
      {showRays && (
        <div className="fixed inset-0 z-0" aria-hidden="true">
          <LightRays
            raysOrigin="top-center"
            raysColor="#00ffff"
            raysSpeed={1.5}
            lightSpread={0.8}
            rayLength={1.2}
            followMouse={true}
            mouseInfluence={0.1}
            noiseAmount={0.1}
            distortion={0.05}
            className="custom-rays"
          />
        </div>
      )}
  <div className={'relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 pb-10 flex-1'}>
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

              {/* New feature routes */}
              <Route 
                path="/research/:id" 
                element={
                  <ProtectedRoute>
                    <ResearchDetail />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/research/:id/versions" 
                element={
                  <ProtectedRoute>
                    <VersionHistory />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/research/:id/diff" 
                element={
                  <ProtectedRoute>
                    <VersionDiff />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/reviews" 
                element={
                  <ProtectedRoute>
                    <PeerReviews />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/reviews/:id" 
                element={
                  <ProtectedRoute>
                    <ReviewDetail />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/quests" 
                element={
                  <ProtectedRoute>
                    <Quests />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/quests/new" 
                element={
                  <ProtectedRoute>
                    <CreateQuest />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/quests/:id" 
                element={
                  <ProtectedRoute>
                    <QuestDetail />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/notebooks/:cid" 
                element={
                  <ProtectedRoute>
                    <NotebookRunner />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/collaborate/:id" 
                element={
                  <ProtectedRoute>
                    <Collaborate />
                  </ProtectedRoute>
                } 
              />
          </Routes>
        </AnimatePresence>
      </div>
      <Footer />
    </>
  );
};

export default App;
