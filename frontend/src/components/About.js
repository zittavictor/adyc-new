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
      <div className="container-custom">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-24 section-spacing"
        >
          {/* HERO SECTION - Sophisticated Layout */}
          <motion.section variants={itemVariants} className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-8"
            >
              <h1 className="display-text text-primary mb-8">
                About <span className="text-accent hand-drawn-accent">ADYC</span>
              </h1>
              <p className="body-large text-secondary max-w-4xl mx-auto leading-relaxed">
                Empowering Nigerian youth to shape the future through democratic participation, 
                innovative leadership, and community-driven development across all six geopolitical zones.
              </p>
            </motion.div>

            {/* Trust Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-accent mb-2">1000+</div>
                <div className="caption-text text-secondary">Active Members</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent mb-2">36</div>
                <div className="caption-text text-secondary">States Coverage</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent mb-2">6</div>
                <div className="caption-text text-secondary">Geopolitical Zones</div>
              </div>
            </motion.div>
          </motion.section>

          {/* MAIN INTRODUCTION - Asymmetric Design */}
          <motion.section variants={itemVariants}>
            <div className="asymmetric-grid items-center gap-12">
              <div className="col-span-12 lg:col-span-7">
                <div className="featured-card">
                  <div className="flex items-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center text-white shadow-accent mr-6">
                      <Users className="w-8 h-8" />
                    </div>
                    <div>
                      <h2 className="heading-primary text-primary mb-2">
                        A Unified Platform for National Development
                      </h2>
                      <p className="text-accent font-semibold">Introducing ADYC</p>
                    </div>
                  </div>
                  
                  <div className="prose max-w-none text-secondary leading-relaxed space-y-6">
                    <p className="body-text">
                      African Democratic Youth Congress (ADYC), a newly formed and formidable coalition of diverse youth political movements spanning all six geopolitical zones of Nigeria. Born from a shared commitment to national progress, ADYC represents a strategic consolidation of youth energy, talent, and aspirations.
                    </p>
                    
                    <p className="body-text">
                      Our mission is dedicated to fostering active and meaningful participation of young Nigerians in our democratic process and national development. We empower a new generation of responsible and ethical leaders who will actively shape a democratic, equitable, and prosperous Nigeria.
                    </p>

                    <div className="bg-accent-subtle rounded-2xl p-6 my-8">
                      <h3 className="heading-tertiary text-primary mb-4 flex items-center">
                        <Zap className="w-6 h-6 text-accent mr-3" />
                        Our Core Mission
                      </h3>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <ArrowRight className="w-5 h-5 text-accent mr-3 mt-0.5 flex-shrink-0" />
                          <span>Mobilising and unifying youth across all geopolitical zones</span>
                        </li>
                        <li className="flex items-start">
                          <ArrowRight className="w-5 h-5 text-accent mr-3 mt-0.5 flex-shrink-0" />
                          <span>Providing comprehensive political education and leadership training</span>
                        </li>
                        <li className="flex items-start">
                          <ArrowRight className="w-5 h-5 text-accent mr-3 mt-0.5 flex-shrink-0" />
                          <span>Advocating for youth-centric policies and governance reforms</span>
                        </li>
                        <li className="flex items-start">
                          <ArrowRight className="w-5 h-5 text-accent mr-3 mt-0.5 flex-shrink-0" />
                          <span>Driving initiatives for socio-economic growth and job creation</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-12 lg:col-span-5">
                <div className="space-y-6">
                  <div className="modern-card bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-l-4 border-l-green-500">
                    <h3 className="heading-tertiary text-primary mb-4 flex items-center">
                      <Shield className="w-6 h-6 text-green-500 mr-3" />
                      Our Vision
                    </h3>
                    <p className="text-secondary">
                      To become Africa's most impactful youth political congress, driving democratic transformation and national development through unified action and ethical leadership.
                    </p>
                  </div>

                  <div className="modern-card bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-l-4 border-l-orange-500">
                    <h3 className="heading-tertiary text-primary mb-4 flex items-center">
                      <Heart className="w-6 h-6 text-red-500 mr-3" />
                      Our Values
                    </h3>
                    <p className="text-secondary">
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
              <h2 className="heading-primary text-primary mb-6">
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
                      <h3 className="heading-tertiary text-primary mb-4 group-hover:text-accent transition-colors">
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
                <h2 className="heading-primary text-primary mb-6">
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
                    <h3 className="heading-tertiary text-primary">Our Aim</h3>
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
                    <h3 className="heading-tertiary text-primary">Our Objectives</h3>
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
                    <h3 className="heading-tertiary text-primary">Our Goals</h3>
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
                <h2 className="heading-primary text-primary mb-6">
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
                <h2 className="display-text text-primary mb-8">
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