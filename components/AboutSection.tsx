
import React from 'react';

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-slate-900/50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            <img 
              src="/vibecoding_ryplify.png" 
              alt="Ryplify Team" 
              className="rounded-xl shadow-2xl shadow-black/50 w-full"
            />
          </div>
          <div className="lg:w-1/2">
            <h2 className="text-4xl font-extrabold text-white mb-4">Inovátoři s lidským přístupem</h2>
             <div className="mb-6 w-20 h-1 bg-red-600 rounded"></div>
            <p className="text-slate-300 mb-4 text-lg">
              V Ryplify nejsme jen vývojáři a designéři. Jsme tým inovátorů a technologických nadšenců, kteří spojují technickou dokonalost s lidským přístupem. Naše specializace? Tvorba webů, aplikací a inteligentních řešení s využitím AI.
            </p>
            <p className="text-slate-300 mb-6 text-lg">
              Naše mise je jednoduchá: vytvářet software, který nejen funguje bezchybně, ale také přináší radost a intuitivní zážitek. Ať už se jedná o komplexní webovou platformu nebo AI asistenta, každý projekt je pro nás příležitostí posunout hranice a zhmotnit vaši vizi.
            </p>
            <a href="#contact" className="bg-transparent border-2 border-red-600 text-red-500 font-bold py-3 px-8 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-300">
              Spojte se s námi
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
