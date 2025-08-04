import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, BookOpen, Users, UserPlus, Info, Phone, Share2, Sun, Moon, Bell, Search, Menu, X } from 'lucide-react';

const navigation = [
  { id: 'home', name: 'Home', icon: Home },
  { id: 'blog', name: 'Blog', icon: BookOpen },
  { id: 'executives', name: 'Executives', icon: Users },
  { id: 'register', name: 'Register', icon: UserPlus },
  { id: 'about', name: 'About ADYC', icon: Info },
  { id: 'contact', name: 'Contact Us', icon: Phone },
  { id: 'social', name: 'Social Media', icon: Share2 },
];

const Layout = ({ children, currentPage = 'home', onNavigate }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // DARK MODE PERSISTENCE SYSTEM
  useEffect(() => {
    const saved = localStorage.getItem('adyc_dark_mode');
    if (saved) {
      const isDark = JSON.parse(saved);
      setDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('adyc_dark_mode', JSON.stringify(newDarkMode));
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleNavigation = (pageId) => {
    if (onNavigate) onNavigate(pageId);
    setMobileMenuOpen(false);
  };

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setNotificationOpen(false);
    };
    if (notificationOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [notificationOpen]);

  return (
    <div className={`h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="h-screen bg-gradient-to-br from-neutral-50 via-primary-50 to-secondary-50 dark:bg-gradient-to-br dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-800 flex overflow-hidden transition-all duration-500">
        
        {/* DESKTOP SIDEBAR WITH NEUMORPHIC DESIGN */}
        <div className="hidden lg:flex lg:flex-shrink-0">
          <div className="w-64 floating-card m-4 mr-0">
            {/* LOGO SECTION */}
            <div className="flex items-center justify-between h-16 px-6 border-b border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center space-x-3">
                <div className={`relative neumorphic p-2 rounded-xl ${
                  darkMode ? 'bg-neutral-700' : 'bg-white'
                }`}>
                  <img 
                    src="https://customer-assets.emergentagent.com/job_08188fa5-14cb-4a99-bccc-7b97522397cf/artifacts/3feq369o_ADYC%20LOGO%202-1.jpg"
                    alt="ADYC Logo" 
                    className="w-10 h-10 object-contain rounded-lg"
                  />
                </div>
                <div>
                  <h1 className="text-sm font-bold text-neutral-800 dark:text-white">ADYC</h1>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">Youth Congress</p>
                </div>
              </div>
            </div>

            {/* NAVIGATION MENU */}
            <nav className="flex-1 px-4 py-6 space-y-2">
              {navigation.map((item) => {
                const isActive = currentPage === item.id;
                return (
                  <motion.button
                    key={item.name}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleNavigation(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-xl transition-all mobile-button ${
                      isActive
                        ? 'neumorphic-inset bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg'
                        : 'neumorphic text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white bg-white/50 dark:bg-neutral-800/30'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : ''}`} />
                    <span className="font-medium">{item.name}</span>
                  </motion.button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 flex flex-col overflow-hidden lg:ml-4">
          {/* TOP HEADER WITH ADVANCED FEATURES */}
          <header className="floating-card h-16 flex items-center justify-between px-6 m-4 mb-0">
            {/* MOBILE MENU BUTTON */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden neumorphic p-3 rounded-xl text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 bg-white/50 dark:bg-neutral-800/30 transition-all mobile-button"
            >
              <Menu className="w-5 h-5" />
            </motion.button>

            {/* SEARCH BAR FOR BLOG CONTENT */}
            <div className="hidden md:flex relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search blog posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 w-80 neumorphic-inset bg-neutral-50/50 dark:bg-neutral-700/50 rounded-xl border-0 text-neutral-800 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none text-sm"
              />
            </div>

            <div className="flex items-center space-x-3">
              {/* DARK MODE TOGGLE */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleDarkMode}
                className="neumorphic p-3 rounded-xl text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 bg-white/50 dark:bg-neutral-800/30 transition-all mobile-button"
              >
                {darkMode ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </motion.button>

              {/* NOTIFICATIONS DROPDOWN */}
              <div className="relative notification-dropdown">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setNotificationOpen(!notificationOpen);
                  }}
                  className="neumorphic p-3 rounded-xl text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 bg-white/50 dark:bg-neutral-800/30 transition-all relative mobile-button"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white dark:border-neutral-800 flex items-center justify-center">
                    <span className="text-xs text-white font-bold">3</span>
                  </span>
                </motion.button>

                {/* NOTIFICATION DROPDOWN CONTENT */}
                <AnimatePresence>
                  {notificationOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-80 sm:w-96 bg-white/95 dark:bg-neutral-800/95 backdrop-blur-md rounded-2xl border border-neutral-200/60 dark:border-neutral-700/60 shadow-2xl z-[9999] notification-enhanced"
                    >
                      <div className="p-4">
                        <h4 className="font-semibold text-lg text-neutral-800 dark:text-white mb-3">Notifications</h4>
                        <ul className="space-y-3">
                          <li className="text-sm text-neutral-600 dark:text-neutral-400 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-700/50">
                            <strong>New blog post:</strong> "Youth in Leadership"
                          </li>
                          <li className="text-sm text-neutral-600 dark:text-neutral-400 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-700/50">
                            <strong>Upcoming event:</strong> Youth Summit on Aug 20th
                          </li>
                          <li className="text-sm text-neutral-600 dark:text-neutral-400 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-700/50">
                            <strong>Membership:</strong> Your application is being reviewed
                          </li>
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </header>

          {/* PAGE CONTENT */}
          <main className="flex-1 overflow-auto p-4 pt-0 mobile-scroll">
            <div className="floating-card p-6 h-full">
              {children}
            </div>
          </main>
        </div>

        {/* MOBILE NAVIGATION OVERLAY */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            >
              <motion.div
                initial={{ x: -320 }}
                animate={{ x: 0 }}
                exit={{ x: -320 }}
                transition={{ type: "spring", damping: 25, stiffness: 500 }}
                className="w-80 h-full bg-white/95 dark:bg-neutral-800/95 backdrop-blur-md border-r border-neutral-200/60 dark:border-neutral-700/60"
                onClick={(e) => e.stopPropagation()}
              >
                {/* MOBILE HEADER */}
                <div className="flex items-center justify-between h-16 px-6 border-b border-neutral-200 dark:border-neutral-700">
                  <div className="flex items-center space-x-3">
                    <img 
                      src="https://customer-assets.emergentagent.com/job_08188fa5-14cb-4a99-bccc-7b97522397cf/artifacts/3feq369o_ADYC%20LOGO%202-1.jpg"
                      alt="ADYC Logo" 
                      className="w-10 h-10 object-contain rounded-lg"
                    />
                    <div>
                      <h1 className="text-sm font-bold text-neutral-800 dark:text-white">ADYC</h1>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">Youth Congress</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 mobile-button"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>

                {/* MOBILE NAVIGATION */}
                <nav className="px-4 py-6 space-y-2">
                  {navigation.map((item) => {
                    const isActive = currentPage === item.id;
                    return (
                      <motion.button
                        key={item.name}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleNavigation(item.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-xl transition-all mobile-button ${
                          isActive
                            ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg'
                            : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-700/50'
                        }`}
                      >
                        <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : ''}`} />
                        <span className="font-medium">{item.name}</span>
                      </motion.button>
                    );
                  })}
                </nav>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Layout;