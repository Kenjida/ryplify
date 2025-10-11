
import React from 'react';
import AddProjectForm from './AddProjectForm';
import ProjectList from './ProjectList';
import Settings from './Settings';
import Dashboard from './Dashboard';
import { useProjectTracker } from '../hooks/useProjectTracker';

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
    deleteProject
  } = useProjectTracker();

  return (
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
  );
};

export default ProjectTimeTrackerAdmin;
