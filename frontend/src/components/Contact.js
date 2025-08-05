import React from 'react';
import { motion } from 'framer-motion';
import Layout from './Layout';
import { Mail, Phone, MapPin, Clock, Users, Target, Heart } from 'lucide-react';

const Contact = ({ onNavigate }) => {
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

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Address",
      content: "africandemocraticyouthcongress@gmail.com",
      description: "Send us your questions, concerns, or suggestions"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Our Reach",
      content: "Nationwide Coverage",
      description: "Operating across all states in Nigeria"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Membership",
      content: "Open to All Nigerian Youth",
      description: "Join the movement for democratic change"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Our Mission",
      content: "Youth Empowerment & Democratic Participation",
      description: "Building a better Nigeria through active youth engagement"
    }
  ];

  const officeHours = [
    { day: "Monday - Friday", hours: "8:00 AM - 6:00 PM" },
    { day: "Saturday", hours: "9:00 AM - 4:00 PM" },
    { day: "Sunday", hours: "By Appointment Only" }
  ];

  return (
    <Layout currentPage="contact" onNavigate={onNavigate}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8 h-full overflow-y-auto mobile-scroll"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-4">
            Contact ADYC
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-lg max-w-2xl mx-auto">
            Get in touch with the African Democratic Youth Congress. We're here to support youth 
            participation in Nigeria's democratic process.
          </p>
        </motion.div>

        {/* Logo Section */}
        <motion.div variants={itemVariants} className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden neumorphic">
            <img 
              src="https://customer-assets.emergentagent.com/job_c6e56cf6-bfc9-4e7f-baab-fad031a53cd0/artifacts/wqccelzo_ADYC%20LOGO%202-1.jpg" 
              alt="ADYC Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-2">
            African Democratic Youth Congress
          </h2>
          <p className="text-lg font-medium text-secondary-600 dark:text-secondary-400 italic">
            "Arise, It's Youth O'Clock!"
          </p>
        </motion.div>

        {/* Contact Information Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contactInfo.map((info, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="floating-card p-6 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start space-x-4">
                <div className="neumorphic-button bg-gradient-to-r from-primary-500 to-secondary-500 text-white p-3 rounded-xl">
                  {info.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-neutral-800 dark:text-white mb-2">
                    {info.title}
                  </h3>
                  <p className="text-primary-600 dark:text-primary-400 font-medium mb-2">
                    {info.content}
                  </p>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                    {info.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Office Hours Section */}
        <motion.div variants={itemVariants} className="floating-card p-8">
          <div className="text-center mb-6">
            <div className="neumorphic-button bg-gradient-to-r from-secondary-500 to-primary-500 text-white p-4 rounded-full inline-flex mx-auto mb-4">
              <Clock className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-neutral-800 dark:text-white mb-2">
              Contact Hours
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              Best times to reach out to our team
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {officeHours.map((schedule, index) => (
              <div 
                key={index}
                className="neumorphic bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 p-4 rounded-xl text-center"
              >
                <h4 className="font-semibold text-neutral-800 dark:text-white mb-2">
                  {schedule.day}
                </h4>
                <p className="text-primary-600 dark:text-primary-400 font-medium">
                  {schedule.hours}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action Section */}
        <motion.div variants={itemVariants} className="floating-card p-8 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="neumorphic-button bg-gradient-to-r from-primary-500 to-secondary-500 text-white p-4 rounded-full inline-flex mx-auto mb-6">
              <Heart className="w-8 h-8" />
            </div>
            
            <h3 className="text-2xl font-bold text-neutral-800 dark:text-white mb-4">
              Join the Movement
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-lg mb-6">
              Ready to make a difference? Register as a member and be part of Nigeria's 
              democratic transformation through youth engagement.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate('register')}
                className="neumorphic-button bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all mobile-button"
              >
                Register Now
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate('about')}
                className="neumorphic-button bg-white/50 dark:bg-neutral-800/30 text-neutral-700 dark:text-neutral-300 font-semibold py-3 px-8 rounded-xl border border-neutral-200/50 dark:border-neutral-600/50 mobile-button"
              >
                Learn More
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.div variants={itemVariants} className="text-center py-6">
          <p className="text-neutral-500 dark:text-neutral-500 text-sm">
            For urgent matters, please email us directly. We typically respond within 24-48 hours.
          </p>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default Contact;