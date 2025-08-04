import React from 'react';
import { motion } from 'framer-motion';
import Layout from './Layout';
import { Target, Lightbulb, TrendingUp, Users, Globe, Award, ArrowRight } from 'lucide-react';

const About = ({ onNavigate }) => {
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
    <Layout currentPage="about" onNavigate={onNavigate}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8 h-full overflow-y-auto mobile-scroll"
      >
        {/* HEADER SECTION */}
        <motion.div variants={itemVariants} className="text-center py-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-4">
            About ADYC
          </h1>
          <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto leading-relaxed">
            Empowering Nigerian youth to shape the future through democratic participation and community development.
          </p>
        </motion.div>

        {/* INTRODUCING ADYC SECTION */}
        <motion.div variants={itemVariants} className="floating-card p-8">
          <div className="flex items-center mb-6">
            <Users className="w-8 h-8 mr-3 text-primary-500" />
            <h2 className="text-3xl font-bold text-neutral-800 dark:text-white">
              Introducing ADYC: A Unified Platform for National Development
            </h2>
          </div>
          
          <div className="space-y-6 text-neutral-700 dark:text-neutral-300 leading-relaxed">
            <p className="text-lg">
              African Democratic Youth Congress (ADYC), a newly formed and formidable coalition of diverse youth political movements spanning all six geopolitical zones of Nigeria. Born from a shared commitment to national progress, ADYC represents a strategic consolidation of youth energy, talent, and aspirations, dedicated to fostering active and meaningful participation of young Nigerians in our democratic process and national development.
            </p>
            
            <p>
              The core vision of ADYC is to empower a new generation of responsible and ethical leaders who will actively shape a democratic, equitable, and prosperous Nigeria. Our mission encompasses mobilising and unifying youth, providing comprehensive political education and leadership training, advocating for youth-centric policies, and driving initiatives that contribute directly to socio-economic growth, job creation, and national unity.
            </p>

            <div className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-xl p-6 my-8">
              <h3 className="text-xl font-bold text-neutral-800 dark:text-white mb-4">Strategic Benefits of ADYC:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: "Expanded Grassroots Mobilisation",
                    description: "A structured, nationwide network of passionate youth, ensuring unprecedented grassroots reach and voter engagement across all 36 states and the FCT."
                  },
                  {
                    title: "Enhanced Electoral Strength", 
                    description: "A dedicated, organised youth base capable of driving voter registration, turnout, and active campaigning, translating into tangible electoral advantages."
                  },
                  {
                    title: "Youth-Centric Policy Development",
                    description: "Direct access to the pulse of Nigerian youth, enabling the party to formulate and champion policies that genuinely address the needs and aspirations of the largest demographic segment."
                  },
                  {
                    title: "Future Leadership Pipeline",
                    description: "A robust platform for identifying, nurturing, and integrating future political leaders into the party structure, ensuring long-term sustainability and relevance."
                  },
                  {
                    title: "Credibility & Public Trust",
                    description: "A demonstration of ADC's commitment to inclusive politics and youth empowerment, enhancing the party's image and appeal among the populace."
                  }
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white/50 dark:bg-neutral-800/30 rounded-lg p-4 border border-neutral-200/30 dark:border-neutral-700/30"
                  >
                    <h4 className="font-semibold text-primary-600 dark:text-primary-400 mb-2">{benefit.title}</h4>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">{benefit.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <p>
              ADYC is poised to become the most impactful youth political congress in Nigeria, unifying various platforms from the North-West, North-East, North-Central, South-West, South-East, and South-South. We are confident that our collective strength and structured approach will be an invaluable asset to the ADC Party, driving mutual success and contributing significantly to the betterment of our beloved nation.
            </p>

            <div className="border-l-4 border-primary-500 pl-6 italic bg-primary-50/50 dark:bg-primary-900/20 p-4 rounded-r-lg">
              <p className="mb-4">
                Thank you for your time and consideration. We look forward to your positive response and the prospect of a fruitful collaboration.
              </p>
              <p className="font-bold text-neutral-800 dark:text-white">
                Murtala Haliru Dantoro<br/>
                <span className="text-primary-600 dark:text-primary-400">DG ADYC</span>
              </p>
            </div>
          </div>
        </motion.div>

        {/* AIM, OBJECTIVES, GOALS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* OUR AIM */}
          <motion.div variants={itemVariants} className="floating-card p-8">
            <div className="flex items-center mb-6">
              <Target className="w-8 h-8 mr-3 text-primary-500" />
              <h2 className="text-2xl font-bold text-neutral-800 dark:text-white">Our Aim</h2>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              The African Democratic Youth Congress (ADYC) aims to empower the youth of Nigeria and Africa to become active, responsible, and impactful citizens. We seek to foster a generation of leaders who are committed to democratic values, sustainable development, and social justice.
            </p>
          </motion.div>

          {/* OUR OBJECTIVES */}
          <motion.div variants={itemVariants} className="floating-card p-8">
            <div className="flex items-center mb-6">
              <Lightbulb className="w-8 h-8 mr-3 text-secondary-500" />
              <h2 className="text-2xl font-bold text-neutral-800 dark:text-white">Our Objectives</h2>
            </div>
            <ul className="space-y-3 text-neutral-600 dark:text-neutral-400">
              {[
                "To promote youth leadership and participation in governance.",
                "To drive innovation and collaboration among young people for community development.",
                "To enhance social skills and civic engagement through educational initiatives.",
                "To advocate for policies that prioritize youth development and empowerment.",
                "To build a strong network of young democrats across Africa."
              ].map((objective, index) => (
                <motion.li 
                  key={index}
                  whileHover={{ x: 5 }}
                  className="flex items-start space-x-2 cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4 mt-1 text-primary-500 flex-shrink-0" />
                  <span>{objective}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* OUR GOALS */}
          <motion.div variants={itemVariants} className="floating-card p-8">
            <div className="flex items-center mb-6">
              <TrendingUp className="w-8 h-8 mr-3 text-primary-500" />
              <h2 className="text-2xl font-bold text-neutral-800 dark:text-white">Our Goals</h2>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              By 2030, ADYC aims to establish a presence in all major regions of Nigeria, fostering over 1 million active youth members who are directly contributing to nation-building. We envision a future where African youth are at the forefront of socio-economic and political transformation.
            </p>
            
            <div className="mt-6 space-y-3">
              <div className="flex items-center space-x-3">
                <Globe className="w-5 h-5 text-secondary-500" />
                <span className="text-neutral-700 dark:text-neutral-300 font-medium">National Coverage</span>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-primary-500" />
                <span className="text-neutral-700 dark:text-neutral-300 font-medium">1M+ Active Members</span>
              </div>
              <div className="flex items-center space-x-3">
                <Award className="w-5 h-5 text-secondary-500" />
                <span className="text-neutral-700 dark:text-neutral-300 font-medium">Leadership Excellence</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* VALUES SECTION */}
        <motion.div variants={itemVariants} className="floating-card p-8 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20">
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Unity", description: "Beyond religion, beyond tribe - united for Nigeria's progress" },
              { title: "Democracy", description: "Promoting democratic values and participatory governance" },
              { title: "Innovation", description: "Embracing new ideas and technological advancement" },
              { title: "Integrity", description: "Ethical leadership and transparent governance" }
            ].map((value, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -5 }}
                className="text-center p-6 bg-white/50 dark:bg-neutral-800/30 rounded-xl border border-neutral-200/30 dark:border-neutral-700/30"
              >
                <h3 className="text-xl font-bold text-neutral-800 dark:text-white mb-3">{value.title}</h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CALL TO ACTION */}
        <motion.div 
          variants={itemVariants}
          className="floating-card p-8 text-center"
        >
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            Ready to Make a Difference?
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-6 max-w-2xl mx-auto">
            Join ADYC today and be part of the movement that's shaping Nigeria's democratic future. Together, we can build a better tomorrow for all Nigerians.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate('register')}
              className="neumorphic-button bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all mobile-button"
            >
              Join ADYC Now
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate('contact')}
              className="neumorphic-button bg-white/50 dark:bg-neutral-800/30 text-neutral-700 dark:text-neutral-300 font-semibold py-3 px-8 rounded-xl border border-neutral-200/50 dark:border-neutral-600/50 mobile-button"
            >
              Contact Us
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default About;