import React, { useState } from 'react';
import type { Project } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  projects: Project[];
  hourlyRate: number;
}

const Dashboard: React.FC<DashboardProps> = ({ projects, hourlyRate }) => {
  const [currentChartIndex, setCurrentChartIndex] = useState(0);

  // --- Data Calculations ---

  // Top 5 Projects
  const topProjectsData = projects
    .filter(p => p.isActive)
    .map(p => ({
      name: p.name,
      Cena: parseFloat(((p.totalSeconds / 3600) * hourlyRate).toFixed(2)),
    }))
    .sort((a, b) => b.Cena - a.Cena)
    .slice(0, 5);
  
  // Summary Costs
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const calculateTotalSeconds = (filterFn: (entryDate: Date) => boolean): number => {
    return projects.reduce((total, p) => {
      const projectSeconds = p.timeEntries
        .filter(entry => filterFn(new Date(entry.end)))
        .reduce((sum, entry) => sum + (entry.end - entry.start) / 1000, 0);
      return total + projectSeconds;
    }, 0);
  };

  const monthlySeconds = calculateTotalSeconds(date => date.getMonth() === currentMonth && date.getFullYear() === currentYear);
  const yearlySeconds = calculateTotalSeconds(date => date.getFullYear() === currentYear);
  const allTimeSeconds = calculateTotalSeconds(() => true);

  const monthlyCost = (monthlySeconds / 3600) * hourlyRate;
  const yearlyCost = (yearlySeconds / 3600) * hourlyRate;
  const totalCost = (allTimeSeconds / 3600) * hourlyRate;

  // Chart: Projects per Month
  const projectsByMonth = projects.reduce((acc, project) => {
    const date = new Date(project.id);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const key = `${year}-${month}`;
    if (!acc[key]) {
      acc[key] = { name: key, Počet: 0 };
    }
    acc[key].Počet++;
    return acc;
  }, {} as Record<string, { name: string, Počet: number }>);
  const projectsPerMonthData = Object.values(projectsByMonth).sort((a, b) => a.name.localeCompare(b.name));

  // Chart: Earnings per Year
  const earningsByYear = projects.reduce((acc, project) => {
    project.timeEntries.forEach(entry => {
      const date = new Date(entry.end);
      const year = date.getFullYear();
      const seconds = (entry.end - entry.start) / 1000;
      const earnings = (seconds / 3600) * hourlyRate;
      if (!acc[year]) {
        acc[year] = { name: String(year), Zisk: 0 };
      }
      acc[year].Zisk += earnings;
    });
    return acc;
  }, {} as Record<string, { name: string, Zisk: number }>);
  const earningsPerYearData = Object.values(earningsByYear)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(d => ({ ...d, Zisk: parseFloat(d.Zisk.toFixed(2)) }));
  
  // Chart: Earnings per Month (current year)
  const monthNames = ["Led", "Úno", "Bře", "Dub", "Kvě", "Čvn", "Čvc", "Srp", "Zář", "Říj", "Lis", "Pro"];
  const earningsByMonth = projects.reduce((acc, project) => {
    project.timeEntries.forEach(entry => {
      const date = new Date(entry.end);
      if (date.getFullYear() === currentYear) {
        const month = date.getMonth();
        const key = monthNames[month];
        const seconds = (entry.end - entry.start) / 1000;
        const earnings = (seconds / 3600) * hourlyRate;
        if (!acc[key]) {
          acc[key] = { name: key, Zisk: 0, monthIndex: month };
        }
        acc[key].Zisk += earnings;
      }
    });
    return acc;
  }, {} as Record<string, { name: string, Zisk: number, monthIndex: number }>);
  const earningsPerMonthData = Object.values(earningsByMonth)
    .sort((a, b) => a.monthIndex - b.monthIndex)
    .map(({ name, Zisk }) => ({ name, Zisk: parseFloat(Zisk.toFixed(2)) }));


  const charts = [
    { title: "Top 5 nejvýnosnějších projektů", data: topProjectsData, dataKey: "Cena", unit: " Kč" },
    { title: "Nové projekty za měsíc", data: projectsPerMonthData, dataKey: "Počet", unit: "" },
    { title: "Celkový zisk za roky", data: earningsPerYearData, dataKey: "Zisk", unit: " Kč" },
    { title: "Zisky za měsíce (tento rok)", data: earningsPerMonthData, dataKey: "Zisk", unit: " Kč" },
  ];

  const currentChart = charts[currentChartIndex];

  const goToNextChart = () => setCurrentChartIndex((prev) => (prev + 1) % charts.length);
  const goToPrevChart = () => setCurrentChartIndex((prev) => (prev - 1 + charts.length) % charts.length);

  return (
    <div className="bg-zinc-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-red-500">Přehled</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-zinc-700 p-4 rounded-lg text-center">
          <h3 className="text-lg font-semibold text-gray-300">Zisk za tento měsíc</h3>
          <p className="text-3xl font-bold text-red-400 mt-2">{monthlyCost.toFixed(2)} Kč</p>
        </div>
        <div className="bg-zinc-700 p-4 rounded-lg text-center">
          <h3 className="text-lg font-semibold text-gray-300">Zisk za tento rok</h3>
          <p className="text-3xl font-bold text-red-400 mt-2">{yearlyCost.toFixed(2)} Kč</p>
        </div>
        <div className="bg-zinc-700 p-4 rounded-lg text-center">
          <h3 className="text-lg font-semibold text-gray-300">Celkový zisk</h3>
          <p className="text-3xl font-bold text-red-400 mt-2">{totalCost.toFixed(2)} Kč</p>
        </div>
      </div>

      <div className="bg-zinc-700 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-4 px-2">
            <button 
                onClick={goToPrevChart}
                className="bg-zinc-600 hover:bg-zinc-500 text-white font-bold p-2 rounded-full transition-colors duration-300"
                aria-label="Předchozí graf"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <h3 className="text-xl font-semibold text-gray-200 text-center">{currentChart.title}</h3>
            <button 
                onClick={goToNextChart}
                className="bg-zinc-600 hover:bg-zinc-500 text-white font-bold p-2 rounded-full transition-colors duration-300"
                aria-label="Další graf"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </button>
        </div>
        <div style={{ width: '100%', height: 300 }}>
          {currentChart.data.length > 0 ? (
            <ResponsiveContainer>
              <BarChart
                data={currentChart.data}
                margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                barSize={30}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#3F3F46" />
                <XAxis dataKey="name" stroke="#A1A1AA" />
                <YAxis stroke="#A1A1AA" unit={currentChart.unit} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#27272A', border: '1px solid #3F3F46', borderRadius: '0.5rem' }}
                  labelStyle={{ color: '#E4E4E7' }}
                  itemStyle={{ color: '#F87171' }}
                  cursor={{fill: 'rgba(239, 68, 68, 0.1)'}}
                  formatter={(value) => `${value}${currentChart.unit}`}
                />
                <Legend wrapperStyle={{ color: '#A1A1AA' }}/>
                <Bar dataKey={currentChart.dataKey} fill="#EF4444" name={currentChart.dataKey}/>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400">Pro tento graf nejsou k dispozici žádná data.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;