
import React, { useState } from 'react';

const ContactSection: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Odesílám...');

    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message }),
    })
    .then(response => {
      if (response.ok) {
        setStatus(`Děkujeme za zprávu, ${name}! Brzy se ozveme.`);
        setName('');
        setEmail('');
        setMessage('');
      } else {
        throw new Error('Něco se pokazilo.');
      }
    })
    .catch(() => {
      setStatus('Odeslání se nezdařilo. Zkuste to prosím znovu.');
    });
  };

  return (
    <section id="contact" className="py-20 bg-[#0a0f1f]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-white">Nastartujte svůj projekt</h2>
          <p className="text-lg text-slate-400 mt-4 max-w-2xl mx-auto">Ať už máte nápad na web, aplikaci, nebo chcete využít sílu AI, ozvěte se nám. Společně najdeme to nejlepší řešení.</p>
          <div className="mt-4 w-24 h-1 bg-red-600 mx-auto rounded"></div>
        </div>

        <div className="max-w-2xl mx-auto bg-slate-800/50 border border-slate-700 p-8 rounded-xl shadow-lg">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="name" className="block text-slate-300 mb-2">Jméno</label>
              <input 
                type="text" 
                id="name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-red-500" 
                required 
              />
            </div>
            <div className="mb-6">
              <label htmlFor="email" className="block text-slate-300 mb-2">Email</label>
              <input 
                type="email" 
                id="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-red-500" 
                required 
              />
            </div>
            <div className="mb-6">
              <label htmlFor="message" className="block text-slate-300 mb-2">Vaše zpráva</label>
              <textarea 
                id="message" 
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-red-500" 
                required 
              ></textarea>
            </div>
            <div className="text-center">
              <button type="submit" className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-12 rounded-lg text-lg transition-transform duration-300 hover:scale-105 w-full md:w-auto">
                Odeslat Zprávu
              </button>
            </div>
          </form>
          {status && <p className="text-center mt-6 text-green-400">{status}</p>}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
