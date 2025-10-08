import React from 'react';

interface SettingsProps {
  hourlyRate: number;
  setHourlyRate: (rate: number) => void;
  showInactive: boolean;
  setShowInactive: (show: boolean) => void;
}

const Settings: React.FC<SettingsProps> = ({ hourlyRate, setHourlyRate, showInactive, setShowInactive }) => {
  return (
    <div className="bg-zinc-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-red-500">Nastavení</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-300 mb-1">
            Hodinová sazba (Kč)
          </label>
          <input
            type="number"
            id="hourlyRate"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(Number(e.target.value))}
            className="w-full bg-zinc-700 border border-zinc-600 rounded-md px-3 py-2 text-white focus:ring-red-500 focus:border-red-500"
            placeholder="např. 500"
          />
        </div>
        <div className="flex items-center">
          <input
            id="show-inactive"
            type="checkbox"
            checked={showInactive}
            onChange={(e) => setShowInactive(e.target.checked)}
            className="h-4 w-4 rounded border-zinc-600 bg-zinc-700 text-red-600 focus:ring-red-500"
          />
          <label htmlFor="show-inactive" className="ml-2 block text-sm text-gray-300">
            Zobrazit neaktivní projekty
          </label>
        </div>
      </div>
    </div>
  );
};

export default Settings;