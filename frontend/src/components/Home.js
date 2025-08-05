import React from 'react';
import { motion } from 'framer-motion';
import Layout from './Layout';
import SpinningLogo from './SpinningLogo';
import ThreeJSBackground from './ThreeJSBackground';
import { ThreeJSTextBackground } from './ThreeJSText';
import { ArrowRight, Users, Target, BookOpen, Award, Lightbulb, TrendingUp } from 'lucide-react';
import { blogPosts, events, executiveMembers } from '../data/mockData';

const Home = ({ onNavigate }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <Layout currentPage="home" onNavigate={onNavigate}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8 h-full overflow-y-auto mobile-scroll"
      >
        {/* HERO SECTION */}
        <motion.div 
          variants={itemVariants}
          className="text-center py-12 px-6"
        >
          {/* Spinning Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <SpinningLogo size={120} />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 bg-clip-text text-transparent">
              Welcome to ADYC
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-xl text-neutral-600 dark:text-neutral-400 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Empowering Nigerian youth to become active, responsible, and impactful citizens. 
            Join the movement for democratic participation and national development.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate('register')}
              className="neumorphic-button bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2 mobile-button"
            >
              <span>Join ADYC Today</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate('about')}
              className="neumorphic-button bg-white/50 dark:bg-neutral-800/30 text-neutral-700 dark:text-neutral-300 font-semibold py-4 px-8 rounded-xl border border-neutral-200/50 dark:border-neutral-600/50 hover:border-primary-300 dark:hover:border-primary-600 transition-all mobile-button"
            >
              Learn More
            </motion.button>
          </motion.div>
        </motion.div>

        {/* KEY FEATURES GRID */}
        <motion.div variants={itemVariants}>
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            Why Join ADYC?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Users,
                title: 'Youth Leadership',
                description: 'Develop leadership skills and participate actively in governance and community development.',
                color: 'primary'
              },
              {
                icon: Target,
                title: 'Clear Mission',
                description: 'Unite youth across all six geopolitical zones for national progress and democratic participation.',
                color: 'secondary'
              },
              {
                icon: Lightbulb,
                title: 'Innovation & Collaboration',
                description: 'Foster innovation through collaborative approaches to solving national challenges.',
                color: 'primary'
              },
              {
                icon: BookOpen,
                title: 'Educational Programs',
                description: 'Access comprehensive leadership training and political education initiatives.',
                color: 'secondary'
              },
              {
                icon: Award,
                title: 'Recognition',
                description: 'Get recognized for your contributions to community development and youth empowerment.',
                color: 'primary'
              },
              {
                icon: TrendingUp,
                title: 'Future Opportunities',
                description: 'Build a pathway to future leadership roles and political participation.',
                color: 'secondary'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -2 }}
                className="floating-card p-6 text-center group cursor-pointer"
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center ${
                  feature.color === 'primary' 
                    ? 'bg-gradient-to-br from-primary-100 to-primary-200 text-primary-600 dark:from-primary-900/30 dark:to-primary-800/30 dark:text-primary-400' 
                    : 'bg-gradient-to-br from-secondary-100 to-secondary-200 text-secondary-600 dark:from-secondary-900/30 dark:to-secondary-800/30 dark:text-secondary-400'
                } group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-800 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* LATEST BLOG POSTS PREVIEW */}
        <motion.div variants={itemVariants}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Latest Updates
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate('blog')}
              className="text-primary-600 dark:text-primary-400 font-semibold hover:text-primary-700 dark:hover:text-primary-300 transition-colors flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogPosts.slice(0, 2).map((post, index) => (
              <motion.div
                key={post.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="floating-card p-4 group cursor-pointer"
                onClick={() => onNavigate('blog')}
              >
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-48 object-cover rounded-lg mb-4 neumorphic" 
                />
                <div className="flex items-center text-xs text-neutral-500 dark:text-neutral-400 mb-2">
                  <span>{post.date}</span>
                  <span className="mx-2">•</span>
                  <span>{post.author}</span>
                </div>
                <h3 className="font-semibold text-lg text-neutral-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3 line-clamp-3">
                  {post.summary}
                </p>
                <div className="flex items-center text-primary-600 dark:text-primary-400 text-sm font-medium group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">
                  <span>Read More</span>
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* EXECUTIVE TEAM PREVIEW */}
        <motion.div variants={itemVariants}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Our Leadership
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate('executives')}
              className="text-primary-600 dark:text-primary-400 font-semibold hover:text-primary-700 dark:hover:text-primary-300 transition-colors flex items-center space-x-1"
            >
              <span>Meet the Team</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {executiveMembers.map((member, index) => (
              <motion.div
                key={member.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="floating-card p-4 text-center group cursor-pointer"
                onClick={() => onNavigate('executives')}
              >
                <div className="w-20 h-20 rounded-full mx-auto mb-3 neumorphic-inset flex items-center justify-center overflow-hidden">
                  {member.image ? (
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-600 dark:to-neutral-700 flex items-center justify-center">
                      <Users className="w-8 h-8 text-neutral-500 dark:text-neutral-400" />
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-sm text-neutral-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {member.name}
                </h3>
                <p className="text-xs text-primary-600 dark:text-primary-400 font-medium">
                  {member.role}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CALL TO ACTION */}
        <motion.div 
          variants={itemVariants}
          className="text-center py-12 px-6 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-2xl border border-primary-100/50 dark:border-primary-800/50"
        >
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            Ready to Make a Difference?
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-6 max-w-2xl mx-auto">
            Join thousands of young Nigerians who are actively shaping the future of our nation through democratic participation and community development.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('register')}
            className="neumorphic-button bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all mobile-button"
          >
            Start Your Journey Today
          </motion.button>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default Home;