
import React from 'react';
import ProjectItem from './ProjectItem';
import type { Project } from '../types';

interface ProjectListProps {
  projects: Project[];
  hourlyRate: number;
  showInactive: boolean;
  onToggleTimer: (id: string, isRunning: boolean) => void;
  onToggleActive: (id: string) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, hourlyRate, showInactive, onToggleTimer, onToggleActive }) => {
  const filteredProjects = showInactive ? projects : projects.filter(p => p.isActive);

  if (filteredProjects.length === 0) {
    return (
        <div className="text-center py-10">
            <p className="text-gray-400">Žádné projekty k zobrazení. Přidejte nějaký, abyste mohli začít!</p>
        </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredProjects.map(project => (
        <ProjectItem
          key={project.id}
          project={project}
          hourlyRate={hourlyRate}
          onToggleTimer={onToggleTimer}
          onToggleActive={onToggleActive}
        />
      ))}
    </div>
  );
};

export default ProjectList;
