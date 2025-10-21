import React, { useState, useEffect } from 'react';
import type { Project, TimeEntry } from './types';

interface EditProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onSave: (updatedProject: Project) => void;
}

// Helper to format timestamp to yyyy-MM-ddTHH:mm for datetime-local input
const formatDateTimeLocal = (timestamp: number) => {
  const date = new Date(timestamp);
  // Adjust for timezone offset
  const timezoneOffset = date.getTimezoneOffset() * 60000;
  const adjustedDate = new Date(date.getTime() - timezoneOffset);
  return adjustedDate.toISOString().slice(0, 16);
};

const EditProjectModal: React.FC<EditProjectModalProps> = ({ project, onClose, onSave }) => {
  const [editedProject, setEditedProject] = useState<Project | null>(null);

  useEffect(() => {
    // Deep copy of the project to avoid mutating the original state
    if (project) {
      setEditedProject(JSON.parse(JSON.stringify(project)));
    }
  }, [project]);

  if (!editedProject) return null;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedProject({ ...editedProject, name: e.target.value });
  };

  const handleTimeEntryChange = (index: number, field: keyof TimeEntry, value: string) => {
    const updatedEntries = [...editedProject.timeEntries];
    if (field === 'start' || field === 'end') {
      // Convert local datetime string back to timestamp
      updatedEntries[index] = { ...updatedEntries[index], [field]: new Date(value).getTime() };
    } else {
      updatedEntries[index] = { ...updatedEntries[index], [field]: value };
    }
    setEditedProject({ ...editedProject, timeEntries: updatedEntries });
  };

  const addTimeEntry = () => {
    const now = Date.now();
    const newEntry: TimeEntry = { start: now, end: now, note: '' };
    setEditedProject({
      ...editedProject,
      timeEntries: [...editedProject.timeEntries, newEntry],
    });
  };

  const removeTimeEntry = (index: number) => {
    const updatedEntries = editedProject.timeEntries.filter((_, i) => i !== index);
    setEditedProject({ ...editedProject, timeEntries: updatedEntries });
  };

  const handleSave = () => {
    onSave(editedProject);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-zinc-800 text-white rounded-lg shadow-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Upravit Projekt</h2>
        
        <div className="mb-4">
          <label htmlFor="projectName" className="block text-sm font-medium text-gray-300 mb-1">Název Projektu</label>
          <input
            type="text"
            id="projectName"
            value={editedProject.name}
            onChange={handleNameChange}
            className="w-full bg-zinc-700 border border-zinc-600 rounded-md px-3 py-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>

        <h3 className="text-xl font-semibold mb-2">Časové Záznamy</h3>
        <div className="space-y-3">
          {editedProject.timeEntries.map((entry, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center bg-zinc-700 p-3 rounded">
              <div className="col-span-1 md:col-span-2">
                <label className="text-xs text-gray-400">Start</label>
                <input
                  type="datetime-local"
                  value={formatDateTimeLocal(entry.start)}
                  onChange={(e) => handleTimeEntryChange(index, 'start', e.target.value)}
                  className="w-full bg-zinc-600 border-zinc-500 rounded p-1 text-sm"
                />
              </div>
              <div className="col-span-1 md:col-span-2">
                <label className="text-xs text-gray-400">Konec</label>
                <input
                  type="datetime-local"
                  value={formatDateTimeLocal(entry.end)}
                  onChange={(e) => handleTimeEntryChange(index, 'end', e.target.value)}
                  className="w-full bg-zinc-600 border-zinc-500 rounded p-1 text-sm"
                />
              </div>
              <div className="col-span-1 md:col-span-3">
                 <label className="text-xs text-gray-400">Poznámka</label>
                <input
                  type="text"
                  placeholder="Poznámka"
                  value={entry.note}
                  onChange={(e) => handleTimeEntryChange(index, 'note', e.target.value)}
                  className="w-full bg-zinc-600 border-zinc-500 rounded p-1 text-sm"
                />
              </div>
              <div className="col-span-1 md:col-span-1 flex items-end">
                <button onClick={() => removeTimeEntry(index)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded w-full text-sm">
                  Smazat
                </button>
              </div>
            </div>
          ))}
        </div>

        <button onClick={addTimeEntry} className="mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Přidat Záznam
        </button>

        <div className="flex justify-end mt-6 space-x-3">
          <button onClick={onClose} className="bg-zinc-600 hover:bg-zinc-700 text-white font-bold py-2 px-4 rounded">
            Zrušit
          </button>
          <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Uložit Změny
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProjectModal;
