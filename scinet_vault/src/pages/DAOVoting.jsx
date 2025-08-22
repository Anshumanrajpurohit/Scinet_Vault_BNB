import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Vote, 
  ThumbsUp, 
  ThumbsDown, 
  Clock, 
  Users, 
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Calendar,
  MessageCircle,
  Eye,
  ExternalLink
} from 'lucide-react';

const DAOVoting = () => {
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [vote, setVote] = useState(null);
  const [activeTab, setActiveTab] = useState('active');

  // Mock DAO data
  const daoStats = {
    totalMembers: 2547,
    activeProposals: 8,
    totalVotes: 15234,
    treasuryValue: '45.7 BNB'
  };

  const proposals = [
    {
      id: 1,
      title: 'Implement Peer Review Rewards System',
      description: 'Establish a token-based reward system to incentivize quality peer reviews and improve the overall review process.',
      type: 'Feature',
      status: 'active',
      author: 'Dr. Sarah Chen',
      created: '2025-08-15',
      deadline: '2025-08-25',
      votesFor: 1247,
      votesAgainst: 234,
      totalVotes: 1481,
      requiredVotes: 2000,
      category: 'Governance',
      impact: 'High',
      details: `This proposal aims to create a comprehensive reward system for peer reviewers using SciNet tokens. The system would:
      
      • Reward reviewers with tokens based on review quality and timeliness
      • Implement a reputation system for reviewers
      • Create incentives for thorough and constructive feedback
      • Establish quality metrics for reviews
      
      The proposed allocation is 10% of monthly platform revenue for reviewer rewards.`,
      comments: 45,
      views: 892
    },
    {
      id: 2,
      title: 'Increase Research Verification Standards',
      description: 'Propose stricter verification criteria for research submissions to maintain platform quality and credibility.',
      type: 'Policy',
      status: 'active',
      author: 'Prof. Michael Johnson',
      created: '2025-08-12',
      deadline: '2025-08-22',
      votesFor: 956,
      votesAgainst: 445,
      totalVotes: 1401,
      requiredVotes: 2000,
      category: 'Quality',
      impact: 'Medium',
      details: `This proposal suggests implementing more rigorous verification standards including:
      
      • Mandatory institutional affiliation verification
      • Enhanced plagiarism detection
      • Required ethics committee approval for human subject research
      • Minimum citation requirements for publications
      
      These changes would improve platform credibility but may slow submission process.`,
      comments: 67,
      views: 1245
    },
    {
      id: 3,
      title: 'Community Research Grants Program',
      description: 'Establish a decentralized grant program funded by the DAO treasury to support innovative research projects.',
      type: 'Funding',
      status: 'passed',
      author: 'Dr. Emily Rodriguez',
      created: '2025-07-28',
      deadline: '2025-08-10',
      votesFor: 2156,
      votesAgainst: 344,
      totalVotes: 2500,
      requiredVotes: 2000,
      category: 'Funding',
      impact: 'High',
      details: `Successful proposal that established a 100 BNB quarterly fund for community research grants.`,
      comments: 89,
      views: 2134
    },
    {
      id: 4,
      title: 'Platform Fee Reduction',
      description: 'Reduce platform transaction fees from 2% to 1.5% to make research sharing more accessible.',
      type: 'Economic',
      status: 'rejected',
      author: 'Dr. James Park',
      created: '2025-07-20',
      deadline: '2025-08-01',
      votesFor: 789,
      votesAgainst: 1654,
      totalVotes: 2443,
      requiredVotes: 2000,
      category: 'Economics',
      impact: 'Medium',
      details: `This proposal was rejected due to concerns about platform sustainability and development funding.`,
      comments: 123,
      views: 1876
    }
  ];

  const filteredProposals = proposals.filter(proposal => {
    if (activeTab === 'active') return proposal.status === 'active';
    if (activeTab === 'passed') return proposal.status === 'passed';
    if (activeTab === 'rejected') return proposal.status === 'rejected';
    return true;
  });

  const handleVote = (proposalId, voteType) => {
    setVote(voteType);
    console.log(`Voted ${voteType} on proposal ${proposalId}`);
    // Simulate blockchain transaction
    alert(`Vote submitted! Transaction will be confirmed on the blockchain.`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'passed': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return Clock;
      case 'passed': return CheckCircle;
      case 'rejected': return XCircle;
      default: return AlertCircle;
    }
  };

  const calculateProgress = (votesFor, votesAgainst, required) => {
    const total = votesFor + votesAgainst;
    return Math.min((total / required) * 100, 100);
  };

  const calculateApproval = (votesFor, votesAgainst) => {
    const total = votesFor + votesAgainst;
    return total > 0 ? (votesFor / total) * 100 : 0;
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
          <h1 className="text-3xl font-bold text-gray-100 mb-2">DAO Governance</h1>
          <p className="text-gray-300">Participate in decentralized decision-making for the SciNet Vault platform</p>
        </motion.div>

        {/* DAO Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-slate-900 rounded-xl p-6 shadow-lg text-center border border-white/10">
            <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{daoStats.totalMembers.toLocaleString()}</div>
            <div className="text-sm text-gray-600">DAO Members</div>
          </div>
          
          <div className="bg-slate-900 rounded-xl p-6 shadow-lg text-center border border-white/10">
            <Vote className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{daoStats.activeProposals}</div>
            <div className="text-sm text-gray-600">Active Proposals</div>
          </div>
          
          <div className="bg-slate-900 rounded-xl p-6 shadow-lg text-center border border-white/10">
            <TrendingUp className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{daoStats.totalVotes.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Votes Cast</div>
          </div>
          
          <div className="bg-slate-900 rounded-xl p-6 shadow-lg text-center border border-white/10">
            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-white font-bold text-sm">₿</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{daoStats.treasuryValue}</div>
            <div className="text-sm text-gray-600">Treasury Value</div>
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
              {['active', 'passed', 'rejected', 'all'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm capitalize transition-colors duration-200 ${
                    activeTab === tab
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab} Proposals
                </button>
              ))}
            </nav>
          </div>
        </motion.div>

        {/* Proposals List */}
        <div className="space-y-6">
          {filteredProposals.map((proposal, index) => {
            const StatusIcon = getStatusIcon(proposal.status);
            const progress = calculateProgress(proposal.votesFor, proposal.votesAgainst, proposal.requiredVotes);
            const approval = calculateApproval(proposal.votesFor, proposal.votesAgainst);

            return (
              <motion.div
                key={proposal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-slate-900 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-center space-x-3 mb-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(proposal.status)} flex items-center space-x-1`}>
                        <StatusIcon className="h-4 w-4" />
                        <span className="capitalize">{proposal.status}</span>
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                        {proposal.category}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-md ${
                        proposal.impact === 'High' ? 'bg-red-100 text-red-700' :
                        proposal.impact === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {proposal.impact} Impact
                      </span>
                    </div>

                    {/* Title and Description */}
                    <h3 className="text-xl font-bold text-gray-100 mb-2">{proposal.title}</h3>
                    <p className="text-gray-300 mb-4">{proposal.description}</p>

                    {/* Meta Information */}
                    <div className="flex items-center space-x-6 text-sm text-gray-400 mb-4">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span>By {proposal.author}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>Created {proposal.created}</span>
                      </div>
                      {proposal.status === 'active' && (
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>Ends {proposal.deadline}</span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        <span>{proposal.views} views</span>
                      </div>
                      <div className="flex items-center">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        <span>{proposal.comments} comments</span>
                      </div>
                    </div>

                    {/* Voting Progress */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-300">
                          Voting Progress ({proposal.totalVotes.toLocaleString()}/{proposal.requiredVotes.toLocaleString()})
                        </span>
                        <span className="text-sm text-gray-500">{progress.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div
                          className="bg-gradient-to-r from-primary-600 to-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center text-green-600">
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            <span>{proposal.votesFor.toLocaleString()} ({approval.toFixed(1)}%)</span>
                          </div>
                          <div className="flex items-center text-red-600">
                            <ThumbsDown className="h-4 w-4 mr-1" />
                            <span>{proposal.votesAgainst.toLocaleString()} ({(100-approval).toFixed(1)}%)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Voting Actions */}
                  {proposal.status === 'active' && (
                    <div className="ml-6 flex flex-col space-y-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleVote(proposal.id, 'for')}
                        className="bg-green-500 text-white px-6 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
                      >
                        <ThumbsUp className="h-4 w-4" />
                        <span>Vote For</span>
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleVote(proposal.id, 'against')}
                        className="bg-red-500 text-white px-6 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
                      >
                        <ThumbsDown className="h-4 w-4" />
                        <span>Vote Against</span>
                      </motion.button>
                      
                      <button
                        onClick={() => setSelectedProposal(selectedProposal === proposal.id ? null : proposal.id)}
                        className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center space-x-1"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>Details</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Expanded Details */}
                {selectedProposal === proposal.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-gray-200 pt-4 mt-4"
                  >
                    <h4 className="font-semibold text-gray-900 mb-3">Proposal Details</h4>
                    <div className="prose prose-sm max-w-none text-gray-600">
                      {proposal.details.split('\n').map((line, index) => (
                        <p key={index} className="mb-2">{line}</p>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Create Proposal Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <button className="bg-gradient-to-r from-primary-600 to-purple-500 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center space-x-2 mx-auto">
            <Vote className="h-5 w-5" />
            <span>Create New Proposal</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default DAOVoting;
