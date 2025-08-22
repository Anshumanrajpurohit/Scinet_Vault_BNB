import React from 'react';
import { motion } from 'framer-motion';
import { Github, FileText, Users, Info, Beaker } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Platform',
      links: [
        { name: 'About', href: '#', icon: Info },
        { name: 'Documentation', href: '#', icon: FileText },
        { name: 'Community', href: '#', icon: Users },
        { name: 'GitHub', href: 'https://github.com/Anshumanrajpurohit/Scinet_Vault_BNB', icon: Github },
      ],
    },
    {
      title: 'Resources',
      links: [
        { name: 'API Documentation', href: '#' },
        { name: 'Research Guidelines', href: '#' },
        { name: 'Smart Contracts', href: '#' },
        { name: 'Whitepaper', href: '#' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', href: '#' },
        { name: 'Terms of Service', href: '#' },
        { name: 'Cookie Policy', href: '#' },
        { name: 'Disclaimer', href: '#' },
      ],
    },
  ];

  return (
    <footer className="bg-slate-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-primary-600 to-purple-500 p-2 rounded-xl">
                <Beaker className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">SciNet Vault</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Revolutionizing scientific research through decentralized collaboration 
              and blockchain-verified data integrity.
            </p>
            <div className="flex space-x-4">
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="https://github.com/Anshumanrajpurohit/Scinet_Vault_BNB"
                className="text-gray-400 hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-5 w-5" />
              </motion.a>
            </div>
          </div>

          {/* Links Sections */}
          {footerLinks.map((section) => (
            <div key={section.title} className="col-span-1">
              <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <motion.a
                      whileHover={{ x: 5 }}
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-all duration-200 flex items-center space-x-2"
                      target={link.href.startsWith('http') ? '_blank' : '_self'}
                      rel={link.href.startsWith('http') ? 'noopener noreferrer' : ''}
                    >
                      {link.icon && <link.icon className="h-4 w-4" />}
                      <span>{link.name}</span>
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              <p>© {currentYear} SciNet Vault. All rights reserved.</p>
              <p className="mt-1">Built with ❤️ for the scientific community</p>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Blockchain Active</span>
              </span>
              <span>Network: BSC</span>
            </div>
          </div>
        </div>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent to-slate-900/5 pointer-events-none"></div>
    </footer>
  );
};

export default Footer;
