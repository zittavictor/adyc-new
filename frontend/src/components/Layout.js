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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  // SCROLL DETECTION FOR HEADER STYLING
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigation = (pageId) => {
    if (onNavigate) onNavigate(pageId);
    setMobileMenuOpen(false);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 transition-all duration-500 relative">
        
        {/* SOPHISTICATED HEADER */}
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-700/60 shadow-soft'
            : 'bg-transparent'
        }`}>
          <div className="container-custom">
            <div className="flex justify-between items-center h-20">
              
              {/* REFINED LOGO SECTION */}
              <div className="flex items-center space-x-4">
                <motion.div 
                  className="relative cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onNavigate('home')}
                >
                  <img 
                    src="https://customer-assets.emergentagent.com/job_08188fa5-14cb-4a99-bccc-7b97522397cf/artifacts/3feq369o_ADYC%20LOGO%202-1.jpg"
                    alt="ADYC Logo" 
                    className="w-12 h-12 object-contain rounded-xl shadow-moderate"
                  />
                </motion.div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold text-primary">ADYC</h1>
                  <p className="text-sm text-secondary leading-tight">African Democratic Youth Congress</p>
                </div>
              </div>

              {/* DESKTOP NAVIGATION - Sophisticated Design */}
              <nav className="hidden lg:flex items-center space-x-2">
                {navigation.map((item) => {
                  const isActive = currentPage === item.id;
                  return (
                    <motion.button
                      key={item.name}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleNavigation(item.id)}
                      className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 mobile-touch ${
                        isActive
                          ? 'bg-orange-600 text-white shadow-accent'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : ''}`} />
                      <span>{item.name}</span>
                    </motion.button>
                  );
                })}
              </nav>

              {/* RIGHT SIDE CONTROLS - Clean Design */}
              <div className="flex items-center space-x-3">
                {/* SEARCH BAR - Hidden on mobile to reduce clutter */}
                <div className="hidden xl:flex relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-field pl-11 pr-4 py-3 w-64 text-sm"
                  />
                </div>

                {/* DARK MODE TOGGLE */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleDarkMode}
                  className="p-3 rounded-xl bg-slate-100/60 dark:bg-slate-800/60 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-all mobile-touch"
                >
                  {darkMode ? (
                    <Sun className="w-5 h-5 text-amber-500" />
                  ) : (
                    <Moon className="w-5 h-5 text-slate-600" />
                  )}
                </motion.button>

                {/* MOBILE MENU BUTTON */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setMobileMenuOpen(true)}
                  className="lg:hidden p-3 rounded-xl bg-slate-100/60 dark:bg-slate-800/60 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-all mobile-touch"
                >
                  <Menu className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </motion.button>
              </div>
            </div>
          </div>
        </header>

        {/* MOBILE NAVIGATION - Premium Design */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", damping: 25, stiffness: 500 }}
              className="w-80 h-full bg-white dark:bg-slate-900 shadow-strong"
              onClick={(e) => e.stopPropagation()}
            >
              {/* MOBILE HEADER */}
              <div className="flex items-center justify-between h-20 px-6 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center space-x-3">
                  <img 
                    src="https://customer-assets.emergentagent.com/job_08188fa5-14cb-4a99-bccc-7b97522397cf/artifacts/3feq369o_ADYC%20LOGO%202-1.jpg"
                    alt="ADYC Logo" 
                    className="w-10 h-10 object-contain rounded-lg"
                  />
                  <div>
                    <h1 className="font-bold text-primary">ADYC</h1>
                    <p className="text-xs text-secondary">Youth Congress</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </motion.button>
              </div>

              {/* MOBILE SEARCH */}
              <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-field pl-11 pr-4 py-3 w-full text-sm"
                  />
                </div>
              </div>

              {/* MOBILE NAVIGATION */}
              <nav className="px-4 py-6 space-y-2">
                {navigation.map((item) => {
                  const isActive = currentPage === item.id;
                  return (
                    <motion.button
                      key={item.name}
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleNavigation(item.id)}
                      className={`w-full flex items-center space-x-4 px-4 py-4 text-left rounded-xl transition-all ${
                        isActive
                          ? 'bg-orange-600 text-white shadow-accent'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
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

        {/* MAIN CONTENT AREA - Clean, Spacious Design */}
        <main className="pt-20">
          <div className="min-h-screen">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
};

export default Layout;