import { motion } from 'framer-motion';
import { ArrowRight, Shield, Database, Users, Zap, CheckCircle, Star } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import Prism from './Prism';


const PublicLanding = () => {
  const { connectWallet, isLoading, isConnected } = useAuth();
  const navigate = useNavigate();

  // Redirect to dashboard once wallet is connected
  useEffect(() => {
    if (isConnected) {
      navigate('/dashboard', { replace: true });
    }
  }, [isConnected, navigate]);

  const features = [
    {
      icon: Shield,
      title: 'Blockchain Verified',
      description: 'Research data integrity guaranteed through immutable blockchain records',
    },
    {
      icon: Database,
      title: 'Decentralized Storage',
      description: 'Secure, distributed storage ensures your research is always accessible',
    },
    {
      icon: Users,
      title: 'Global Collaboration',
      description: 'Connect with researchers worldwide in a trustless environment',
    },
    {
      icon: Zap,
      title: 'Instant Publishing',
      description: 'Share your findings immediately with cryptographic proof of originality',
    },
  ];

  const benefits = [
    'Immutable research records',
    'Peer-to-peer verification',
    'Decentralized governance',
    'Transparent funding',
    'Open science protocols',
    'Global accessibility',
  ];

  const stats = [
    { number: '10K+', label: 'Research Papers' },
    { number: '500+', label: 'Active Researchers' },
    { number: '25+', label: 'Partner Institutions' },
    { number: '99.9%', label: 'Data Integrity' },
  ];

  return (
  <div className="min-h-[calc(100vh-4rem)]">{/* ensure above-fold section fills screen minus navbar height */}
      {/* Hero Section */}
  <section className="relative overflow-visible text-white">
    {/* Prism background */}
    <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
      <Prism
        animationType="rotate"
        timeScale={0.5}
        height={3.5}
        baseWidth={5.5}
        scale={3.6}
        hueShift={0}
        colorFrequency={1}
        noise={0.5}
        glow={1}
      />
    </div>
        
  <div className="relative z-10   mx-auto px-4 sm:px-6 lg:px-8 py-28 h-screen">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold mb-6"
            >
              Revolutionize
              <span className="text-gradient ml-4 inline-block">
                Scientific Research
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
            >
              Join the future of science with blockchain-verified research, 
              decentralized collaboration, and transparent peer review.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={connectWallet}
                disabled={isLoading}
                className="btn-primary text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-2xl hover:shadow-primary transition-all duration-400 flex items-center justify-center space-x-2 relative"
              >
                <span>{isLoading ? 'Connecting...' : 'Get Started'}</span>
                <ArrowRight className="h-5 w-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="btn-secondary text-white px-8 py-4 rounded-2xl text-lg font-semibold backdrop-blur-sm hover:bg-white/10 transition-all duration-300 border-2 border-white/20"
                type="button"
                onClick={() => {
                  const el = document.getElementById('features');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
              >
                Learn More
              </motion.button>
            </motion.div>
          </div>
        </div>

  {/* Floating elements removed */}
      </section>

    {/* Stats Section */}
  <section className="py-16">
        <div className="  mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    {/* Features Section */}
  <section id="features" className="py-24 scroll-mt-24">
        <div className="  mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-gray-100 mb-4"
            >
              Powered by Web3 Technology
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-300 max-w-3xl mx-auto"
            >
              Experience the next generation of scientific research infrastructure
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group glass-card rounded-3xl p-8 hover:shadow-xl transition-all duration-500 relative"
              >
                <div className="bg-gradient-to-r from-primary-600 to-purple-500 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-100 mb-3">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                
                {/* Shimmer Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    {/* Benefits Section */}
  <section className="py-20">
        <div className="  mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.h2
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="text-4xl md:text-5xl font-bold text-gray-100 mb-6"
              >
                Why Choose SciNet Vault?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-gray-300 mb-8"
              >
                Join thousands of researchers who trust our platform for their most important work.
              </motion.p>
              
              <div className="grid gap-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-300">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl p-8 text-white">
                <div className="flex items-center mb-4">
                  <Star className="h-6 w-6 text-yellow-300 mr-2" />
                  <span className="font-semibold">Trusted by Leading Institutions</span>
                </div>
                <blockquote className="text-lg mb-4">
                  "SciNet Vault has transformed how we collaborate and share research. 
                  The blockchain verification gives us complete confidence in data integrity."
                </blockquote>
                <cite className="text-purple-200">Dr. Sarah Chen, MIT Research Lab</cite>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

  {/* CTA Section */}
  <section className="py-20 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Ready to Join the Future of Science?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl mb-8 text-purple-100"
          >
            Connect your wallet and start contributing to the decentralized science revolution today.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={connectWallet}
            disabled={isLoading}
            className="bg-white text-primary-600 px-8 py-4 rounded-2xl text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-2 mx-auto"
          >
            <span>{isLoading ? 'Connecting...' : 'Get Started Now'}</span>
            <ArrowRight className="h-5 w-5" />
          </motion.button>
        </div>
      </section>
    </div>
  );
};

export default PublicLanding;
