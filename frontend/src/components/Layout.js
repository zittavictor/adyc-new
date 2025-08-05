import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Home, BookOpen, Users, UserPlus, Info, Phone, Share2, Sun, Moon, Search, Menu, X } from 'lucide-react';

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

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:bg-gradient-to-br dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-800 transition-all duration-500">
        
        {/* BLOG-STYLE TOP NAVIGATION */}
        <header className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-neutral-200/60 dark:border-neutral-700/60 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16 lg:h-20">
              
              {/* LOGO SECTION */}
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img 
                    src="https://customer-assets.emergentagent.com/job_08188fa5-14cb-4a99-bccc-7b97522397cf/artifacts/3feq369o_ADYC%20LOGO%202-1.jpg"
                    alt="ADYC Logo" 
                    className="w-10 h-10 lg:w-12 lg:h-12 object-contain rounded-lg"
                  />
                </div>
                <div>
                  <h1 className="text-lg lg:text-xl font-bold text-neutral-800 dark:text-white">ADYC</h1>
                  <p className="text-xs lg:text-sm text-neutral-500 dark:text-neutral-400 hidden sm:block">African Democratic Youth Congress</p>
                </div>
              </div>

              {/* DESKTOP NAVIGATION */}
              <nav className="hidden lg:flex items-center space-x-1">
                {navigation.map((item) => {
                  const isActive = currentPage === item.id;
                  return (
                    <motion.button
                      key={item.name}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleNavigation(item.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg'
                          : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/50'
                      }`}
                    >
                      <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : ''}`} />
                      <span>{item.name}</span>
                    </motion.button>
                  );
                })}
              </nav>

              {/* RIGHT SIDE CONTROLS */}
              <div className="flex items-center space-x-3">
                {/* SEARCH BAR */}
                <div className="hidden md:flex relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-64 bg-neutral-100/50 dark:bg-neutral-800/50 rounded-lg border-0 text-neutral-800 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm"
                  />
                </div>

                {/* DARK MODE TOGGLE */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 transition-all"
                >
                  {darkMode ? (
                    <Sun className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </motion.button>

                {/* MOBILE MENU BUTTON - Only for smaller screens */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setMobileMenuOpen(true)}
                  className="lg:hidden p-2 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 transition-all"
                >
                  <Menu className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* MOBILE SEARCH BAR - Below main header on mobile */}
          <div className="md:hidden px-4 pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-neutral-100/50 dark:bg-neutral-800/50 rounded-lg border-0 text-neutral-800 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm"
              />
            </div>
          </div>
        </header>

        {/* MOBILE NAVIGATION OVERLAY - Only for very small screens */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
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
                    className="w-8 h-8 object-contain rounded-lg"
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
                  className="p-2 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
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
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-all ${
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

        {/* MAIN CONTENT AREA */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm rounded-2xl border border-neutral-200/50 dark:border-neutral-700/50 p-6 lg:p-8 min-h-[calc(100vh-12rem)]">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
};

export default Layout;