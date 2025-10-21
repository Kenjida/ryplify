import React, { useState } from 'react';
import AddProjectForm from './AddProjectForm';
import ProjectList from './ProjectList';
import Settings from './Settings';
import Dashboard from './Dashboard';
import EditProjectModal from './EditProjectModal'; // Import the modal
import { useProjectTracker } from '../hooks/useProjectTracker';
import type { Project } from './types';

const ProjectTimeTrackerAdmin: React.FC = () => {
  const {
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
    handleNoteChange,
    deleteProject,
    updateProject // Import updateProject from the hook
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
      alert(`Nepodařilo se uložit projekt: ${error instanceof Error ? error.message : 'Neznámá chyba'}`);
    }
  };

  return (
    <>
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
                onDeleteProject={deleteProject}
                onToggleFree={onToggleFree}
                onEditProject={handleEditProject} // Pass the handler
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
    </>
  );
};

export default ProjectTimeTrackerAdmin;