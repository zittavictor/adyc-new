import React from 'react';
import { motion } from 'framer-motion';
import Layout from './Layout';
import { Target, Lightbulb, TrendingUp, Users, Globe, Award, ArrowRight, Heart, Zap, Shield } from 'lucide-react';

const About = ({ onNavigate }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <Layout currentPage="about" onNavigate={onNavigate}>
      <div className="mobile-container prevent-horizontal-scroll">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mobile-section-spacing mobile-scroll-container"
        >
          {/* HERO SECTION - Mobile First Responsive */}
          <motion.section variants={itemVariants} className="text-center px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-6 sm:mb-8"
            >
              <h1 className="display-text-mobile text-black mb-6 sm:mb-8">
                About <span className="text-accent">ADYC</span>
              </h1>
              <p className="body-large-mobile text-black max-w-4xl mx-auto leading-relaxed opacity-80">
                Empowering Nigerian youth to shape the future through democratic participation, 
                innovative leadership, and community-driven development across all six geopolitical zones.
              </p>
            </motion.div>

            {/* Trust Metrics - Mobile Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto mb-8 sm:mb-12"
            >
              <div className="text-center p-4">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-600 mb-1">50K+</div>
                <div className="text-xs sm:text-sm text-black opacity-70">Active Members</div>
              </div>
              <div className="text-center p-4">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600 mb-1">36</div>
                <div className="text-xs sm:text-sm text-black opacity-70">States</div>
              </div>
              <div className="text-center p-4">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600 mb-1">6</div>
                <div className="text-xs sm:text-sm text-black opacity-70">Geopolitical Zones</div>
              </div>
              <div className="text-center p-4">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-600 mb-1">1000+</div>
                <div className="text-xs sm:text-sm text-black opacity-70">Programs</div>
              </div>
            </motion.div>
          </motion.section>

          {/* MAIN INTRODUCTION - Mobile First Responsive */}
          <motion.section variants={itemVariants} className="px-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              <div className="col-span-1 lg:col-span-7">
                <div className="mobile-featured-card">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start mb-6 sm:mb-8">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center text-white shadow-accent mb-4 sm:mb-0 sm:mr-6">
                      <Users className="w-6 h-6 sm:w-8 sm:h-8" />
                    </div>
                    <div className="text-center sm:text-left">
                      <h2 className="heading-primary-mobile text-black mb-2">
                        A Unified Platform for National Development
                      </h2>
                      <p className="text-accent font-semibold text-sm sm:text-base">Introducing ADYC</p>
                    </div>
                  </div>
                  
                  <div className="prose max-w-none text-black leading-relaxed space-y-4 sm:space-y-6">
                    <p className="body-text-mobile">
                      African Democratic Youth Congress (ADYC), a newly formed and formidable coalition of diverse youth political movements spanning all six geopolitical zones of Nigeria. Born from a shared commitment to national progress, ADYC represents a strategic consolidation of youth energy, talent, and aspirations.
                    </p>
                    
                    <p className="body-text-mobile">
                      Our mission is dedicated to fostering active and meaningful participation of young Nigerians in our democratic process and national development. We empower a new generation of responsible and ethical leaders who will actively shape a democratic, equitable, and prosperous Nigeria.
                    </p>

                    <div className="bg-orange-50 rounded-2xl p-4 sm:p-6 my-6 sm:my-8">
                      <h3 className="heading-tertiary-mobile text-black mb-3 sm:mb-4 flex flex-col sm:flex-row items-center sm:items-start">
                        <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-accent mb-2 sm:mb-0 sm:mr-3" />
                        <span>Our Core Mission</span>
                      </h3>
                      <ul className="space-y-2 sm:space-y-3">
                        <li className="flex items-start">
                          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-accent mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-sm sm:text-base text-black">Mobilising and unifying youth across all geopolitical zones</span>
                        </li>
                        <li className="flex items-start">
                          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-accent mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-sm sm:text-base text-black">Providing comprehensive political education and leadership training</span>
                        </li>
                        <li className="flex items-start">
                          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-accent mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-sm sm:text-base text-black">Advocating for youth-centric policies and governance reforms</span>
                        </li>
                        <li className="flex items-start">
                          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-accent mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-sm sm:text-base text-black">Driving initiatives for socio-economic growth and job creation</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-1 lg:col-span-5">
                <div className="space-y-4 sm:space-y-6">
                  <div className="mobile-card bg-gradient-to-br from-green-50 to-blue-50 border-l-4 border-l-green-500">
                    <h3 className="heading-tertiary-mobile text-black mb-3 sm:mb-4 flex flex-col sm:flex-row items-center sm:items-start">
                      <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 mb-2 sm:mb-0 sm:mr-3" />
                      <span className="subheading-uniform">Our Vision</span>
                    </h3>
                    <p className="text-black text-sm sm:text-base opacity-80">
                      To become Africa's most impactful youth political congress, driving democratic transformation and national development through unified action and ethical leadership.
                    </p>
                  </div>

                  <div className="mobile-card bg-gradient-to-br from-orange-50 to-red-50 border-l-4 border-l-orange-500">
                    <h3 className="heading-tertiary-mobile text-black mb-3 sm:mb-4 flex flex-col sm:flex-row items-center sm:items-start">
                      <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 mb-2 sm:mb-0 sm:mr-3" />
                      <span className="subheading-uniform">Our Values</span>
                    </h3>
                    <p className="text-black text-sm sm:text-base opacity-80">
                      Unity beyond religion and tribe, democratic participation, innovative solutions, and transparent governance that serves all Nigerians.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* STRATEGIC BENEFITS - Premium Grid Layout */}
          <motion.section variants={itemVariants}>
            <div className="text-center mb-16">
              <h2 className="heading-primary text-primary mb-6 subheading-uniform">
                Strategic <span className="text-accent">Benefits</span> of ADYC
              </h2>
              <p className="body-large text-secondary max-w-2xl mx-auto">
                Discover how ADYC is transforming Nigeria's political landscape through strategic youth engagement and democratic participation.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[
                {
                  title: "Expanded Grassroots Mobilisation",
                  description: "A structured, nationwide network of passionate youth, ensuring unprecedented grassroots reach and voter engagement across all 36 states and the FCT.",
                  icon: Users,
                  color: "blue"
                },
                {
                  title: "Enhanced Electoral Strength", 
                  description: "A dedicated, organised youth base capable of driving voter registration, turnout, and active campaigning, translating into tangible electoral advantages.",
                  icon: TrendingUp,
                  color: "green"
                },
                {
                  title: "Youth-Centric Policy Development",
                  description: "Direct access to the pulse of Nigerian youth, enabling the formulation and championing of policies that genuinely address the needs and aspirations of the largest demographic segment.",
                  icon: Lightbulb,
                  color: "purple"
                },
                {
                  title: "Future Leadership Pipeline",
                  description: "A robust platform for identifying, nurturing, and integrating future political leaders into the democratic structure, ensuring long-term sustainability and relevance.",
                  icon: Award,
                  color: "amber"
                }
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="featured-card group cursor-pointer"
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <div className="flex items-start space-x-6">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-moderate flex-shrink-0 ${
                      benefit.color === 'blue' ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
                      benefit.color === 'green' ? 'bg-gradient-to-br from-green-500 to-green-600' :
                      benefit.color === 'purple' ? 'bg-gradient-to-br from-purple-500 to-purple-600' :
                      'bg-gradient-to-br from-amber-500 to-amber-600'
                    }`}>
                      <benefit.icon className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <h3 className="heading-tertiary text-primary mb-4 group-hover:text-accent transition-colors subheading-uniform">
                        {benefit.title}
                      </h3>
                      <p className="text-secondary leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* AIM, OBJECTIVES, GOALS - Sophisticated Three Column */}
          <motion.section variants={itemVariants} className="bg-accent-subtle rounded-3xl">
            <div className="container-custom section-spacing">
              <div className="text-center mb-16">
                <h2 className="heading-primary text-primary mb-6 subheading-uniform">
                  Our <span className="text-accent">Foundation</span>
                </h2>
                <p className="body-large text-secondary max-w-2xl mx-auto">
                  Built on clear objectives, strategic aims, and ambitious goals that drive our mission forward.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Our Aim */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="modern-card h-full"
                >
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center text-white shadow-accent mx-auto mb-4">
                      <Target className="w-8 h-8" />
                    </div>
                    <h3 className="heading-tertiary text-primary subheading-uniform">Our Aim</h3>
                  </div>
                  <p className="text-secondary leading-relaxed text-center">
                    To empower the youth of Nigeria and Africa to become active, responsible, and impactful citizens committed to democratic values, sustainable development, and social justice.
                  </p>
                </motion.div>

                {/* Our Objectives */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="modern-card h-full"
                >
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white shadow-moderate mx-auto mb-4">
                      <Lightbulb className="w-8 h-8" />
                    </div>
                    <h3 className="heading-tertiary text-primary subheading-uniform">Our Objectives</h3>
                  </div>
                  <ul className="space-y-3 text-secondary">
                    {[
                      "Promote youth leadership and governance participation",
                      "Drive innovation and collaborative community development",
                      "Enhance civic engagement through educational initiatives",
                      "Advocate for youth-prioritizing policies",
                      "Build strong democratic networks across Africa"
                    ].map((objective, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <div className="w-2 h-2 bg-accent rounded-full mr-3 mt-2 flex-shrink-0"></div>
                        <span>{objective}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Our Goals */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="modern-card h-full"
                >
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white shadow-moderate mx-auto mb-4">
                      <TrendingUp className="w-8 h-8" />
                    </div>
                    <h3 className="heading-tertiary text-primary subheading-uniform">Our Goals</h3>
                  </div>
                  <p className="text-secondary leading-relaxed text-center mb-6">
                    By 2030, establish presence in all major Nigerian regions, fostering over 1 million active youth members directly contributing to nation-building.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-center space-x-3 text-sm">
                      <Globe className="w-5 h-5 text-blue-500" />
                      <span className="text-primary font-medium">National Coverage</span>
                    </div>
                    <div className="flex items-center justify-center space-x-3 text-sm">
                      <Users className="w-5 h-5 text-orange-500" />
                      <span className="text-primary font-medium">1M+ Active Members</span>
                    </div>
                    <div className="flex items-center justify-center space-x-3 text-sm">
                      <Award className="w-5 h-5 text-green-500" />
                      <span className="text-primary font-medium">Leadership Excellence</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.section>

          {/* LEADERSHIP MESSAGE - Premium Design */}
          <motion.section variants={itemVariants}>
            <div className="featured-card bg-gradient-to-br from-slate-50 to-orange-50/30 dark:from-slate-800 dark:to-orange-900/20">
              <div className="text-center mb-8">
                <h2 className="heading-primary text-primary mb-6 subheading-uniform">
                  Leadership <span className="text-accent">Message</span>
                </h2>
              </div>

              <div className="max-w-4xl mx-auto">
                <blockquote className="text-center">
                  <p className="body-large text-secondary italic mb-8 leading-relaxed">
                    "ADYC is poised to become the most impactful youth political congress in Nigeria, 
                    unifying various platforms from all geopolitical zones. We are confident that our 
                    collective strength and structured approach will be an invaluable asset to Nigeria's 
                    democratic development, driving mutual success and contributing significantly to the 
                    betterment of our beloved nation."
                  </p>
                  <footer className="text-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 shadow-accent mx-auto mb-4 flex items-center justify-center text-white text-xl font-bold">
                      MHD
                    </div>
                    <cite className="text-primary font-bold text-lg">
                      Murtala Haliru Dantoro
                    </cite>
                    <div className="text-accent font-semibold">Director General, ADYC</div>
                  </footer>
                </blockquote>
              </div>
            </div>
          </motion.section>

          {/* CALL TO ACTION - Dynamic Design */}
          <motion.section variants={itemVariants}>
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="display-text text-primary mb-8 subheading-uniform">
                  Ready to Make a <span className="text-accent hand-drawn-accent">Difference?</span>
                </h2>
                <p className="body-large text-secondary mb-12 max-w-3xl mx-auto">
                  Join ADYC today and be part of the movement that's actively shaping Nigeria's democratic future. 
                  Together, we can build a better tomorrow for all Nigerians.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <button
                    onClick={() => onNavigate('register')}
                    className="btn-primary mobile-touch text-lg px-12 py-5"
                  >
                    Join ADYC Now
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
          </motion.section>
        </motion.div>
      </div>
    </Layout>
  );
};

export default About;