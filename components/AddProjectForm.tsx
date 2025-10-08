
import React, { useState } from 'react';

interface AddProjectFormProps {
  onAddProject: (name: string, isFree: boolean) => void;
}

const AddProjectForm: React.FC<AddProjectFormProps> = ({ onAddProject }) => {
  const [name, setName] = useState('');
  const [isFree, setIsFree] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAddProject(name.trim(), isFree);
      setName('');
      setIsFree(false);
    }
  };

  return (
    <div className="bg-zinc-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-red-500">Přidat nový projekt</h2>
      <form onSubmit={handleSubmit}>
        <div className="flex gap-2 mb-4">
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
        </div>
        <div className="flex items-center">
            <input
                id="is-free"
                type="checkbox"
                checked={isFree}
                onChange={(e) => setIsFree(e.target.checked)}
                className="h-4 w-4 rounded border-zinc-600 bg-zinc-700 text-red-600 focus:ring-red-500"
            />
            <label htmlFor="is-free" className="ml-2 block text-sm text-gray-300">
                Označit jako zdarma (pro vlastní projekty)
            </label>
        </div>
      </form>
    </div>
  );
};

export default AddProjectForm;
