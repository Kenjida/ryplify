
import React from 'react';

const ProcessSection: React.FC = () => {
  return (
    <section id="process" className="py-20 bg-slate-900/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-white">Od nápadu k realitě: Jak probíhá spolupráce?</h2>
          <p className="text-lg text-slate-400 mt-4 max-w-3xl mx-auto">Náš proces je navržen tak, aby byl pro vás co nejjednodušší, nejtransparentnější a nejpříjemnější.</p>
          <div className="mt-4 w-24 h-1 bg-red-600 mx-auto rounded"></div>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Column - Process Steps */}
          <div className="lg:w-2/3">
            <ul className="space-y-8">
              {/* Step 1 */}
              <li className="flex items-start">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-red-600/20 text-red-500 flex items-center justify-center text-2xl font-bold">1</div>
                <div className="ml-6">
                  <h3 className="text-2xl font-bold text-white">Kontakt a konzultace</h3>
                  <p className="text-slate-400 mt-2">Vše začíná vaší zprávou. Vyplňte kontaktní formulář a já se vám neprodleně ozvu. Domluvíme si schůzku (online nebo osobně) a probereme vaši vizi, cíle a požadavky na funkčnost a design.</p>
                </div>
              </li>

              {/* Step 2 */}
              <li className="flex items-start">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-red-600/20 text-red-500 flex items-center justify-center text-2xl font-bold">2</div>
                <div className="ml-6">
                  <h3 className="text-2xl font-bold text-white">Transparentní vývoj</h3>
                  <p className="text-slate-400 mt-2 mb-4">Pracuji za jednotnou sazbu 500 Kč/hod. Po celou dobu budete mít přístup do systému, kde v reálném čase uvidíte postup práce i aktuální náklady. Plná transparentnost je pro mě klíčová.</p>
                  <img src="/proces.png" alt="Ukázka sledování projektu" className="rounded-lg shadow-lg border border-slate-700"/>
                </div>
              </li>

              {/* Step 3 */}
              <li className="flex items-start">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-red-600/20 text-red-500 flex items-center justify-center text-2xl font-bold">3</div>
                <div className="ml-6">
                  <h3 className="text-2xl font-bold text-white">Schválení a platba</h3>
                  <p className="text-slate-400 mt-2">Po dokončení a důkladném otestování vám aplikaci předvedu. Až ve chvíli, kdy budete 100% spokojeni, zašlete platbu.</p>
                </div>
              </li>

              {/* Step 4 */}
              <li className="flex items-start">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-red-600/20 text-red-500 flex items-center justify-center text-2xl font-bold">4</div>
                <div className="ml-6">
                  <h3 className="text-2xl font-bold text-white">Nasazení a podpora</h3>
                  <p className="text-slate-400 mt-2">Nakonec aplikaci nasadím přesně tam, kam potřebujete – na váš web, servery, PC nebo mobilní zařízení. Tím ale naše spolupráce končit nemusí, nabízím i následnou podporu a rozvoj.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Right Column - Your Photo */}
          <div className="lg:w-1/3">
            <div className="p-8 bg-slate-800/50 border border-slate-700 rounded-xl text-center">
                <img 
                src="/lukas.png" 
                alt="Lukáš Rypl" 
                className="rounded-xl shadow-2xl shadow-black/50 w-full mb-4"
                />
                <h3 className="text-2xl font-bold text-white">Lukáš Rypl</h3>
                <p className="text-red-400">Zakladatel & Vibe Coder</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
