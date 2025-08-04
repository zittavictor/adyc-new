import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from './Layout';
import { Camera, Download, CheckCircle, User, MapPin, Calendar, Globe } from 'lucide-react';
import jsPDF from 'jspdf';

const Register = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    passport: null,
    passportPreview: null,
    fullName: '',
    dob: '',
    ward: '',
    lga: '',
    state: '',
    country: 'Nigeria',
    address: '',
    language: '',
    maritalStatus: '',
    gender: '',
  });
  const [isRegistered, setIsRegistered] = useState(false);
  const [generatedId, setGeneratedId] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((prev) => ({
          ...prev,
          [name]: file,
          passportPreview: e.target.result,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newId = `ADYC-${Date.now().toString().slice(-6)}`;
    setGeneratedId(newId);
    setIsRegistered(true);
  };

  const generateIDCardPDF = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [85.6, 54]
    });

    // Card background
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 85.6, 54, 'F');

    // Header section with gradient effect
    doc.setFillColor(249, 115, 22); // Primary orange
    doc.rect(0, 0, 85.6, 12, 'F');

    // ADYC Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('AFRICAN DEMOCRATIC YOUTH CONGRESS', 42.8, 6, { align: 'center' });
    doc.setFontSize(6);
    doc.text('MEMBERSHIP ID CARD', 42.8, 9, { align: 'center' });

    // Member photo placeholder (if photo exists, we'd process it here)
    doc.setFillColor(240, 240, 240);
    doc.rect(5, 15, 20, 25, 'F');
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(6);
    doc.text('PHOTO', 15, 27, { align: 'center' });

    // Member information
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text('NAME:', 28, 18);
    doc.setFont('helvetica', 'normal');
    doc.text(formData.fullName.toUpperCase(), 28, 22);

    doc.setFont('helvetica', 'bold');
    doc.text('ID:', 28, 26);
    doc.setFont('helvetica', 'normal');
    doc.text(generatedId, 28, 30);

    doc.setFont('helvetica', 'bold');
    doc.text('STATE:', 28, 34);
    doc.setFont('helvetica', 'normal');
    doc.text(formData.state.toUpperCase(), 28, 38);

    doc.setFont('helvetica', 'bold');
    doc.text('LGA:', 55, 34);
    doc.setFont('helvetica', 'normal');
    doc.text(formData.lga.toUpperCase(), 55, 38);

    // Footer
    doc.setFillColor(34, 197, 94); // Secondary green
    doc.rect(0, 45, 85.6, 9, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(5);
    doc.text('VALID NATIONWIDE • ISSUED: ' + new Date().getFullYear(), 42.8, 50, { align: 'center' });

    // Save the PDF
    doc.save(`ADYC_ID_Card_${generatedId}.pdf`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  if (isRegistered) {
    return (
      <Layout currentPage="register" onNavigate={onNavigate}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex items-center justify-center h-full"
        >
          <motion.div
            variants={itemVariants}
            className="floating-card p-8 max-w-2xl mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            >
              <CheckCircle className="w-20 h-20 text-secondary-500 mx-auto mb-6" />
            </motion.div>
            
            <h2 className="text-3xl font-bold text-neutral-800 dark:text-white mb-4">
              Registration Successful!
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-8 text-lg">
              Welcome to the African Democratic Youth Congress! Your membership has been confirmed.
            </p>

            {/* ID Card Preview */}
            <div className="neumorphic bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 p-8 rounded-2xl mb-8 mx-auto max-w-md">
              <h3 className="text-xl font-bold text-primary-600 dark:text-primary-400 mb-4">Your Member ID</h3>
              
              {/* Virtual ID Card */}
              <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-lg border-l-4 border-primary-500">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 rounded-full neumorphic-inset flex items-center justify-center overflow-hidden bg-neutral-100 dark:bg-neutral-700">
                    {formData.passportPreview ? (
                      <img src={formData.passportPreview} alt="Passport" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-8 h-8 text-neutral-500" />
                    )}
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-neutral-800 dark:text-white text-lg">{formData.fullName}</h4>
                    <p className="text-primary-600 dark:text-primary-400 font-semibold">{generatedId}</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-neutral-600 dark:text-neutral-400">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{formData.state}, {formData.lga}</span>
                  </div>
                  <div className="flex items-center text-neutral-600 dark:text-neutral-400">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Issued: {new Date().getFullYear()}</span>
                  </div>
                  <div className="flex items-center text-neutral-600 dark:text-neutral-400">
                    <Globe className="w-4 h-4 mr-2" />
                    <span>Valid Nationwide</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={generateIDCardPDF}
                className="neumorphic-button bg-gradient-to-r from-secondary-600 to-primary-600 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2 mobile-button"
              >
                <Download className="w-5 h-5" />
                <span>Download ID Card PDF</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate('home')}
                className="neumorphic-button bg-white/50 dark:bg-neutral-800/30 text-neutral-700 dark:text-neutral-300 font-semibold py-3 px-8 rounded-xl border border-neutral-200/50 dark:border-neutral-600/50 mobile-button"
              >
                Go to Home
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </Layout>
    );
  }

  return (
    <Layout currentPage="register" onNavigate={onNavigate}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6 h-full overflow-y-auto mobile-scroll"
      >
        <motion.div variants={itemVariants}>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-2">
            Join ADYC Today!
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-lg">
            Become a member of the African Democratic Youth Congress and help shape Nigeria's future.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="floating-card p-8 max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Passport Photo Section */}
            <div className="text-center">
              <h3 className="text-xl font-semibold text-neutral-800 dark:text-white mb-4">Upload Your Passport Photograph</h3>
              <div className="flex flex-col items-center space-y-4">
                <div className="w-32 h-32 rounded-full neumorphic-inset flex items-center justify-center overflow-hidden bg-neutral-100 dark:bg-neutral-700">
                  {formData.passportPreview ? (
                    <img src={formData.passportPreview} alt="Passport Preview" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-16 h-16 text-neutral-500" />
                  )}
                </div>
                <input
                  type="file"
                  id="passport"
                  name="passport"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                  required
                />
                <label htmlFor="passport" className="neumorphic-button bg-primary-500 text-white px-6 py-3 rounded-xl cursor-pointer hover:bg-primary-600 transition-colors flex items-center space-x-2 mobile-button">
                  <Camera className="w-5 h-5" />
                  <span>Choose Photo</span>
                </label>
              </div>
            </div>

            {/* Personal Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Full Names *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full neumorphic-input px-4 py-3 rounded-xl text-neutral-800 dark:text-white bg-neutral-50 dark:bg-neutral-700/50 focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                  className="w-full neumorphic-input px-4 py-3 rounded-xl text-neutral-800 dark:text-white bg-neutral-50 dark:bg-neutral-700/50 focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Ward *
                </label>
                <input
                  type="text"
                  name="ward"
                  value={formData.ward}
                  onChange={handleChange}
                  required
                  className="w-full neumorphic-input px-4 py-3 rounded-xl text-neutral-800 dark:text-white bg-neutral-50 dark:bg-neutral-700/50 focus:ring-2 focus:ring-primary-500"
                  placeholder="Your ward"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Local Government Area (LGA) *
                </label>
                <input
                  type="text"
                  name="lga"
                  value={formData.lga}
                  onChange={handleChange}
                  required
                  className="w-full neumorphic-input px-4 py-3 rounded-xl text-neutral-800 dark:text-white bg-neutral-50 dark:bg-neutral-700/50 focus:ring-2 focus:ring-primary-500"
                  placeholder="Your LGA"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  State *
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="w-full neumorphic-input px-4 py-3 rounded-xl text-neutral-800 dark:text-white bg-neutral-50 dark:bg-neutral-700/50 focus:ring-2 focus:ring-primary-500"
                  placeholder="Your state"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Country *
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className="w-full neumorphic-input px-4 py-3 rounded-xl text-neutral-800 dark:text-white bg-neutral-50 dark:bg-neutral-700/50 focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Language
                </label>
                <input
                  type="text"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="w-full neumorphic-input px-4 py-3 rounded-xl text-neutral-800 dark:text-white bg-neutral-50 dark:bg-neutral-700/50 focus:ring-2 focus:ring-primary-500"
                  placeholder="Primary language"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Gender *
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="w-full neumorphic-input px-4 py-3 rounded-xl text-neutral-800 dark:text-white bg-neutral-50 dark:bg-neutral-700/50 focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Marital Status
                </label>
                <select
                  name="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={handleChange}
                  className="w-full neumorphic-input px-4 py-3 rounded-xl text-neutral-800 dark:text-white bg-neutral-50 dark:bg-neutral-700/50 focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select Status</option>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="divorced">Divorced</option>
                  <option value="widowed">Widowed</option>
                </select>
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Residential Address *
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                required
                className="w-full neumorphic-input px-4 py-3 rounded-xl text-neutral-800 dark:text-white bg-neutral-50 dark:bg-neutral-700/50 focus:ring-2 focus:ring-primary-500"
                placeholder="Enter your full residential address"
              />
            </div>

            {/* Submit Button */}
            <div className="text-center pt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="neumorphic-button bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-bold py-4 px-12 rounded-xl shadow-lg hover:shadow-xl transition-all text-lg mobile-button"
              >
                Complete Registration
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default Register;