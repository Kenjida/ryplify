
import React, { useState, useEffect } from 'react';
import type { Project } from './types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ProjectItemProps {
  project: Project;
  hourlyRate: number;
  onToggleTimer: (id: string, isRunning: boolean) => void;
  onToggleActive: (id: string) => void;
  onDeleteProject?: (id: string) => void;
  onToggleFree?: (id: string) => void;
  onEditProject?: (id: string) => void;
  isReadOnly?: boolean;
  liveNote?: string;
  handleNoteChange?: (id: string, note: string) => void;
}

const formatTime = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return [hours, minutes, seconds]
    .map(v => v < 10 ? "0" + v : v)
    .join(":");
};

const ProjectItem: React.FC<ProjectItemProps> = ({ project, hourlyRate, onToggleTimer, onToggleActive, onDeleteProject, onToggleFree, onEditProject, isReadOnly, liveNote, handleNoteChange }) => {
  const [displaySeconds, setDisplaySeconds] = useState(project.totalSeconds);

  useEffect(() => {
    if (project.startTime) {
      const interval = setInterval(() => {
        const elapsed = (Date.now() - (project.startTime ?? 0)) / 1000;
        setDisplaySeconds(project.totalSeconds + elapsed);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setDisplaySeconds(project.totalSeconds);
    }
  }, [project.startTime, project.totalSeconds]);

  const isRunning = project.startTime !== null;
  const cost = (displaySeconds / 3600) * hourlyRate;

  const generateInvoice = () => {
    try {
      const doc = new jsPDF();

      // Title
      doc.setFontSize(22);
      doc.text(`Faktura za projekt: ${project.name}`, 14, 22);

      // Sub-header
      doc.setFontSize(12);
      doc.text(`Datum generovani: ${new Date().toLocaleDateString('cs-CZ')}`, 14, 32);

      // Summary
      doc.setFontSize(14);
      doc.text("Souhrn", 14, 50);
      doc.line(14, 52, 196, 52); // horizontal line
      autoTable(doc, {
          startY: 55,
          head: [['Celkovy cas', 'Hodinova sazba', 'Celkova cena']],
          body: [[formatTime(project.totalSeconds), `${hourlyRate} Kc/hod`, `${cost.toFixed(2)} Kc`]],
          theme: 'striped',
          headStyles: { fillColor: [239, 68, 68] }, // Red color for header
      });

      // Time Entries
      const tableBody = project.timeEntries.map(entry => {
          const startDate = new Date(entry.start).toLocaleString('cs-CZ');
          const endDate = new Date(entry.end).toLocaleString('cs-CZ');
          const duration = formatTime((entry.end - entry.start) / 1000);
          return [startDate, endDate, duration, entry.note];
      });

      autoTable(doc, {
          startY: (doc as any).lastAutoTable.finalY + 15,
          head: [['Zacatek', 'Konec', 'Trvani', 'Poznámka']],
          body: tableBody,
          theme: 'grid',
          headStyles: { fillColor: [239, 68, 68] },
      });

      doc.save(`faktura-${project.name.replace(/\s/g, '_')}.pdf`);
    } catch (error) {
      console.error("Chyba pri generovani PDF:", error);
      alert("Nepodarilo se vygenerovat PDF. Zkontrolujte konzoli pro vice detailu.");
    }
  };


  return (
    <div className={`bg-zinc-800 p-4 rounded-lg shadow-md transition-all duration-300 ${!project.isActive ? 'ring-2 ring-green-500' : isRunning ? 'ring-2 ring-red-500' : ''}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-gray-100 flex items-center">
            {project.name}
            {!project.isActive && <span className="text-green-500 ml-2 text-sm font-normal">(Dokončeno)</span>}
            {project.isFree && !isReadOnly && <span className="text-xs font-medium ml-2 px-2 py-0.5 rounded-full bg-blue-500 text-white">Zdarma</span>}
          </h3>
          <p className="text-3xl font-mono my-2 text-white">{formatTime(displaySeconds)}</p>
          <p className="text-lg text-red-400 font-semibold">
            {project.isFree && !isReadOnly && <span className="text-sm text-gray-400">Potenciál: </span>}
            {cost.toFixed(2)} Kč
          </p>
        </div>
        {!isReadOnly && (
          <div className="flex flex-col items-end gap-2">
            <div className="flex flex-wrap justify-end gap-2">
              {project.isActive && (
                <button
                  onClick={() => onToggleTimer(project.id, isRunning)}
                  className={`px-4 py-2 text-sm font-semibold text-white rounded-md transition-colors duration-300 w-24 ${isRunning ? 'bg-zinc-600 hover:bg-zinc-700' : 'bg-red-600 hover:bg-red-700'}`}>
                  {isRunning ? 'Stop' : 'Start'}
                </button>
              )}
              {!project.isActive && (
                <>
                  <button
                    onClick={generateInvoice}
                    className="px-4 py-2 text-sm font-semibold text-white rounded-md transition-colors duration-300 w-32 bg-rose-600 hover:bg-rose-700">
                    Stáhnout PDF
                  </button>
                  {onDeleteProject && (
                    <button
                      onClick={() => onDeleteProject(project.id)}
                      className="px-4 py-2 text-sm font-semibold text-white rounded-md transition-colors duration-300 w-32 bg-gray-700 hover:bg-gray-600">
                      Smazat
                    </button>
                  )}
                </>
              )}
              {onEditProject && (
                  <button
                      onClick={() => onEditProject(project.id)}
                      className="px-4 py-2 text-sm font-semibold text-white rounded-md transition-colors duration-300 w-24 bg-blue-600 hover:bg-blue-700">
                      Upravit
                  </button>
              )}
            </div>

            <div className="flex flex-col md:flex-row items-end md:items-center mt-2 gap-4">
              <div className="flex items-center">
                <span className="text-sm text-gray-400 mr-2">{project.isActive ? 'Aktivní' : 'Neaktivní'}</span>
                <label htmlFor={`toggle-active-${project.id}`} className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input type="checkbox" id={`toggle-active-${project.id}`} className="sr-only" checked={project.isActive} onChange={() => onToggleActive(project.id)} />
                    <div className="block bg-zinc-600 w-14 h-8 rounded-full"></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${project.isActive ? 'transform translate-x-6 bg-red-500' : ''}`}></div>
                  </div>
                </label>
              </div>
              {onToggleFree && (
                  <div className="flex items-center">
                      <span className="text-sm text-gray-400 mr-2">{project.isFree ? 'Zdarma' : 'Placený'}</span>
                      <label htmlFor={`toggle-free-${project.id}`} className="flex items-center cursor-pointer">
                          <div className="relative">
                              <input type="checkbox" id={`toggle-free-${project.id}`} className="sr-only" checked={project.isFree} onChange={() => onToggleFree(project.id)} />
                              <div className="block bg-zinc-600 w-14 h-8 rounded-full"></div>
                              <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${project.isFree ? 'transform translate-x-6 bg-blue-500' : ''}`}></div>
                          </div>
                      </label>
                  </div>
              )}
            </div>
          </div>
        )}
      </div>
      {isRunning && (
        <div className="mt-4">
            <p className='text-sm text-gray-400 mb-1'>Aktuální stav: <span className='text-gray-200'>{liveNote || "-"}</span></p>
            {!isReadOnly && handleNoteChange && (
                <input 
                    type="text" 
                    value={liveNote || ''} 
                    onChange={(e) => handleNoteChange(project.id, e.target.value)}
                    placeholder="Na čem právě pracujete?"
                    className="w-full bg-zinc-700 border border-zinc-600 rounded-md px-3 py-2 text-white focus:ring-red-500 focus:border-red-500 mt-2"
                />
            )}
        </div>
      )}
    </div>
  );
};

export default ProjectItem;
