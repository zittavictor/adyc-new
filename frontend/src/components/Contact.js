import React from 'react';
import { motion } from 'framer-motion';
import Layout from './Layout';
import { Mail, Phone, MapPin, Clock, Users, Target, Heart, Shield, Zap, Award } from 'lucide-react';

const Contact = ({ onNavigate }) => {
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

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Address",
      content: "africandemocraticyouthcongress@gmail.com",
      description: "Send us your questions, concerns, or suggestions",
      color: "blue"
    },
    {
      icon: MapPin,
      title: "Our Reach",
      content: "Nationwide Coverage",
      description: "Operating across all 36 states in Nigeria",
      color: "green"
    },
    {
      icon: Users,
      title: "Membership",
      content: "Open to All Nigerian Youth",
      description: "Join the movement for democratic change",
      color: "orange"
    },
    {
      icon: Target,
      title: "Our Mission",
      content: "Youth Empowerment & Democratic Participation",
      description: "Building a better Nigeria through active youth engagement",
      color: "purple"
    }
  ];

  const officeHours = [
    { day: "Monday - Friday", hours: "8:00 AM - 6:00 PM" },
    { day: "Saturday", hours: "9:00 AM - 4:00 PM" },
    { day: "Sunday", hours: "By Appointment Only" }
  ];

  return (
    <Layout currentPage="contact" onNavigate={onNavigate}>
      <div className="container-custom">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-24 section-spacing"
        >
          {/* HEADER SECTION */}
          <motion.section variants={itemVariants} className="text-center">
            <h1 className="display-text text-primary mb-8">
              Contact <span className="text-accent hand-drawn-accent">ADYC</span>
            </h1>
            <p className="body-large text-secondary max-w-3xl mx-auto mb-12">
              Get in touch with the African Democratic Youth Congress. We're here to support youth 
              participation in Nigeria's democratic process and answer any questions you may have.
            </p>

            {/* ADYC Logo & Motto */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="max-w-md mx-auto"
            >
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-strong border border-orange-500/20">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl overflow-hidden shadow-moderate">
                  <img 
                    src="https://customer-assets.emergentagent.com/job_c6e56cf6-bfc9-4e7f-baab-fad031a53cd0/artifacts/wqccelzo_ADYC%20LOGO%202-1.jpg" 
                    alt="ADYC Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="heading-secondary text-primary mb-3">
                  African Democratic Youth Congress
                </h2>
                <p className="text-lg font-semibold text-accent italic mb-4">
                  "Arise, It's Youth O'Clock!"
                </p>
                <div className="flex items-center justify-center space-x-2 text-sm text-secondary">
                  <Zap className="w-4 h-4 text-orange-500" />
                  <span>Empowering Nigeria's Democratic Future</span>
                </div>
              </div>
            </motion.div>
          </motion.section>

          {/* CONTACT INFORMATION CARDS */}
          <motion.section variants={itemVariants}>
            <div className="text-center mb-12">
              <h2 className="heading-primary text-primary mb-6">
                Get in <span className="text-accent">Touch</span>
              </h2>
              <p className="body-large text-secondary max-w-2xl mx-auto">
                Multiple ways to connect with our team and join the movement for democratic change.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="featured-card group hover:shadow-strong transition-all duration-300"
                >
                  <div className="flex items-start space-x-6">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-moderate flex-shrink-0 ${
                      info.color === 'blue' ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
                      info.color === 'green' ? 'bg-gradient-to-br from-green-500 to-green-600' :
                      info.color === 'orange' ? 'bg-gradient-to-br from-orange-500 to-orange-600' :
                      'bg-gradient-to-br from-purple-500 to-purple-600'
                    }`}>
                      <info.icon className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <h3 className="heading-tertiary text-primary mb-3 group-hover:text-accent transition-colors">
                        {info.title}
                      </h3>
                      <p className="text-accent font-semibold mb-3">
                        {info.content}
                      </p>
                      <p className="text-secondary">
                        {info.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* OFFICE HOURS SECTION */}
          <motion.section variants={itemVariants} className="bg-accent-subtle rounded-3xl">
            <div className="container-custom section-spacing">
              <div className="text-center mb-12">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white shadow-accent mx-auto mb-6">
                  <Clock className="w-8 h-8" />
                </div>
                <h2 className="heading-primary text-primary mb-4">
                  Contact <span className="text-accent">Hours</span>
                </h2>
                <p className="body-large text-secondary">
                  Best times to reach out to our dedicated team
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {officeHours.map((schedule, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="modern-card text-center group hover:shadow-moderate transition-all"
                  >
                    <h3 className="heading-tertiary text-primary mb-4 group-hover:text-accent transition-colors">
                      {schedule.day}
                    </h3>
                    <p className="text-accent font-bold text-lg">
                      {schedule.hours}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* WHY CONTACT US SECTION */}
          <motion.section variants={itemVariants}>
            <div className="text-center mb-12">
              <h2 className="heading-primary text-primary mb-6">
                Why <span className="text-accent">Connect</span> with Us?
              </h2>
              <p className="body-large text-secondary max-w-2xl mx-auto">
                Discover the many ways ADYC can support your journey in democratic participation and youth leadership.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Shield,
                  title: "Guidance & Support",
                  description: "Get expert advice on democratic participation, leadership development, and civic engagement opportunities.",
                  color: "blue"
                },
                {
                  icon: Users,
                  title: "Community Connection",
                  description: "Connect with like-minded youth leaders and activists across all six geopolitical zones of Nigeria.",
                  color: "green"
                },
                {
                  icon: Award,
                  title: "Leadership Opportunities",
                  description: "Discover pathways to leadership roles in governance, community development, and political engagement.",
                  color: "orange"
                }
              ].map((reason, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="modern-card text-center group"
                >
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-moderate mx-auto mb-6 ${
                    reason.color === 'blue' ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
                    reason.color === 'green' ? 'bg-gradient-to-br from-green-500 to-green-600' :
                    'bg-gradient-to-br from-orange-500 to-orange-600'
                  }`}>
                    <reason.icon className="w-8 h-8" />
                  </div>
                  <h3 className="heading-tertiary text-primary mb-4 group-hover:text-accent transition-colors">
                    {reason.title}
                  </h3>
                  <p className="text-secondary leading-relaxed">
                    {reason.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* CALL TO ACTION SECTION */}
          <motion.section variants={itemVariants}>
            <div className="featured-card text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center text-white shadow-accent mx-auto mb-8">
                  <Heart className="w-8 h-8" />
                </div>
                
                <h2 className="display-text text-primary mb-8">
                  Join the <span className="text-accent hand-drawn-accent">Movement</span>
                </h2>
                <p className="body-large text-secondary mb-12 max-w-3xl mx-auto">
                  Ready to make a difference? Register as a member and be part of Nigeria's 
                  democratic transformation through youth engagement and leadership development.
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <button
                    onClick={() => onNavigate('register')}
                    className="btn-primary mobile-touch text-lg px-12 py-5"
                  >
                    Register Now
                  </button>
                  <button
                    onClick={() => onNavigate('about')}
                    className="btn-secondary mobile-touch text-lg px-12 py-5"
                  >
                    Learn More
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.section>

          {/* FOOTER NOTE */}
          <motion.section variants={itemVariants} className="text-center">
            <div className="max-w-2xl mx-auto">
              <p className="text-secondary">
                <strong>Response Time:</strong> We typically respond to all inquiries within 24-48 hours. 
                For urgent matters, please email us directly at our official address.
              </p>
            </div>
          </motion.section>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Contact;