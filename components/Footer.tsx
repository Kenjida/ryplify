
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 py-8">
      <div className="container mx-auto px-6 text-center text-slate-400">
        <p className="mb-4 text-lg">Rypli<span className="text-red-500">fy</span></p>
        <p>&copy; {new Date().getFullYear()} Ryplify. Všechna práva vyhrazena.</p>
        <p className="text-sm mt-2">Vytvořeno s vášní pro Vibe Coding.</p>
      </div>
    </footer>
  );
};

export default Footer;
