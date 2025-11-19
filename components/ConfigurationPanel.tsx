import React, { useState } from 'react';
import Card from './Card';
import { PlusIcon, TrashIcon } from './icons';
import SearchTermModal from './SearchTermModal';

interface ConfigurationPanelProps {
  apiKey: string;
  setApiKey: (key: string) => void;
  searchTerms: string[];
  setSearchTerms: (terms: string[]) => void;
}

const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({
  apiKey,
  setApiKey,
  searchTerms,
  setSearchTerms,
}) => {
  const [newTerm, setNewTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddTerm = () => {
    const termToAdd = newTerm.trim();
    if (termToAdd && !searchTerms.includes(termToAdd)) {
      setSearchTerms([...searchTerms, termToAdd]);
      setNewTerm('');
    }
  };
  
  const handleAddSelectedTerms = (selectedTerms: string[]) => {
    const termsToAdd = selectedTerms.filter(term => !searchTerms.includes(term));
    setSearchTerms([...searchTerms, ...termsToAdd]);
    setIsModalOpen(false);
  };

  const handleRemoveTerm = (termToRemove: string) => {
    setSearchTerms(searchTerms.filter(term => term !== termToRemove));
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        handleAddTerm();
    }
  };


  return (
    <>
      <Card title="1. Configuration">
        <div>
          <label htmlFor="apiKey" className="block text-sm font-medium text-slate-300 mb-1">
            RapidAPI Key
          </label>
          <input
            type="password"
            id="apiKey"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your RapidAPI Key"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Search Terms
          </label>
          <div className="space-y-2">
              {searchTerms.length === 0 && <p className="text-sm text-slate-400">No search terms added.</p>}
              {searchTerms.map((term, index) => (
                  <div key={index} className="flex items-center gap-2 bg-slate-700 border border-slate-600 rounded-md px-3 py-2">
                      <span className="flex-grow text-white">{term}</span>
                      <button onClick={() => handleRemoveTerm(term)} className="text-slate-400 hover:text-red-400">
                          <TrashIcon />
                      </button>
                  </div>
              ))}
          </div>
          <div className="flex items-center gap-2 mt-3">
              <input
                  type="text"
                  value={newTerm}
                  onChange={(e) => setNewTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-grow bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type to add manually and press Enter..."
              />
              <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-1 text-blue-400 hover:text-blue-300 font-medium whitespace-nowrap"
              >
                  <PlusIcon className="w-4 h-4" />
                  Browse & Add
              </button>
          </div>
        </div>
      </Card>
      <SearchTermModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddTerms={handleAddSelectedTerms}
        existingTerms={searchTerms}
      />
    </>
  );
};

export default ConfigurationPanel;