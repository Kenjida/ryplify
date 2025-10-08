import React from 'react';
import { Link } from 'react-router-dom';
import ProjectList from '../components/ProjectList';
import { useProjectTracker } from '../hooks/useProjectTracker';

const ProjectPage: React.FC = () => {
  const {
    projects,
    hourlyRate,
    onToggleTimer,
    onToggleActive,
    onToggleFree,
    liveNotes,
    handleNoteChange
  } = useProjectTracker();

  return (
    <div className="container mx-auto px-4 py-8 text-slate-300">
      <div className="mb-4">
        <Link to="/" className="text-slate-400 hover:text-white transition-colors">
          &larr; Zpět na hlavní stránku
        </Link>
      </div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Přehled projektů</h1>
        <button 
          onClick={() => window.location.reload()}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Obnovit
        </button>
      </div>
      <ProjectList
        projects={projects}
        hourlyRate={hourlyRate}
        showInactive={true}
        onToggleTimer={onToggleTimer}
        onToggleActive={onToggleActive}
        onToggleFree={onToggleFree}
        isReadOnly={true}
        liveNotes={liveNotes}
        handleNoteChange={handleNoteChange}
      />
    </div>
  );
};

export default ProjectPage;