import React, { useState, useCallback } from 'react';
import AddProjectForm from './components/AddProjectForm';
import ProjectList from './components/ProjectList';
import Settings from './components/Settings';
import Dashboard from './components/Dashboard';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { Project, TimeEntry } from './types';

const App: React.FC = () => {
  const [projects, setProjects] = useLocalStorage<Project[]>('projects', []);
  const [hourlyRate, setHourlyRate] = useLocalStorage<number>('hourlyRate', 500);
  const [showInactive, setShowInactive] = useState<boolean>(false);

  const addProject = (name: string) => {
    const newProject: Project = {
      id: new Date().toISOString(),
      name,
      totalSeconds: 0,
      isActive: true,
      startTime: null,
      timeEntries: [],
    };
    setProjects([...projects, newProject]);
  };

  const onToggleTimer = useCallback((id: string, isRunning: boolean) => {
    setProjects(prevProjects =>
      prevProjects.map(p => {
        if (p.id === id) {
          if (isRunning) {
            // Stop timer
            const now = Date.now();
            const startTime = p.startTime ?? now;
            const elapsedSeconds = (now - startTime) / 1000;
            const newTimeEntry: TimeEntry = { start: startTime, end: now };
            return {
              ...p,
              startTime: null,
              totalSeconds: p.totalSeconds + elapsedSeconds,
              timeEntries: [...p.timeEntries, newTimeEntry],
            };
          } else {
            // Start timer
            return { ...p, startTime: Date.now() };
          }
        }
        return p;
      })
    );
  }, [setProjects]);

  const onToggleActive = useCallback((id: string) => {
    setProjects(prevProjects => 
      prevProjects.map(p => 
        p.id === id ? { ...p, isActive: !p.isActive } : p
      )
    );
  }, [setProjects]);


  return (
    <div className="min-h-screen bg-zinc-900 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-600 mb-2 pb-2">
            Project Time Tracker
          </h1>
           <div className="flex justify-center items-center mt-4" aria-label="Ryplify Logo">
            <svg width="150" height="40" viewBox="0 0 150 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <text x="5" y="30" fontFamily="Segoe UI, -apple-system, BlinkMacSystemFont, sans-serif" fontSize="28" fontWeight="bold" fill="white">
                    <tspan fill="#EF4444">Ry</tspan>plify
                </text>
            </svg>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Dashboard projects={projects} hourlyRate={hourlyRate} />
            <div>
              <h2 className="text-3xl font-bold mb-4 text-red-500">Projekty</h2>
               <ProjectList
                  projects={projects}
                  hourlyRate={hourlyRate}
                  showInactive={showInactive}
                  onToggleTimer={onToggleTimer}
                  onToggleActive={onToggleActive}
               />
            </div>
          </div>
          <div className="space-y-8">
            <AddProjectForm onAddProject={addProject} />
            <Settings 
                hourlyRate={hourlyRate} 
                setHourlyRate={setHourlyRate} 
                showInactive={showInactive} 
                setShowInactive={setShowInactive} 
            />
          </div>
        </main>

        <footer className="text-center mt-12 text-gray-500">
            <p>Made by Ryplify</p>
        </footer>
      </div>
    </div>
  );
};

export default App;