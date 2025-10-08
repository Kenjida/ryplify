
import React from 'react';
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
