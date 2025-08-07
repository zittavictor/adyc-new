import React from 'react';
import { motion } from 'framer-motion';
import Layout from './Layout';
import SpinningLogo from './SpinningLogo';
import { ArrowRight, Users, Target, BookOpen, Award, Lightbulb, TrendingUp, Star, Heart, Zap } from 'lucide-react';
import { blogPosts, events, executiveMembers } from '../data/mockData';

const Home = ({ onNavigate }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.25, 0.25, 0.25, 0.75]
      }
    }
  };

  // Human-designed feature set with varied visual treatment
  const features = [
    {
      icon: Users,
      title: 'Youth Leadership Development',
      description: 'Comprehensive programs designed to nurture the next generation of ethical leaders who will drive Nigeria\'s democratic progress.',
      accent: 'orange',
      size: 'large' // Featured card
    },
    {
      icon: Target,
      title: 'Democratic Participation',
      description: 'Active engagement across all six geopolitical zones, ensuring every voice contributes to national development.',
      accent: 'green',
      size: 'medium'
    },
    {
      icon: Lightbulb,
      title: 'Innovation Hub',
      description: 'Collaborative spaces where young minds solve Nigeria\'s most pressing challenges through creative solutions.',
      accent: 'blue',
      size: 'medium'
    },
    {
      icon: BookOpen,
      title: 'Political Education',
      description: 'Comprehensive training programs on governance, policy-making, and civic responsibility.',
      accent: 'purple',
      size: 'small'
    },
    {
      icon: Award,
      title: 'Recognition Programs',
      description: 'Celebrating outstanding contributions to community development and youth empowerment initiatives.',
      accent: 'amber',
      size: 'small'
    },
    {
      icon: TrendingUp,
      title: 'Future Pathways',
      description: 'Clear roadmaps to leadership roles in politics, business, and social impact sectors.',
      accent: 'teal',
      size: 'small'
    }
  ];

  return (
    <Layout currentPage="home" onNavigate={onNavigate}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-24 h-full overflow-y-auto smooth-scroll relative"
      >
        {/* HERO SECTION - Asymmetric, Human-Designed Layout */}
        <motion.section 
          variants={itemVariants}
          className="relative py-20 px-6"
        >
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-br from-orange-500/10 to-green-500/10 rounded-full blur-3xl animate-float-gentle"></div>
            <div className="absolute bottom-20 left-10 w-48 h-48 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-full blur-3xl animate-float-gentle" style={{animationDelay: '2s'}}></div>
          </div>
          
          <div className="container-custom relative z-10">
            <div className="asymmetric-grid items-center">
              {/* Text Content - Spans 7 columns */}
              <div className="col-span-12 lg:col-span-7 space-y-8">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                >
                  <h1 className="display-text text-primary">
                    Welcome to{' '}
                    <span className="text-accent hand-drawn-accent">ADYC</span>
                  </h1>
                </motion.div>
                
                <motion.p
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="body-large text-secondary max-w-2xl"
                >
                  Empowering Nigerian youth to become active, responsible, and impactful citizens. 
                  Join the movement for democratic participation and national development.
                </motion.p>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.8 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <button
                    onClick={() => onNavigate('register')}
                    className="btn-primary mobile-touch group"
                  >
                    <span>Join ADYC Today</span>
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button
                    onClick={() => onNavigate('about')}
                    className="btn-secondary mobile-touch"
                  >
                    Learn More
                  </button>
                </motion.div>
                
                {/* Trust indicators */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                  className="flex items-center space-x-6 text-sm text-secondary pt-6"
                >
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-amber-500 fill-current" />
                    <span>Nationwide Coverage</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-green-500" />
                    <span>1000+ Active Members</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    <span>Community Focused</span>
                  </div>
                </motion.div>
              </div>
              
              {/* Logo Section - Spans 5 columns, offset */}
              <div className="col-span-12 lg:col-span-5 flex justify-center lg:justify-end relative">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                  className="relative"
                >
                  <SpinningLogo size={200} />
                  {/* Decorative ring */}
                  <div className="absolute inset-0 rounded-full border-2 border-orange-500/20 animate-pulse" style={{transform: 'scale(1.2)'}}></div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* FEATURES SECTION - Masonry-style Layout */}
        <motion.section variants={itemVariants} className="section-spacing">
          <div className="container-custom">
            <div className="text-center mb-16">
              <motion.h2 
                className="heading-primary text-primary mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Why Join <span className="text-accent">ADYC?</span>
              </motion.h2>
              <motion.p 
                className="body-large text-secondary max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                Discover the opportunities that await you as part of Nigeria's most dynamic youth political movement.
              </motion.p>
            </div>

            {/* Sophisticated Feature Grid - Human Layout */}
            <div className="grid grid-cols-12 gap-6 lg:gap-8">
              {/* Featured large card */}
              <motion.div
                className="col-span-12 lg:col-span-8"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ 
                  scale: 1.02, 
                  transition: { duration: 0.3 } 
                }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="featured-card group cursor-pointer hover:shadow-2xl transition-all duration-500" onClick={() => onNavigate('about')}>
                  <div className="flex items-start space-x-6">
                    <div className="flex-shrink-0">
                      <motion.div 
                        className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center text-white shadow-accent"
                        whileHover={{ 
                          rotate: 5,
                          scale: 1.1,
                          transition: { duration: 0.3 }
                        }}
                      >
                        <Users className="w-8 h-8" />
                      </motion.div>
                    </div>
                    <div className="flex-1">
                      <h3 className="heading-tertiary text-primary mb-4 group-hover:text-accent transition-colors duration-300">
                        Youth Leadership Development
                      </h3>
                      <p className="body-text text-secondary mb-6">
                        Comprehensive programs designed to nurture the next generation of ethical leaders who will drive Nigeria's democratic progress through innovation, collaboration, and community engagement.
                      </p>
                      <motion.div 
                        className="flex items-center text-accent font-semibold"
                        initial={{ x: 0 }}
                        whileHover={{ x: 8 }}
                        transition={{ duration: 0.3 }}
                      >
                        <span>Learn More</span>
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Side feature */}
              <motion.div
                className="col-span-12 lg:col-span-4"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                whileHover={{ 
                  y: -8, 
                  transition: { duration: 0.3 } 
                }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="modern-card h-full group cursor-pointer hover:shadow-xl transition-all duration-500" onClick={() => onNavigate('register')}>
                  <motion.div 
                    className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white mb-6"
                    whileHover={{ 
                      scale: 1.1,
                      rotate: 3,
                      transition: { duration: 0.3 }
                    }}
                  >
                    <Target className="w-6 h-6" />
                  </motion.div>
                  <h3 className="heading-tertiary text-primary mb-4 group-hover:text-accent transition-colors duration-300">
                    Democratic Participation
                  </h3>
                  <p className="body-text text-secondary">
                    Active engagement across all six geopolitical zones, ensuring every voice contributes to national development.
                  </p>
                </div>
              </motion.div>

              {/* Bottom row - varied sizes */}
              <motion.div
                className="col-span-12 lg:col-span-5"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="accent-card group cursor-pointer" onClick={() => onNavigate('blog')}>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white mb-6">
                    <Lightbulb className="w-6 h-6" />
                  </div>
                  <h3 className="heading-tertiary text-primary mb-3 group-hover:text-accent transition-colors">
                    Innovation Hub
                  </h3>
                  <p className="body-text text-secondary">
                    Collaborative spaces where young minds solve Nigeria's most pressing challenges through creative solutions.
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="col-span-12 lg:col-span-3"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="modern-card text-center group cursor-pointer" onClick={() => onNavigate('about')}>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white mb-4 mx-auto">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-primary mb-3 group-hover:text-accent transition-colors">
                    Political Education
                  </h3>
                  <p className="caption-text text-secondary">
                    Comprehensive training on governance and civic responsibility.
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="col-span-12 lg:col-span-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="modern-card group cursor-pointer" onClick={() => onNavigate('executives')}>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center text-white">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-primary group-hover:text-accent transition-colors">
                        Recognition Programs
                      </h3>
                    </div>
                  </div>
                  <p className="caption-text text-secondary">
                    Celebrating outstanding contributions to community development and youth empowerment.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* BLOG PREVIEW SECTION - Asymmetric Layout */}
        <motion.section variants={itemVariants} className="bg-accent-subtle">
          <div className="container-custom section-spacing">
            <div className="asymmetric-grid items-center mb-12">
              <div className="col-span-12 lg:col-span-8">
                <h2 className="heading-primary text-primary mb-4">
                  Latest <span className="text-accent">Updates</span>
                </h2>
                <p className="body-large text-secondary">
                  Stay informed with our latest insights, news, and community stories that matter to Nigerian youth.
                </p>
              </div>
              <div className="col-span-12 lg:col-span-4 flex justify-start lg:justify-end">
                <button
                  onClick={() => onNavigate('blog')}
                  className="btn-text flex items-center space-x-2 group"
                >
                  <span>View All Posts</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-6 lg:gap-8">
              {blogPosts.slice(0, 2).map((post, index) => (
                <motion.div
                  key={post.id}
                  className={`col-span-12 ${index === 0 ? 'lg:col-span-7' : 'lg:col-span-5'}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <article 
                    className="modern-card group cursor-pointer h-full overflow-hidden"
                    onClick={() => onNavigate('blog')}
                  >
                    <div className="aspect-video bg-slate-200 dark:bg-slate-700 rounded-xl mb-6 overflow-hidden">
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    </div>
                    <div className="flex items-center text-sm text-secondary mb-3">
                      <time>{post.date}</time>
                      <span className="mx-2">•</span>
                      <span>{post.author}</span>
                    </div>
                    <h3 className="heading-tertiary text-primary mb-4 group-hover:text-accent transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="body-text text-secondary mb-6 line-clamp-3">
                      {post.summary}
                    </p>
                    <div className="flex items-center text-accent font-semibold group-hover:translate-x-2 transition-transform">
                      <span>Read Article</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </article>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* LEADERSHIP PREVIEW - Minimal, Clean Design */}
        <motion.section variants={itemVariants} className="section-spacing">
          <div className="container-custom">
            <div className="text-center mb-16">
              <motion.h2 
                className="heading-primary text-primary mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Our <span className="text-accent">Leadership</span>
              </motion.h2>
              <motion.p 
                className="body-large text-secondary max-w-2xl mx-auto mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                Meet the dedicated individuals driving positive change across Nigeria's six geopolitical zones.
              </motion.p>
              <motion.button
                onClick={() => onNavigate('executives')}
                className="btn-secondary mobile-touch"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                Meet the Team
              </motion.button>
            </div>

            {/* Clean leadership grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {executiveMembers.slice(0, 4).map((member, index) => (
                <motion.div
                  key={member.id}
                  className="text-center group cursor-pointer"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  onClick={() => onNavigate('executives')}
                >
                  <div className="relative mb-4">
                    <div className="w-24 h-24 mx-auto rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-700 shadow-moderate group-hover:shadow-strong transition-all duration-300">
                      {member.image ? (
                        <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Users className="w-8 h-8 text-slate-400" />
                        </div>
                      )}
                    </div>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <h3 className="font-semibold text-primary mb-1 group-hover:text-accent transition-colors">
                    {member.name}
                  </h3>
                  <p className="caption-text text-accent font-medium">
                    {member.role}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* FINAL CTA - Premium Design */}
        <motion.section 
          variants={itemVariants}
          className="relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-green-500/5"></div>
          <div className="container-custom section-spacing relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <Zap className="w-16 h-16 text-accent mx-auto mb-8 animate-bounce-subtle" />
                <h2 className="display-text text-primary mb-8">
                  Ready to Make a <span className="text-accent hand-drawn-accent">Difference?</span>
                </h2>
                <p className="body-large text-secondary mb-12 max-w-2xl mx-auto">
                  Join thousands of young Nigerians who are actively shaping the future of our nation through democratic participation and community development.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <button
                    onClick={() => onNavigate('register')}
                    className="btn-primary mobile-touch text-lg px-12 py-5"
                  >
                    Start Your Journey Today
                  </button>
                  <button
                    onClick={() => onNavigate('contact')}
                    className="btn-secondary mobile-touch text-lg px-12 py-5"
                  >
                    Get in Touch
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>
      </motion.div>
    </Layout>
  );
};

export default Home;