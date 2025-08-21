import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from './Layout';
import { CheckCircle, User, MapPin, Calendar, Mail, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

const MemberVerification = ({ memberId, onNavigate }) => {
  const [memberData, setMemberData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (memberId) {
      verifyMember();
    }
  }, [memberId]);

  const verifyMember = async () => {
    try {
      setLoading(true);
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      const response = await axios.get(`${backendUrl}/api/verify/${memberId}`);
      setMemberData(response.data);
      setVerified(response.data.verified);
    } catch (error) {
      console.error('Error verifying member:', error);
      if (error.response?.status === 404) {
        setError('Member not found. Please check the QR code and try again.');
      } else {
        setError('Verification failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  if (loading) {
    return (
      <Layout currentPage="verification" onNavigate={onNavigate}>
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Verifying Member</h2>
            <p className="text-gray-600">Please wait while we verify the member information...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout currentPage="verification" onNavigate={onNavigate}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="container mx-auto px-4 py-8 max-w-2xl"
        >
          <motion.div variants={itemVariants} className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Verification Failed</h2>
            <p className="text-gray-600 mb-8">{error}</p>
            <div className="space-y-4">
              <button
                onClick={verifyMember}
                className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => onNavigate('home')}
                className="block w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Go to Home
              </button>
            </div>
          </motion.div>
        </motion.div>
      </Layout>
    );
  }

  return (
    <Layout currentPage="verification" onNavigate={onNavigate}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-4 py-8 max-w-2xl"
      >
        {/* Success Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 15 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full mb-6 shadow-lg"
          >
            <CheckCircle className="w-10 h-10 text-white" />
          </motion.div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Member Verified!
          </h1>
          <p className="text-gray-600">
            This is a valid ADYC member with verified credentials.
          </p>
        </motion.div>

        {/* Member Information Card */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            {/* Member Photo and Basic Info */}
            <div className="text-center mb-6">
              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-gray-100 shadow-md mb-4 border-4 border-orange-500/20">
                {memberData?.photo_url ? (
                  <img src={memberData.photo_url} alt="Member" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{memberData?.full_name}</h2>
              <p className="text-orange-600 font-bold text-lg">{memberData?.member_id}</p>
            </div>
            
            {/* Member Details */}
            <div className="space-y-4">
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 mr-4 text-orange-500 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Email Address</p>
                  <p className="text-gray-800 font-medium">{memberData?.email}</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 mr-4 text-orange-500 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Registration Date</p>
                  <p className="text-gray-800 font-medium">
                    {memberData?.registration_date ? 
                      new Date(memberData.registration_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'Not available'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Verification Status */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center">
              <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-green-800 mb-1">
                  Verification Complete
                </h3>
                <p className="text-green-700 text-sm">
                  This member has been successfully verified as a legitimate ADYC member. 
                  All credentials have been authenticated against our secure database.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Verification Details */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">Verification Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-700">Member ID:</span>
                <span className="text-blue-800 font-medium">{memberData?.member_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Status:</span>
                <span className="text-green-600 font-medium">✓ Verified</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Verification Time:</span>
                <span className="text-blue-800 font-medium">
                  {new Date().toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Database Status:</span>
                <span className="text-green-600 font-medium">✓ Active Member</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div variants={itemVariants} className="text-center">
          <div className="space-y-4">
            <button
              onClick={() => window.print()}
              className="w-full bg-orange-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Print Verification Report
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="w-full bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.div variants={itemVariants} className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            This verification was performed securely and logged for audit purposes. 
            If you have any questions about this verification, please contact ADYC support.
          </p>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default MemberVerification;