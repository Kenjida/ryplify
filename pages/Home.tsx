
import React, { useEffect } from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import ServicesSection from '../components/ServicesSection';
import AboutSection from '../components/AboutSection';
import PortfolioSection from '../components/PortfolioSection';
import ProcessSection from '../components/ProcessSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';
import ArticlesSection from '../components/ArticlesSection';
import ScrollToTopButton from '../components/ScrollToTopButton';

const Home: React.FC = () => {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      // Use a timeout to ensure the element is rendered
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, []);

  return (
    <div className="bg-[#0a0f1f] text-slate-300 font-sans leading-relaxed">
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
        <AboutSection />
        <PortfolioSection />
        <ProcessSection />
        <ArticlesSection />
        <ContactSection />
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default Home;
