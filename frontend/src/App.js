import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import { Toaster } from './components/ui/toaster';
import SplashScreen from './components/SplashScreen';
import Home from './components/Home';
import Blog from './components/Blog';
import Register from './components/Register';
import Executives from './components/Executives';
import About from './components/About';
import Contact from './components/Contact';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
  }, []);

  const handleNavigation = (pageId) => {
    setCurrentPage(pageId);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={handleNavigation} />;
      case 'blog':
        return <Blog onNavigate={handleNavigation} />;
      case 'executives':
        return <Executives onNavigate={handleNavigation} />;
      case 'register':
        return <Register onNavigate={handleNavigation} />;
      case 'about':
        return <About onNavigate={handleNavigation} />;
      case 'contact':
        return <div>Contact page coming soon...</div>;
      case 'social':
        return <div>Social media page coming soon...</div>;
      default:
        return <Home onNavigate={handleNavigation} />;
    }
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <div className="App">
      {renderCurrentPage()}
      <Toaster />
    </div>
  );
}

export default App;