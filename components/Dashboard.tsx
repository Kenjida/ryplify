
import React, { useState, useMemo } from 'react';
import type { Project } from './types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  projects: Project[];
  hourlyRate: number;
}

const formatTimeForChart = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
};

const Dashboard: React.FC<DashboardProps> = ({ projects, hourlyRate }) => {
  const [currentChartIndex, setCurrentChartIndex] = useState(0);

  const paidProjects = useMemo(() => projects.filter(p => !p.isFree), [projects]);
  const freeProjects = useMemo(() => projects.filter(p => p.isFree), [projects]);

  // --- Data Calculations ---
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const calculateTotalSeconds = (projectList: Project[], filterFn: (entryDate: Date) => boolean): number => {
    return projectList.reduce((total, p) => {
      const projectSeconds = p.timeEntries
        .filter(entry => filterFn(new Date(entry.end)))
        .reduce((sum, entry) => sum + (entry.end - entry.start) / 1000, 0);
      return total + projectSeconds;
    }, 0);
  };

  // Paid projects calculations
  const monthlySeconds = calculateTotalSeconds(paidProjects, date => date.getMonth() === currentMonth && date.getFullYear() === currentYear);
  const yearlySeconds = calculateTotalSeconds(paidProjects, date => date.getFullYear() === currentYear);
  const allTimeSeconds = calculateTotalSeconds(paidProjects, () => true);
  const monthlyCost = (monthlySeconds / 3600) * hourlyRate;
  const yearlyCost = (yearlySeconds / 3600) * hourlyRate;
  const totalCost = (allTimeSeconds / 3600) * hourlyRate;

  // Free projects calculations
  const potentialProfit = freeProjects.reduce((sum, p) => sum + (p.totalSeconds / 3600) * hourlyRate, 0);

  // --- Chart Data ---
  const topProjectsData = paidProjects
    .filter(p => p.isActive)
    .map(p => ({ name: p.name, Cena: parseFloat(((p.totalSeconds / 3600) * hourlyRate).toFixed(2)) }))
    .sort((a, b) => b.Cena - a.Cena)
    .slice(0, 5);

  const projectsByMonthData = paidProjects.reduce((acc, project) => {
    const key = new Date(project.id).toISOString().slice(0, 7);
    if (!acc[key]) acc[key] = { name: key, Počet: 0 };
    acc[key].Počet++;
    return acc;
  }, {} as Record<string, { name: string, Počet: number }>);

  const earningsByYearData = paidProjects.reduce((acc, project) => {
    project.timeEntries.forEach(entry => {
      const year = new Date(entry.end).getFullYear();
      const earnings = ((entry.end - entry.start) / 1000 / 3600) * hourlyRate;
      if (!acc[year]) acc[year] = { name: String(year), Zisk: 0 };
      acc[year].Zisk += earnings;
    });
    return acc;
  }, {} as Record<string, { name: string, Zisk: number }>);

  const monthNames = ["Led", "Úno", "Bře", "Dub", "Kvě", "Čvn", "Čvc", "Srp", "Zář", "Říj", "Lis", "Pro"];
  const earningsByMonthData = paidProjects.reduce((acc, project) => {
    project.timeEntries.forEach(entry => {
      const date = new Date(entry.end);
      if (date.getFullYear() === currentYear) {
        const month = date.getMonth();
        const key = monthNames[month];
        const earnings = ((entry.end - entry.start) / 1000 / 3600) * hourlyRate;
        if (!acc[key]) acc[key] = { name: key, Zisk: 0, monthIndex: month };
        acc[key].Zisk += earnings;
      }
    });
    return acc;
  }, {} as Record<string, { name: string, Zisk: number, monthIndex: number }>);

  const freeProjectsTimeData = freeProjects.map(p => ({
      name: p.name,
      Hodiny: parseFloat((p.totalSeconds / 3600).toFixed(2)),
  }));

  const potentialProfitByYearData = freeProjects.reduce((acc, project) => {
    project.timeEntries.forEach(entry => {
      const year = new Date(entry.end).getFullYear();
      const earnings = ((entry.end - entry.start) / 1000 / 3600) * hourlyRate;
      if (!acc[year]) acc[year] = { name: String(year), "Možný zisk": 0 };
      acc[year]["Možný zisk"] += earnings;
    });
    return acc;
  }, {} as Record<string, { name: string, "Možný zisk": number }>);

  const potentialProfitByMonthData = freeProjects.reduce((acc, project) => {
    project.timeEntries.forEach(entry => {
      const date = new Date(entry.end);
      if (date.getFullYear() === currentYear) {
        const month = date.getMonth();
        const key = monthNames[month];
        const earnings = ((entry.end - entry.start) / 1000 / 3600) * hourlyRate;
        if (!acc[key]) acc[key] = { name: key, "Možný zisk": 0, monthIndex: month };
        acc[key]["Možný zisk"] += earnings;
      }
    });
    return acc;
  }, {} as Record<string, { name: string, "Možný zisk": number, monthIndex: number }>);


  const charts = [
    { title: "Top 5 nejvýnosnějších projektů", data: topProjectsData, dataKey: "Cena", unit: " Kč", color: "#EF4444" },
    { title: "Nové placené projekty za měsíc", data: Object.values(projectsByMonthData).sort((a,b) => a.name.localeCompare(b.name)), dataKey: "Počet", unit: "", color: "#EF4444" },
    { title: "Celkový zisk za roky", data: Object.values(earningsByYearData).sort((a,b) => a.name.localeCompare(b.name)).map(d => ({ ...d, Zisk: parseFloat(d.Zisk.toFixed(2)) })), dataKey: "Zisk", unit: " Kč", color: "#EF4444" },
    { title: "Zisky za měsíce (tento rok)", data: Object.values(earningsByMonthData).sort((a,b) => a.monthIndex - b.monthIndex).map(({ name, Zisk }) => ({ name, Zisk: parseFloat(Zisk.toFixed(2)) })), dataKey: "Zisk", unit: " Kč", color: "#EF4444" },
    { title: "Čas na bezplatných projektech", data: freeProjectsTimeData, dataKey: "Hodiny", unit: "h", color: "#3B82F6" },
    { title: "Možný zisk za roky", data: Object.values(potentialProfitByYearData).sort((a,b) => a.name.localeCompare(b.name)).map(d => ({ ...d, "Možný zisk": parseFloat(d["Možný zisk"].toFixed(2)) })), dataKey: "Možný zisk", unit: " Kč", color: "#3B82F6" },
    { title: "Možný zisk za měsíce (tento rok)", data: Object.values(potentialProfitByMonthData).sort((a,b) => a.monthIndex - b.monthIndex).map(({ name, "Možný zisk": pZisk }) => ({ name, "Možný zisk": parseFloat(pZisk.toFixed(2)) })), dataKey: "Možný zisk", unit: " Kč", color: "#3B82F6" },
  ];

  const currentChart = charts[currentChartIndex];
  const goToNextChart = () => setCurrentChartIndex((prev) => (prev + 1) % charts.length);
  const goToPrevChart = () => setCurrentChartIndex((prev) => (prev - 1 + charts.length) % charts.length);

  return (
    <div className="bg-zinc-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-red-500">Přehled</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
        <div className="bg-blue-900/50 p-4 rounded-lg text-center border border-blue-700">
          <h3 className="text-lg font-semibold text-blue-300">Možný zisk</h3>
          <p className="text-3xl font-bold text-blue-400 mt-2">{potentialProfit.toFixed(2)} Kč</p>
        </div>
      </div>

      <div className="bg-zinc-700 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-4 px-2">
            <button onClick={goToPrevChart} className="bg-zinc-600 hover:bg-zinc-500 text-white font-bold p-2 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg></button>
            <h3 className="text-xl font-semibold text-gray-200 text-center">{currentChart.title}</h3>
            <button onClick={goToNextChart} className="bg-zinc-600 hover:bg-zinc-500 text-white font-bold p-2 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg></button>
        </div>
        <div style={{ width: '100%', height: 300 }}>
          {currentChart.data.length > 0 ? (
            <ResponsiveContainer>
              <BarChart data={currentChart.data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }} barSize={30}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3F3F46" />
                <XAxis dataKey="name" stroke="#A1A1AA" />
                <YAxis stroke="#A1A1AA" unit={currentChart.unit} />
                <Tooltip contentStyle={{ backgroundColor: '#27272A', border: '1px solid #3F3F46' }} labelStyle={{ color: '#E4E4E7' }} itemStyle={{ color: currentChart.color }} cursor={{fill: 'rgba(239, 68, 68, 0.1)'}} formatter={(value) => `${value}${currentChart.unit}`}/>
                <Legend wrapperStyle={{ color: '#A1A1AA' }}/>
                <Bar dataKey={currentChart.dataKey} fill={currentChart.color} name={currentChart.dataKey}/>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full"><p className="text-gray-400">Pro tento graf nejsou k dispozici žádná data.</p></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
