import { useState, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { Project, TimeEntry } from '../components/types';

export const useProjectTracker = () => {
  const [projects, setProjects] = useLocalStorage<Project[]>('projects', []);
  const [hourlyRate, setHourlyRate] = useLocalStorage<number>('hourlyRate', 500);
  const [showInactive, setShowInactive] = useState<boolean>(false);
  // Use localStorage for liveNotes to ensure cross-tab sync
  const [liveNotes, setLiveNotes] = useLocalStorage<{[key: string]: string}>('live_notes', {});

  const addProject = useCallback((name: string, isFree: boolean) => {
    const newProject: Project = {
      id: new Date().toISOString(),
      name,
      totalSeconds: 0,
      isActive: true,
      isFree: isFree,
      startTime: null,
      timeEntries: [],
    };
    setProjects(prev => [...prev, newProject]);
  }, [setProjects]);

  const handleNoteChange = useCallback((id: string, note: string) => {
    setLiveNotes(prev => ({ ...prev, [id]: note }));
  }, [setLiveNotes]);

  const onToggleTimer = useCallback((id: string, isRunning: boolean) => {
    if (isRunning) {
      // STOP TIMER
      const project = projects.find(p => p.id === id);
      if (!project || project.startTime === null) return;

      const now = Date.now();
      const startTime = project.startTime;
      const elapsedSeconds = (now - startTime) / 1000;
      const newTimeEntry: TimeEntry = {
        start: startTime,
        end: now,
        note: liveNotes[id] || ''
      };

      setProjects(prevProjects => prevProjects.map(p =>
        p.id === id
          ? { ...p, startTime: null, totalSeconds: p.totalSeconds + elapsedSeconds, timeEntries: [...p.timeEntries, newTimeEntry] }
          : p
      ));

      setLiveNotes(prev => {
        const newNotes = { ...prev };
        delete newNotes[id];
        return newNotes;
      });

    } else {
      // START TIMER
      setProjects(prevProjects => prevProjects.map(p =>
        p.id === id ? { ...p, startTime: Date.now() } : p
      ));
      handleNoteChange(id, '');
    }
  }, [projects, liveNotes, setProjects, setLiveNotes, handleNoteChange]);

  const onToggleActive = useCallback((id: string) => {
    setProjects(prevProjects => 
      prevProjects.map(p => 
        p.id === id ? { ...p, isActive: !p.isActive } : p
      )
    );
  }, [setProjects]);

  const onToggleFree = useCallback((id: string) => {
    setProjects(prevProjects => 
      prevProjects.map(p => 
        p.id === id ? { ...p, isFree: !p.isFree } : p
      )
    );
  }, [setProjects]);

  return {
    projects,
    hourlyRate,
    setHourlyRate,
    showInactive,
    setShowInactive,
    liveNotes,
    addProject,
    onToggleTimer,
    onToggleActive,
    onToggleFree,
    handleNoteChange
  };
};