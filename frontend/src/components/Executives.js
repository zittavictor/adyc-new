import React from 'react';
import { motion } from 'framer-motion';
import Layout from './Layout';
import { Facebook, Twitter, Linkedin, Users, Award, Target, Mail } from 'lucide-react';
import { executiveMembers } from '../data/mockData';

const Executives = ({ onNavigate }) => {
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

  return (
    <Layout currentPage="executives" onNavigate={onNavigate}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8 h-full overflow-y-auto mobile-scroll"
      >
        {/* HEADER SECTION */}
        <motion.div variants={itemVariants} className="text-center py-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-4">
            Meet Our Leadership Team
          </h1>
          <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto leading-relaxed">
            A diverse and passionate group of leaders dedicated to empowering Nigerian youth and driving democratic participation across all six geopolitical zones.
          </p>
        </motion.div>

        {/* LEADERSHIP OVERVIEW */}
        <motion.div variants={itemVariants} className="floating-card p-8 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="space-y-3">
              <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 flex items-center justify-center">
                <Users className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-800 dark:text-white">Unified Leadership</h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Bringing together leaders from all six geopolitical zones for inclusive representation.
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-br from-secondary-100 to-secondary-200 dark:from-secondary-900/30 dark:to-secondary-800/30 flex items-center justify-center">
                <Target className="w-8 h-8 text-secondary-600 dark:text-secondary-400" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-800 dark:text-white">Strategic Vision</h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Focused on long-term strategies for youth empowerment and national development.
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 flex items-center justify-center">
                <Award className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-800 dark:text-white">Proven Experience</h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Years of experience in community development, education, and political strategy.
              </p>
            </div>
          </div>
        </motion.div>

        {/* EXECUTIVE MEMBERS GRID */}
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {executiveMembers.map((member, index) => (
              <motion.div
                key={member.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -5 }}
                className="floating-card p-8 text-center group"
              >
                {/* Member Photo */}
                <div className="relative mb-6">
                  <div className="w-32 h-32 rounded-full mx-auto neumorphic-inset flex items-center justify-center overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-700 dark:to-neutral-800">
                    {member.image ? (
                      <motion.img 
                        src={member.image} 
                        alt={member.name} 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        whileHover={{ scale: 1.1 }}
                      />
                    ) : (
                      <Users className="w-16 h-16 text-neutral-500 dark:text-neutral-400" />
                    )}
                  </div>
                  
                  {/* Status Indicator */}
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <div className="px-3 py-1 bg-gradient-to-r from-secondary-500 to-primary-500 text-white text-xs font-medium rounded-full">
                      Active
                    </div>
                  </div>
                </div>

                {/* Member Information */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-primary-600 dark:text-primary-400 font-semibold text-lg mb-2">
                      {member.role}
                    </p>
                    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {member.description}
                    </p>
                  </div>

                  {/* Bio Section */}
                  <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg p-4">
                    <p className="text-sm text-neutral-700 dark:text-neutral-300 italic">
                      "{member.bio}"
                    </p>
                  </div>

                  {/* Contact Information */}
                  <div className="flex items-center justify-center space-x-2 text-neutral-500 dark:text-neutral-400">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">Available for consultation</span>
                  </div>

                  {/* Social Media Links */}
                  <div className="flex justify-center space-x-4 pt-4">
                    {member.social.facebook && (
                      <motion.a
                        href={member.social.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-10 h-10 rounded-full bg-blue-500/10 hover:bg-blue-500/20 flex items-center justify-center text-blue-600 hover:text-blue-700 transition-colors mobile-button"
                      >
                        <Facebook className="w-5 h-5" />
                      </motion.a>
                    )}
                    {member.social.twitter && (
                      <motion.a
                        href={member.social.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-10 h-10 rounded-full bg-blue-400/10 hover:bg-blue-400/20 flex items-center justify-center text-blue-500 hover:text-blue-600 transition-colors mobile-button"
                      >
                        <Twitter className="w-5 h-5" />
                      </motion.a>
                    )}
                    {member.social.linkedin && (
                      <motion.a
                        href={member.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-10 h-10 rounded-full bg-blue-700/10 hover:bg-blue-700/20 flex items-center justify-center text-blue-700 hover:text-blue-800 transition-colors mobile-button"
                      >
                        <Linkedin className="w-5 h-5" />
                      </motion.a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CALL TO ACTION */}
        <motion.div 
          variants={itemVariants}
          className="floating-card p-8 text-center bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20"
        >
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            Want to Join Our Leadership?
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-6 max-w-2xl mx-auto">
            ADYC is always looking for passionate young leaders who are committed to making a difference. 
            Join us in shaping the future of Nigeria.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate('register')}
              className="neumorphic-button bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all mobile-button"
            >
              Become a Member
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate('contact')}
              className="neumorphic-button bg-white/50 dark:bg-neutral-800/30 text-neutral-700 dark:text-neutral-300 font-semibold py-3 px-8 rounded-xl border border-neutral-200/50 dark:border-neutral-600/50 mobile-button"
            >
              Contact Leadership
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default Executives;