import React from 'react';

const steps = [
  {
    step: '1',
    title: 'První pokec (zdarma)',
    description: 'Nejdřív si v klidu a nezávazně popovídáme o vašem nápadu. Co potřebujete? Co se vám líbí? Žádné složité řeči, jen lidský rozhovor u kafe (i virtuálního).',
  },
  {
    step: '2',
    title: 'Plán a rozpočet na míru',
    description: 'Připravím vám jednoduchý návrh, jak by mohl váš web nebo aplikace vypadat. Hned na začátku budete jasně vědět, kolik to bude stát. Žádná skrytá překvapení.',
  },
  {
    step: '3',
    title: 'Tvorba a ladění',
    description: 'Pustím se do práce. Během tvorby vám budu ukazovat průběžné výsledky, abyste měli jistotu, že vše směřuje přesně tam, kam chcete. Můžete cokoliv připomínkovat.',
  },
  {
    step: '4',
    title: 'Spuštění a předání',
    description: 'Váš nový projekt spustíme do světa! Vše vám vysvětlím, ukážu, jak se s tím pracuje, a předám vám klíče. I po spuštění jsem tu pro vás, kdybyste cokoliv potřebovali.',
  },
];

const ProcessSection: React.FC = () => {
  return (
    <section id="proces" className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-white">Jak probíhá spolupráce?</h2>
          <p className="text-lg text-slate-400 mt-4">Jednoduše a transparentně, ve čtyřech krocích.</p>
          <div className="mt-4 w-24 h-1 bg-red-600 mx-auto rounded"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, index) => (
            <div key={index} className="bg-slate-800/50 border border-slate-700 p-8 rounded-xl shadow-lg text-center">
              <div className="text-5xl font-extrabold text-red-500 mb-4">{item.step}</div>
              <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
              <p className="text-slate-400">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
