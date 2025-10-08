
import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center bg-cover bg-center relative" style={{backgroundImage: "url('/Ryplify_bck.png')"}}>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1f] via-[#0a0f1f]/80 to-[#0a0f1f]"></div>
        <div className="absolute inset-0 bg-black/50"></div>
      
      <div className="container mx-auto px-6 text-center relative z-10">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-4 leading-tight">
          Měníme vaše nápady v <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700">digitální realitu.</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-8">
          Od responzivních webů po chytré mobilní aplikace a automatizační nástroje s umělou inteligencí. Posouváme hranice digitálních možností.
        </p>
        <div className="space-x-4">
            <a href="#services" className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform duration-300 hover:scale-105 inline-block">
                Prozkoumat Služby
            </a>
            <a href="#contact" className="border-2 border-slate-400 hover:border-red-500 hover:text-red-500 text-slate-300 font-bold py-3 px-8 rounded-lg text-lg transition-all duration-300 inline-block">
                Kontaktovat
            </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
