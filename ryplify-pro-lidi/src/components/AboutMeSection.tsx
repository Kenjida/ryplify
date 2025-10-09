import React from 'react';

const AboutMeSection: React.FC = () => {
  return (
    <section id="o-mne" className="py-20 bg-slate-900/50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">
          
          {/* Left Column: Framed Image + Titles */}
          <div className="lg:w-1/3 flex-shrink-0 text-center">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 pb-6 inline-block shadow-lg transform hover:scale-105 transition-transform duration-300">
              <img 
                src="/lukas.png" 
                alt="Lukáš, zakladatel Ryplify" 
                className="rounded-lg max-w-xs w-full"
              />
              <div className="mt-4">
                <h3 className="text-3xl font-bold text-white">Lukáš</h3>
                <p className="text-red-500 font-semibold text-lg">Zakladatel & Vibe Coder</p>
              </div>
            </div>
          </div>

          {/* Right Column: Text Content */}
          <div className="lg:w-2/3">
            <h2 className="text-4xl font-extrabold text-white mb-4">Kdo za tím stojí?</h2>
            <div className="mb-6 w-20 h-1 bg-red-600 rounded"></div>
            
            <p className="text-slate-300 mb-4 text-lg">
              Baví mě pomáhat lidem jako jste vy přenášet jejich nápady do online světa. Věřím, že moderní technologie nemají být strašákem, ale pomocníkem.
            </p>
            <p className="text-slate-300 mb-6 text-lg">
              Proto se soustředím na jednoduchá, funkční a hlavně dostupná řešení. Žádné složité korporátní řeči, jen přímé a férové jednání od začátku do konce.
            </p>
            <a href="https://vibecoding.ryplify.eu/#contact" target="_blank" rel="noopener noreferrer" className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-transform duration-300 hover:scale-105">
              Pojďme se pobavit
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMeSection;


