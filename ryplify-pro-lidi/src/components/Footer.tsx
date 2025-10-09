import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900/50 border-t border-slate-800 py-8">
      <div className="container mx-auto px-6 text-center text-slate-400">
        <p>&copy; {currentYear} Ryplify. Všechna práva vyhrazena.</p>
        <p className="mt-2">Tvorba webů a aplikací pro každého.</p>
      </div>
    </footer>
  );
};

export default Footer;
