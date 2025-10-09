import React from 'react';

const PricingSection: React.FC = () => {
  return (
    <section id="cena" className="py-20 bg-slate-800/30">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-extrabold text-white mb-4">Kolik to stojí?</h2>
        <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
          Zapomeňte na statisícové investice. Moderní web na míru může stát méně než nový telefon. Vždy záleží na rozsahu, ale mým cílem je najít řešení pro každý rozpočet.
        </p>
        <a href="https://vibecoding.ryplify.eu/#contact" target="_blank" rel="noopener noreferrer" className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-10 rounded-lg text-xl transition-transform duration-300 hover:scale-105 inline-block">
          Získat nezávaznou kalkulaci
        </a>
      </div>
    </section>
  );
};

export default PricingSection;
