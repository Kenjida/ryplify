
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isHomepage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const LogoLink: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const className = "text-2xl font-bold tracking-wider";
    if (isHomepage) {
        return <a href="#home" onClick={() => setIsMenuOpen(false)} className={className}>{children}</a>;
    }
    return <Link to="/" onClick={() => setIsMenuOpen(false)} className={className}>{children}</Link>;
  }

  const NavLinks: React.FC<{ onLinkClick: () => void }> = ({ onLinkClick }) => (
    <>
      <a href="/#services" onClick={onLinkClick} className="hover:text-red-500 transition-colors duration-300">Služby</a>
      <a href="/#about" onClick={onLinkClick} className="hover:text-red-500 transition-colors duration-300">O nás</a>
      <a href="/#portfolio" onClick={onLinkClick} className="hover:text-red-500 transition-colors duration-300">Portfolio</a>
      <a href="/#process" onClick={onLinkClick} className="hover:text-red-500 transition-colors duration-300">Proces</a>
      <a href="/#articles" onClick={onLinkClick} className="hover:text-red-500 transition-colors duration-300">Články</a>
      <Link to="/projekt" onClick={onLinkClick} className="hover:text-red-500 transition-colors duration-300">Projekt</Link>
    </>
  );

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || isMenuOpen ? 'bg-[#0a0f1f]/80 backdrop-blur-lg shadow-lg shadow-red-900/10' : 'bg-transparent'}`}>
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <LogoLink>
          Rypli<span className="text-red-500">fy</span>
        </LogoLink>
        <nav className="hidden md:flex space-x-8 items-center">
          <NavLinks onLinkClick={() => {}} />
        </nav>
        <a href="#contact" className="hidden md:inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-transform duration-300 hover:scale-105">
          Poptávka
        </a>
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#0a0f1f]/95 backdrop-blur-lg">
          <nav className="flex flex-col items-center space-y-4 py-8">
            <NavLinks onLinkClick={() => setIsMenuOpen(false)} />
            <a href="#contact" onClick={() => setIsMenuOpen(false)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-transform duration-300 hover:scale-105">
              Poptávka
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
