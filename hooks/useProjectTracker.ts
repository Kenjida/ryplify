import { useState, useCallback, useEffect } from 'react';
import type { Project } from '../components/types';
import { getProjects, createProject, deleteProject as apiDeleteProject, toggleProjectTimer as apiToggleTimer, updateProject as apiUpdateProject } from '../utils/api';

export const useProjectTracker = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [hourlyRate, setHourlyRate] = useState<number>(500); // This can remain local or be moved to a user settings endpoint later
  const [showInactive, setShowInactive] = useState<boolean>(false);
  const [liveNotes, setLiveNotes] = useState<{[key: string]: string}>({});

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const serverProjects = await getProjects();
        setProjects(serverProjects);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
        // Handle error, e.g., show a notification to the user
      }
    };
    fetchProjects();
  }, []);

  const addProject = useCallback(async (name: string, isFree: boolean) => {
    try {
      const newProject = await createProject({ name, isFree });
      setProjects(prev => [...prev, newProject]);
    } catch (error) {
      console.error("Failed to create project:", error);
    }
  }, []);

  const handleNoteChange = useCallback((id: string, note: string) => {
    setLiveNotes(prev => ({ ...prev, [id]: note }));
  }, []);

  const onToggleTimer = useCallback(async (id: string) => {
    try {
      const note = liveNotes[id] || '';
      const updatedProject = await apiToggleTimer(id, note);
      setProjects(prevProjects => prevProjects.map(p =>
        p.id === id ? updatedProject : p
      ));
      if (updatedProject.startTime === null) { // Timer was stopped
        setLiveNotes(prev => {
          const newNotes = { ...prev };
          delete newNotes[id];
          return newNotes;
        });
      }
    } catch (error) {
      console.error("Failed to toggle timer:", error);
    }
  }, [liveNotes]);

  const onToggleActive = useCallback(async (id: string) => {
    const project = projects.find(p => p.id === id);
    if (!project) return;
    try {
      const updatedProject = await apiUpdateProject(id, { ...project, isActive: !project.isActive });
      setProjects(prev => prev.map(p => p.id === id ? updatedProject : p));
    } catch (error) {
      console.error("Failed to toggle active state:", error);
    }
  }, [projects]);

  const onToggleFree = useCallback(async (id: string) => {
    const project = projects.find(p => p.id === id);
    if (!project) return;
    try {
      const updatedProject = await apiUpdateProject(id, { ...project, isFree: !project.isFree });
      setProjects(prev => prev.map(p => p.id === id ? updatedProject : p));
    } catch (error) {
      console.error("Failed to toggle free state:", error);
    }
  }, [projects]);

  const deleteProject = useCallback(async (id: string) => {
    try {
      await apiDeleteProject(id);
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  }, []);

  const updateProject = useCallback(async (id: string, projectData: Project) => {
    try {
      const updatedProject = await apiUpdateProject(id, projectData);
      setProjects(prev => prev.map(p => (p.id === id ? updatedProject : p)));
      return updatedProject;
    } catch (error) {
      console.error("Failed to update project:", error);
      // Optionally re-throw or handle the error
      throw error;
    }
  }, []);


  return {
    projects,
    setProjects,
    hourlyRate,
    setHourlyRate,
    showInactive,
    setShowInactive,
    liveNotes,
    addProject,
    onToggleTimer,
    onToggleActive,
    onToggleFree,
    handleNoteChange,
    deleteProject,
    updateProject
  };
};
