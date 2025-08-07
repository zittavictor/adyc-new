import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Home, BookOpen, Users, UserPlus, Info, Phone, Share2, Search, Menu, X } from 'lucide-react';
import FloatingBackgroundElements from './FloatingBackgroundElements';

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
    <div className="min-h-screen">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 transition-all duration-500 relative">
        
        {/* FLOATING BACKGROUND ELEMENTS */}
        <FloatingBackgroundElements />
        
        {/* SOPHISTICATED HEADER */}
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 safe-area-top ${
          isScrolled 
            ? 'bg-white/90 backdrop-blur-xl border-b border-slate-200/60 shadow-soft'
            : 'bg-transparent'
        }`}>
          <div className="mobile-container">
            <div className="flex justify-between items-center h-16 sm:h-18 lg:h-20">
              
              {/* REFINED LOGO SECTION */}
              <div className="flex items-center space-x-2 sm:space-x-4">
                <motion.div 
                  className="relative cursor-pointer touch-target"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onNavigate('home')}
                >
                  <img 
                    src="https://customer-assets.emergentagent.com/job_08188fa5-14cb-4a99-bccc-7b97522397cf/artifacts/3feq369o_ADYC%20LOGO%202-1.jpg"
                    alt="ADYC Logo" 
                    className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-xl shadow-moderate"
                  />
                </motion.div>
                <div className="hidden xs:block sm:block">
                  <h1 className="text-lg sm:text-xl font-bold text-primary">ADYC</h1>
                  <p className="text-xs sm:text-sm text-secondary leading-tight hidden sm:block">African Democratic Youth Congress</p>
                </div>
              </div>

              {/* DESKTOP NAVIGATION - Hidden on mobile/tablet */}
              <nav className="hidden xl:flex items-center space-x-1 lg:space-x-2">
                {navigation.map((item) => {
                  const isActive = currentPage === item.id;
                  return (
                    <motion.button
                      key={item.name}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleNavigation(item.id)}
                      className={`flex items-center space-x-2 px-3 py-2 lg:px-4 lg:py-3 rounded-xl font-medium transition-all duration-200 touch-target ${
                        isActive
                          ? 'bg-orange-600 text-white shadow-accent'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                      }`}
                    >
                      <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : ''}`} />
                      <span className="text-sm lg:text-base">{item.name}</span>
                    </motion.button>
                  );
                })}
              </nav>

              {/* RIGHT SIDE CONTROLS - Mobile Optimized */}
              <div className="flex items-center space-x-2 sm:space-x-3">
                {/* SEARCH BAR - Hidden on mobile */}
                <div className="hidden xl:flex relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-field-mobile pl-11 pr-4 py-3 w-64 text-sm"
                  />
                </div>

                {/* MOBILE MENU BUTTON - Sleeker Design */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setMobileMenuOpen(true)}
                  className="xl:hidden p-2 sm:p-2.5 rounded-lg bg-slate-100/60 hover:bg-slate-200/60 transition-all touch-target"
                  aria-label="Open navigation menu"
                >
                  <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />
                </motion.button>
              </div>
            </div>
          </div>
        </header>

        {/* ENHANCED MOBILE MENU - Fully Responsive */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mobile-menu-overlay"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", damping: 25, stiffness: 500 }}
              className="mobile-menu-panel safe-area-top"
              onClick={(e) => e.stopPropagation()}
            >
              {/* MOBILE HEADER - Optimized */}
              <div className="flex items-center justify-between h-16 sm:h-18 px-4 sm:px-6 border-b border-slate-200">
                <div className="flex items-center space-x-3">
                  <img 
                    src="https://customer-assets.emergentagent.com/job_08188fa5-14cb-4a99-bccc-7b97522397cf/artifacts/3feq369o_ADYC%20LOGO%202-1.jpg"
                    alt="ADYC Logo" 
                    className="w-10 h-10 object-contain rounded-lg"
                  />
                  <div>
                    <h1 className="font-bold text-primary text-base">ADYC</h1>
                    <p className="text-xs text-secondary">Navigation</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setMobileMenuOpen(false)}
                  className="touch-target p-2 rounded-lg hover:bg-slate-100 transition-colors"
                  aria-label="Close navigation menu"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </motion.button>
              </div>

              {/* MOBILE SEARCH - Enhanced */}
              <div className="p-4 sm:p-6 border-b border-slate-100">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search ADYC..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-field-mobile pl-11 pr-4 text-base"
                  />
                </div>
              </div>

              {/* MOBILE NAVIGATION - Touch Optimized */}
              <div className="flex-1 px-4 sm:px-6 py-4 space-y-2 mobile-scroll-container">
                {navigation.map((item) => {
                  const isActive = currentPage === item.id;
                  return (
                    <motion.button
                      key={item.name}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleNavigation(item.id)}
                      className={`mobile-nav-item ${isActive ? 'active' : ''}`}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      <span className="text-base font-medium">{item.name}</span>
                      {isActive && (
                        <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* MOBILE MENU FOOTER */}
              <div className="p-4 sm:p-6 border-t border-slate-100 safe-area-bottom">
                <p className="text-xs text-slate-500 text-center">
                  African Democratic Youth Congress Platform
                </p>
                <p className="text-xs text-slate-400 text-center mt-1">
                  Version 2.0 • Empowering Nigeria's Youth
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* MAIN CONTENT AREA - Mobile Optimized */}
        <main className="pt-16 sm:pt-18 lg:pt-20 min-h-screen prevent-horizontal-scroll mobile-scroll-container">
          <div className="relative z-10">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
};

export default Layout;