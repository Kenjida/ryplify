import React from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ForWhomSection from './components/ForWhomSection';
import AboutMeSection from './components/AboutMeSection';
import ProcessSection from './components/ProcessSection';
import PricingSection from './components/PricingSection';
import CreationsSection from './components/CreationsSection';
import FinalCTASection from './components/FinalCTASection';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="bg-[#0a0f1f] text-slate-300 font-sans leading-relaxed">
      <Header />
      <main>
        <HeroSection />
        <ForWhomSection />
        <AboutMeSection />
        <ProcessSection />
        <PricingSection />
        <CreationsSection />
        <FinalCTASection />
      </main>
      <Footer />
    </div>
  );
};

export default App;
