
import React, { useState } from 'react';

interface AddProjectFormProps {
  onAddProject: (name: string) => void;
}

const AddProjectForm: React.FC<AddProjectFormProps> = ({ onAddProject }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAddProject(name.trim());
      setName('');
    }
  };

  return (
    <div className="bg-zinc-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-red-500">Přidat nový projekt</h2>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Název projektu"
          className="flex-grow bg-zinc-700 border border-zinc-600 rounded-md px-3 py-2 text-white focus:ring-red-500 focus:border-red-500"
        />
        <button
          type="submit"
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300"
        >
          Přidat
        </button>
      </form>
    </div>
  );
};

export default AddProjectForm;
