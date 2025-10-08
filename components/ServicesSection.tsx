
import React from 'react';

const ServiceCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-xl shadow-lg hover:shadow-red-900/20 hover:-translate-y-2 transition-all duration-300">
    <div className="text-red-500 mb-4">{icon}</div>
    <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
    <p className="text-slate-400">{description}</p>
  </div>
);

const ServicesSection: React.FC = () => {
  const services = [
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>,
      title: 'Design, který si uživatelé zamilují',
      description: 'Vytváříme weby a aplikace, které nejen skvěle vypadají, ale hlavně se intuitivně a příjemně používají. Dbáme na každý detail, aby se u vás zákazníci snadno orientovali, cítili se dobře a rádi se vraceli.'
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>,
      title: 'Webové a mobilní aplikace',
      description: 'Tvoříme bleskurychlé weby a intuitivní mobilní aplikace na míru. Od návrhu po nasazení, s důrazem na dokonalý zážitek a moderní technologie.'
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
      title: 'Integrace umělé inteligence',
      description: 'Implementujeme AI do vašich systémů. Od chytrých chatbotů a analýzy dat po personalizovaný obsah. Zvyšte efektivitu a nabídněte zákazníkům něco navíc.'
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
      title: 'Automatizační nástroje',
      description: 'Navrhujeme a vyvíjíme nástroje, které vám ušetří čas a peníze. Automatizujte procesy a soustřeďte se na to, co je skutečně důležité.'
    }
  ];

  return (
    <section id="services" className="py-20 bg-[#0a0f1f]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-white">Co je Vibe Coding?</h2>
          <p className="text-lg text-slate-400 mt-4 max-w-2xl mx-auto">Je to náš unikátní přístup, kde se nejnovější technologie snoubí s intuicí. Specializujeme se na weby, aplikace, automatizaci a AI řešení, která skutečně fungují.</p>
           <div className="mt-4 w-24 h-1 bg-red-600 mx-auto rounded"></div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map(service => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
