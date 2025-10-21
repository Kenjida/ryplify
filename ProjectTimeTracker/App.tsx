import React, { useState } from 'react';
import AddProjectForm from './components/AddProjectForm';
import ProjectList from './components/ProjectList';
import Settings from './components/Settings';
import Dashboard from './components/Dashboard';
import EditProjectModal from './components/EditProjectModal';
import { useProjectTracker } from '../hooks/useProjectTracker'; // Corrected path
import type { Project } from './types';

const App: React.FC = () => {
  const {
    projects,
    hourlyRate,
    setHourlyRate,
    showInactive,
    setShowInactive,
    addProject,
    onToggleTimer,
    onToggleActive,
    onToggleFree,
    handleNoteChange,
    deleteProject,
    updateProject,
    liveNotes
  } = useProjectTracker();

  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const handleEditProject = (id: string) => {
    const projectToEdit = projects.find(p => p.id === id);
    if (projectToEdit) {
      setEditingProject(projectToEdit);
    }
  };

  const handleCloseModal = () => {
    setEditingProject(null);
  };

  const handleSaveProject = async (updatedProject: Project) => {
    try {
      await updateProject(updatedProject.id, updatedProject);
      setEditingProject(null); // Close modal on successful save
    } catch (error) {
      console.error("Failed to save project:", error);
      // Optionally, show an error message to the user
    }
  };

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
                  onToggleTimer={(id) => onToggleTimer(id)}
                  onToggleActive={onToggleActive}
                  onToggleFree={onToggleFree}
                  onDeleteProject={deleteProject}
                  onEditProject={handleEditProject}
                  liveNotes={liveNotes}
                  handleNoteChange={handleNoteChange}
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

        {editingProject && (
          <EditProjectModal
            project={editingProject}
            onClose={handleCloseModal}
            onSave={handleSaveProject}
          />
        )}

        <footer className="text-center mt-12 text-gray-500">
            <p>Made by Ryplify</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
