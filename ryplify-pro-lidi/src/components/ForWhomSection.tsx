import React from 'react';

const cards = [
  {
    title: 'Pro živnostníky a řemeslníky',
    description: 'Získejte více zákazníků pro váš salon, masáže nebo poradenství. Jednoduchá online vizitka s kontakty a rezervačním tlačítkem je základ úspěchu.',
    icon: '💼',
  },
  {
    title: 'Pro spolky a neziskovky',
    description: 'Prezentujte svou činnost, získejte nové členy a informujte veřejnost na přehledném webu, který si zvládnete sami spravovat.',
    icon: '🤝',
  },
  {
    title: 'Pro vaše koníčky a vášně',
    description: 'Ukažte světu svou sbírku, pište blog o svém koníčku nebo si vytvořte aplikaci, která vám ho usnadní. Fantazii se meze nekladou.',
    icon: '🎨',
  },
  {
    title: 'Pro váš osobní projekt',
    description: 'Máte v hlavě nápad na aplikaci, která změní svět (nebo jen ten váš)? Pojďme se nezávazně pobavit o tom, jak ho zrealizovat.',
    icon: '💡',
  },
];

const ForWhomSection: React.FC = () => {
  return (
    <section id="pro-koho" className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-white">Pro koho je moderní web nebo aplikace?</h2>
          <p className="text-lg text-slate-400 mt-4">Pro každého, kdo chce být vidět a posunout svůj projekt dál.</p>
          <div className="mt-4 w-24 h-1 bg-red-600 mx-auto rounded"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {cards.map((card, index) => (
            <div key={index} className="bg-slate-800/50 border border-slate-700 p-8 rounded-xl shadow-lg text-center hover:border-red-500 transition-colors">
              <div className="text-5xl mb-4">{card.icon}</div>
              <h3 className="text-2xl font-bold text-white mb-3">{card.title}</h3>
              <p className="text-slate-400">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ForWhomSection;
