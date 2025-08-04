import React, { useState, useEffect } from 'react';
import './App.css';
import { Toaster } from './components/ui/toaster';
import SplashScreen from './components/SplashScreen';
import Home from './components/Home';
import Blog from './components/Blog';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

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
        return <div>Executives page coming soon...</div>;
      case 'register':
        return <div>Registration page coming soon...</div>;
      case 'about':
        return <div>About page coming soon...</div>;
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