import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import QRCode from 'qrcode.react';
import { Download, Smartphone, QrCode, CheckCircle, ExternalLink } from 'lucide-react';
import axios from 'axios';

const QRCodeDisplay = ({ memberId, memberName, onClose }) => {
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (memberId) {
      fetchQRCode();
    }
  }, [memberId]);

  const fetchQRCode = async () => {
    try {
      setLoading(true);
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      const response = await axios.get(`${backendUrl}/api/members/${memberId}/qr-code`);
      setQrData(response.data);
    } catch (error) {
      console.error('Error fetching QR code:', error);
      setError('Failed to generate QR code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrData) return;

    // Create a canvas with the QR code and enhanced styling
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const size = 400;
    
    canvas.width = size;
    canvas.height = size + 100; // Extra space for text
    
    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Generate QR code
    const qrCanvas = document.createElement('canvas');
    const qrSize = 300;
    
    // Create QR code using qrcode library
    const QRCodeLib = require('qrcode');
    QRCodeLib.toCanvas(qrCanvas, qrData.verification_url, {
      width: qrSize,
      color: {
        dark: '#FF6600', // ADYC orange
        light: '#FFFFFF'
      }
    }, (error) => {
      if (!error) {
        // Center the QR code
        const qrX = (size - qrSize) / 2;
        const qrY = 50;
        ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);
        
        // Add text
        ctx.fillStyle = '#333333';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('ADYC Member Verification', size / 2, 30);
        
        ctx.font = '14px Arial';
        ctx.fillText(memberName || memberId, size / 2, size - 20);
        
        // Download the canvas as image
        const link = document.createElement('a');
        link.download = `ADYC_QR_${memberId}.png`;
        link.href = canvas.toDataURL();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    });
  };

  const openVerificationURL = () => {
    if (qrData?.verification_url) {
      window.open(qrData.verification_url, '_blank');
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
          <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Generating QR Code...</p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Error</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex space-x-4">
            <button
              onClick={fetchQRCode}
              className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div className="bg-white rounded-2xl p-8 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-orange-100 p-3 rounded-full">
              <QrCode className="w-8 h-8 text-orange-500" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your QR Code</h2>
          <p className="text-gray-600">Use this for event verification</p>
        </div>

        {/* QR Code */}
        <div className="flex justify-center mb-6">
          <div className="bg-white p-4 rounded-xl border-2 border-gray-100 shadow-lg">
            <QRCode
              value={qrData?.verification_url || ''}
              size={200}
              fgColor="#FF6600" // ADYC orange
              bgColor="#FFFFFF"
              level="H"
              includeMargin={true}
            />
          </div>
        </div>

        {/* Member Info */}
        <div className="text-center mb-6">
          <p className="font-semibold text-gray-800">{memberName}</p>
          <p className="text-sm text-gray-600">Member ID: {memberId}</p>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <Smartphone className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-700">
              <p className="font-semibold mb-1">How to use:</p>
              <ul className="space-y-1 text-xs">
                <li>• Show this QR code at ADYC events</li>
                <li>• Event organizers will scan for verification</li>
                <li>• Download for offline access</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={downloadQRCode}
            className="flex-1 bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
          <button
            onClick={openVerificationURL}
            className="flex-1 bg-orange-500 text-white px-4 py-3 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Open Link</span>
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full mt-4 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Close
        </button>
      </div>
    </motion.div>
  );
};

export default QRCodeDisplay;