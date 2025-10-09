import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <section id="home" className="min-h-screen flex items-center bg-cover bg-center relative" style={{backgroundImage: "url('/Ryplify_bck.png')"}}>
      {/* Overlays for visual effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1f] via-[#0a0f1f]/80 to-[#0a0f1f]"></div>
      <div className="absolute inset-0 bg-black/50"></div>
      
      <div className="container mx-auto px-6 text-center relative z-10">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4">
          Váš vlastní web nebo aplikace?
          <br />
          <span className="text-red-500">Snadněji a levněji, než si myslíte.</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-8">
          Pomáhám živnostníkům, spolkům i nadšencům získat moderní online tvář. Bez složitých řečí a skrytých poplatků.
        </p>
        <a href="https://vibecoding.ryplify.eu/#contact" target="_blank" rel="noopener noreferrer" className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-10 rounded-lg text-xl transition-transform duration-300 hover:scale-105 inline-block">
          Chci konzultaci zdarma
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
