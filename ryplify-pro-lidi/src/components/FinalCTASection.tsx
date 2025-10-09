import React from 'react';

const FinalCTASection: React.FC = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-5xl font-extrabold text-white mb-6">Pojďme se do toho pustit!</h2>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
          První krok je ten nejtěžší. Udělejte ho hned teď a domluvte si krátký, nezávazný hovor, kde probereme vaše nápady.
        </p>
        <a href="https://vibecoding.ryplify.eu/#contact" target="_blank" rel="noopener noreferrer" className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform duration-300 hover:scale-105 inline-block">
          Konzultace zdarma
        </a>
      </div>
    </section>
  );
};

export default FinalCTASection;
