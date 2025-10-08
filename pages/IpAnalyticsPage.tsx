import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

type IpData = [string, number];

const IpAnalyticsPage: React.FC = () => {
  const [ipData, setIpData] = useState<IpData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/api/analytics/ips')
      .then(res => res.json())
      .then(setIpData)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-[#0a0f1f] text-slate-300 font-sans leading-relaxed min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 pt-24 pb-8">
        <div className="mb-4">
          <Link to="/admin" className="text-slate-400 hover:text-white transition-colors">
            &larr; Zpět na hlavní přehled
          </Link>
        </div>
        <h1 className="text-3xl font-bold mb-8">Přehled podle IP adres</h1>
        {loading ? (
          <p>Načítání dat...</p>
        ) : (
          <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl shadow-lg">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="p-2 border-b border-slate-700">IP Adresa</th>
                  <th className="p-2 border-b border-slate-700">Počet návštěv</th>
                </tr>
              </thead>
              <tbody>
                {ipData.map(([ip, count]) => (
                  <tr key={ip}>
                    <td className="p-2 border-b border-slate-700">{ip}</td>
                    <td className="p-2 border-b border-slate-700">{count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default IpAnalyticsPage;
