
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-[#0a0f1f]/80 backdrop-blur-lg shadow-lg shadow-red-900/10' : 'bg-transparent'}`}>
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <a href="#home" className="text-2xl font-bold tracking-wider">
          Rypli<span className="text-red-500">fy</span>
        </a>
        <nav className="hidden md:flex space-x-8 items-center">
          <a href="#services" className="hover:text-red-500 transition-colors duration-300">Služby</a>
          <a href="#about" className="hover:text-red-500 transition-colors duration-300">O nás</a>
          <a href="#portfolio" className="hover:text-red-500 transition-colors duration-300">Portfolio</a>
          <a href="#process" className="hover:text-red-500 transition-colors duration-300">Proces</a>
          <a href="#articles" className="hover:text-red-500 transition-colors duration-300">Články</a>
          <Link to="/projekt" className="hover:text-red-500 transition-colors duration-300">Projekt</Link>
        </nav>
        <a href="#contact" className="hidden md:inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-transform duration-300 hover:scale-105">
          Poptávka
        </a>
        {/* Mobile menu button could be added here */}
      </div>
    </header>
  );
};

export default Header;
