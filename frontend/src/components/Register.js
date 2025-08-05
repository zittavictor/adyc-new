import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from './Layout';
import { Camera, Download, CheckCircle, User, MapPin, Calendar, Globe, Mail, Loader2, UserCheck, Shield, Award } from 'lucide-react';
import jsPDF from 'jspdf';
import axios from 'axios';

const Register = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    passport: null,
    passportPreview: null,
    email: '',
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
  const [registrationData, setRegistrationData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
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
      if (error) setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const registrationPayload = {
        email: formData.email,
        passport: formData.passportPreview || '',
        full_name: formData.fullName,
        dob: formData.dob,
        ward: formData.ward,
        lga: formData.lga,
        state: formData.state,
        country: formData.country,
        address: formData.address,
        language: formData.language,
        marital_status: formData.maritalStatus,
        gender: formData.gender,
      };

      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      const response = await axios.post(`${backendUrl}/api/register`, registrationPayload);
      
      setRegistrationData(response.data);
      setIsRegistered(true);
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response?.data?.detail) {
        setError(error.response.data.detail);
      } else if (error.response?.status === 400) {
        setError('Email already registered. Please use a different email.');
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const generateIDCardPDF = () => {
    if (!registrationData) return;

    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [85.6, 54]
    });

    // Enhanced PDF generation with better design
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 85.6, 54, 'F');

    // Header with ADYC branding
    doc.setFillColor(249, 115, 22);
    doc.rect(0, 0, 85.6, 12, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('AFRICAN DEMOCRATIC YOUTH CONGRESS', 42.8, 6, { align: 'center' });
    doc.setFontSize(6);
    doc.text('OFFICIAL MEMBERSHIP CARD', 42.8, 9, { align: 'center' });

    // Member photo area
    doc.setFillColor(245, 245, 245);
    doc.rect(5, 15, 20, 25, 'F');
    doc.setTextColor(120, 120, 120);
    doc.setFontSize(6);
    doc.text('MEMBER', 15, 25, { align: 'center' });
    doc.text('PHOTO', 15, 28, { align: 'center' });

    // Member details with better layout
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text('NAME:', 28, 18);
    doc.setFont('helvetica', 'normal');
    doc.text(registrationData.full_name.toUpperCase(), 28, 22);

    doc.setFont('helvetica', 'bold');
    doc.text('ID:', 28, 26);
    doc.setFont('helvetica', 'normal');
    doc.text(registrationData.member_id, 28, 30);

    doc.setFont('helvetica', 'bold');
    doc.text('EMAIL:', 28, 34);
    doc.setFont('helvetica', 'normal');
    doc.text(registrationData.email, 28, 38);

    doc.setFont('helvetica', 'bold');
    doc.text('LOCATION:', 55, 18);
    doc.setFont('helvetica', 'normal');
    doc.text(`${registrationData.state.toUpperCase()}`, 55, 22);
    doc.text(`${registrationData.lga.toUpperCase()}`, 55, 26);
    doc.text(`${registrationData.ward.toUpperCase()}`, 55, 30);

    doc.setFont('helvetica', 'bold');
    doc.text('GENDER:', 28, 42);
    doc.setFont('helvetica', 'normal');
    doc.text(registrationData.gender.toUpperCase(), 45, 42);

    // Footer with validation
    doc.setFillColor(34, 197, 94);
    doc.rect(0, 47, 85.6, 7, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(5);
    const issueYear = new Date(registrationData.registration_date).getFullYear();
    doc.text(`VALID NATIONWIDE • ISSUED: ${issueYear} • OFFICIAL MEMBER`, 42.8, 51, { align: 'center' });

    doc.save(`ADYC_ID_Card_${registrationData.member_id}.pdf`);
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

  if (isRegistered) {
    return (
      <Layout currentPage="register" onNavigate={onNavigate}>
        <div className="container-custom section-spacing">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto"
          >
            {/* Success Header */}
            <motion.div
              variants={itemVariants}
              className="text-center mb-12"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 15 }}
                className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full mb-8 shadow-strong"
              >
                <CheckCircle className="w-12 h-12 text-white" />
              </motion.div>
              
              <h1 className="display-text text-primary mb-4">
                Welcome to <span className="text-accent">ADYC!</span>
              </h1>
              <p className="body-large text-secondary mb-8 max-w-2xl mx-auto">
                Your membership has been successfully confirmed. You're now part of Nigeria's most dynamic youth political movement.
              </p>

              {/* Email Confirmation Notice */}
              <div className="modern-card bg-accent-subtle border-l-4 border-l-orange-500 p-6 mb-8">
                <div className="flex items-center justify-center space-x-3 text-orange-700 dark:text-orange-400">
                  <Mail className="w-6 h-6" />
                  <div className="text-center">
                    <p className="font-semibold mb-1">Check Your Email!</p>
                    <p className="text-sm">
                      Your official ADYC ID card PDF has been sent to {registrationData?.email}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Member Card Preview */}
            <motion.div variants={itemVariants} className="mb-12">
              <div className="bg-gradient-to-br from-slate-50 to-orange-50/30 dark:from-slate-800 dark:to-orange-900/20 rounded-3xl p-8">
                <h2 className="heading-secondary text-primary text-center mb-8">
                  Your Official Member Card
                </h2>
                
                {/* Virtual ID Card - Premium Design */}
                <div className="max-w-md mx-auto">
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-strong border border-orange-500/20 relative overflow-hidden">
                    {/* Card Header */}
                    <div className="text-center mb-6">
                      <div className="w-20 h-20 mx-auto rounded-full overflow-hidden bg-slate-100 dark:bg-slate-700 shadow-moderate mb-4 border-4 border-orange-500/20">
                        {registrationData?.passport ? (
                          <img src={registrationData.passport} alt="Member" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User className="w-10 h-10 text-slate-400" />
                          </div>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-primary mb-2">{registrationData?.full_name}</h3>
                      <p className="text-orange-600 dark:text-orange-400 font-bold text-lg">{registrationData?.member_id}</p>
                    </div>
                    
                    {/* Member Details */}
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center text-secondary">
                        <Mail className="w-4 h-4 mr-3 text-orange-500" />
                        <span>{registrationData?.email}</span>
                      </div>
                      <div className="flex items-center text-secondary">
                        <MapPin className="w-4 h-4 mr-3 text-orange-500" />
                        <span>{registrationData?.state}, {registrationData?.lga}</span>
                      </div>
                      <div className="flex items-center text-secondary">
                        <Calendar className="w-4 h-4 mr-3 text-orange-500" />
                        <span>Issued: {registrationData ? new Date(registrationData.registration_date).getFullYear() : new Date().getFullYear()}</span>
                      </div>
                      <div className="flex items-center text-secondary">
                        <Globe className="w-4 h-4 mr-3 text-orange-500" />
                        <span>Valid Nationwide</span>
                      </div>
                    </div>

                    {/* Background decoration */}
                    <div className="absolute top-4 right-4 opacity-10">
                      <Award className="w-16 h-16 text-orange-500" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div variants={itemVariants}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={generateIDCardPDF}
                  className="btn-primary mobile-touch flex items-center space-x-3 text-lg px-8 py-4"
                >
                  <Download className="w-5 h-5" />
                  <span>Download ID Card PDF</span>
                </button>
                
                <button
                  onClick={() => onNavigate('home')}
                  className="btn-secondary mobile-touch text-lg px-8 py-4"
                >
                  Explore ADYC
                </button>
              </div>
            </motion.div>

            {/* Next Steps */}
            <motion.div variants={itemVariants} className="mt-16">
              <div className="text-center">
                <h3 className="heading-tertiary text-primary mb-8">What's Next?</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="modern-card text-center group">
                    <UserCheck className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h4 className="font-semibold text-primary mb-2">Connect</h4>
                    <p className="text-sm text-secondary">
                      Join our community platforms and connect with fellow members
                    </p>
                  </div>
                  <div className="modern-card text-center group">
                    <Shield className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                    <h4 className="font-semibold text-primary mb-2">Participate</h4>
                    <p className="text-sm text-secondary">
                      Attend meetings, workshops, and democratic activities
                    </p>
                  </div>
                  <div className="modern-card text-center group">
                    <Award className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                    <h4 className="font-semibold text-primary mb-2">Lead</h4>
                    <p className="text-sm text-secondary">
                      Take on leadership roles in your zone and community
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout currentPage="register" onNavigate={onNavigate}>
      <div className="container-custom section-spacing">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto"
        >
          {/* Header Section */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h1 className="display-text text-primary mb-6">
              Join <span className="text-accent hand-drawn-accent">ADYC</span> Today!
            </h1>
            <p className="body-large text-secondary max-w-2xl mx-auto mb-8">
              Become a member of Africa's most dynamic youth political movement and help shape Nigeria's democratic future.
            </p>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-secondary">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-500" />
                <span>Secure Registration</span>
              </div>
              <div className="flex items-center space-x-2">
                <UserCheck className="w-5 h-5 text-blue-500" />
                <span>Instant Member ID</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-orange-500" />
                <span>Official Recognition</span>
              </div>
            </div>
          </motion.div>

          {/* Registration Form */}
          <motion.div variants={itemVariants}>
            <div className="featured-card">
              <form onSubmit={handleSubmit} className="space-y-10">
                {/* Profile Photo Section - Prominent Design */}
                <div className="text-center">
                  <h2 className="heading-tertiary text-primary mb-8">Upload Your Profile Photo</h2>
                  <div className="flex flex-col items-center space-y-6">
                    <div className="relative">
                      <div className="w-40 h-40 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-700 shadow-strong flex items-center justify-center border-4 border-orange-500/20">
                        {formData.passportPreview ? (
                          <img src={formData.passportPreview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-20 h-20 text-slate-400" />
                        )}
                      </div>
                      {formData.passportPreview && (
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-moderate">
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
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
                    <label htmlFor="passport" className="btn-primary mobile-touch cursor-pointer flex items-center space-x-3">
                      <Camera className="w-5 h-5" />
                      <span>{formData.passportPreview ? 'Change Photo' : 'Choose Photo'}</span>
                    </label>
                    <p className="text-sm text-secondary">Upload a clear passport-style photograph</p>
                  </div>
                </div>

                {/* Personal Information - Organized Grid */}
                <div>
                  <h3 className="heading-tertiary text-primary mb-6 text-center">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block font-semibold text-primary text-sm">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        className="input-field"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block font-semibold text-primary text-sm">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="input-field"
                        placeholder="Enter your email"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block font-semibold text-primary text-sm">
                        Date of Birth *
                      </label>
                      <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        required
                        className="input-field"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block font-semibold text-primary text-sm">
                        Gender *
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                        className="input-field"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block font-semibold text-primary text-sm">
                        Language
                      </label>
                      <input
                        type="text"
                        name="language"
                        value={formData.language}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="Primary language"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block font-semibold text-primary text-sm">
                        Marital Status
                      </label>
                      <select
                        name="maritalStatus"
                        value={formData.maritalStatus}
                        onChange={handleChange}
                        className="input-field"
                      >
                        <option value="">Select Status</option>
                        <option value="single">Single</option>
                        <option value="married">Married</option>
                        <option value="divorced">Divorced</option>
                        <option value="widowed">Widowed</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Location Information */}
                <div>
                  <h3 className="heading-tertiary text-primary mb-6 text-center">Location Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block font-semibold text-primary text-sm">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                        className="input-field"
                        placeholder="Your state"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block font-semibold text-primary text-sm">
                        Local Government Area (LGA) *
                      </label>
                      <input
                        type="text"
                        name="lga"
                        value={formData.lga}
                        onChange={handleChange}
                        required
                        className="input-field"
                        placeholder="Your LGA"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block font-semibold text-primary text-sm">
                        Ward *
                      </label>
                      <input
                        type="text"
                        name="ward"
                        value={formData.ward}
                        onChange={handleChange}
                        required
                        className="input-field"
                        placeholder="Your ward"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block font-semibold text-primary text-sm">
                        Country *
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        required
                        className="input-field"
                      />
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <label className="block font-semibold text-primary text-sm">
                    Residential Address *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    required
                    className="input-field resize-none"
                    placeholder="Enter your complete residential address"
                  />
                </div>

                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="accent-card bg-red-50 dark:bg-red-900/20 border-l-red-500 text-red-700 dark:text-red-400 text-center"
                    >
                      <p className="font-medium">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Button */}
                <div className="text-center pt-6">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`btn-primary mobile-touch text-lg px-12 py-5 flex items-center justify-center space-x-3 mx-auto ${
                      isLoading ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                    <span>{isLoading ? 'Processing Registration...' : 'Complete Registration'}</span>
                  </button>
                  
                  <p className="text-sm text-secondary mt-4">
                    By registering, you agree to ADYC's terms and conditions
                  </p>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Register;