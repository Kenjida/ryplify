import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface AnalyticsData {
  totalViews: number;
  uniqueVisitors: number;
  viewsPerDay: { [day: string]: number };
  topPages: [string, number][];
}

interface AnalyticsDashboardProps {
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ fetchWithAuth }) => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWithAuth('/api/analytics')
      .then(res => res.json())
      .then(setData)
      .catch(error => {
        console.error('Failed to fetch analytics data:', error);
        setData(null); // Explicitly set data to null on error
      })
      .finally(() => setLoading(false));
  }, [fetchWithAuth]);

  if (loading) {
    return <p>Načítání analytických dat...</p>;
  }

  if (!data) {
    return <p>Nepodařilo se načíst data.</p>;
  }

  const chartData = {
    labels: Object.keys(data.viewsPerDay),
    datasets: [
      {
        label: 'Zobrazení stránek',
        data: Object.values(data.viewsPerDay),
        backgroundColor: 'rgba(220, 38, 38, 0.6)',
        borderColor: 'rgba(220, 38, 38, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Zobrazení stránek za den',
        color: '#cbd5e1'
      },
    },
    scales: {
        x: { ticks: { color: '#cbd5e1' } },
        y: { ticks: { color: '#cbd5e1' } }
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-slate-800 p-4 rounded-lg text-center">
          <h3 className="text-lg text-slate-400">Počet uživatelů (IP)</h3>
          <p className="text-3xl font-bold">{data.uniqueVisitors}</p>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg text-center">
          <h3 className="text-lg text-slate-400">Celkem zobrazení</h3>
          <p className="text-3xl font-bold">{data.totalViews}</p>
        </div>
      </div>
      
      <div className="mb-8 relative h-80">
        <Bar options={chartOptions} data={chartData} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4">Nejnavštěvovanější stránky</h3>
          <ul className="space-y-2">
            {data.topPages.map(([path, count]) => (
              <li key={path} className="flex justify-between bg-slate-800 p-2 rounded">
                <span>{path}</span>
                <span className="font-bold">{count} zobrazení</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4">Přehled podle IP</h3>
          <div className="bg-slate-800 p-4 rounded-lg text-center">
             <Link to="/admin/ips" className="text-red-500 hover:underline">
                Zobrazit detailní přehled podle IP adres &rarr;
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
