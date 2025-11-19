
import React, { useState, useMemo, useEffect } from 'react';
import { businessCategories } from '../data/categories';
import { CloseIcon } from './icons';

interface SearchTermModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTerms: (terms: string[]) => void;
  existingTerms: string[];
}

const SearchTermModal: React.FC<SearchTermModalProps> = ({
  isOpen,
  onClose,
  onAddTerms,
  existingTerms,
}) => {
  const [filter, setFilter] = useState('');
  const [selectedTerms, setSelectedTerms] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Reset state when modal is opened/closed
    setFilter('');
    setSelectedTerms(new Set());
  }, [isOpen]);

  const filteredCategories = useMemo(() => {
    if (!filter) return businessCategories;
    return businessCategories.filter(category =>
      category.toLowerCase().includes(filter.toLowerCase())
    );
  }, [filter]);

  const handleToggleTerm = (term: string) => {
    setSelectedTerms(prev => {
      const newSet = new Set(prev);
      if (newSet.has(term)) {
        newSet.delete(term);
      } else {
        newSet.add(term);
      }
      return newSet;
    });
  };

  const handleAddClick = () => {
    onAddTerms(Array.from(selectedTerms));
  };
  
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className="bg-slate-800 border border-slate-700 rounded-xl shadow-lg w-full max-w-2xl flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <header className="p-4 border-b border-slate-700 flex justify-between items-center">
          <h2 id="modal-title" className="text-xl font-semibold text-white">Select Search Terms</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white" aria-label="Close">
            <CloseIcon />
          </button>
        </header>

        <div className="p-4">
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search categories..."
          />
        </div>

        <main className="p-4 overflow-y-auto flex-grow">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
            {filteredCategories.map(term => {
              const isExisting = existingTerms.includes(term);
              const isSelected = selectedTerms.has(term);
              return (
                <label key={term} className={`flex items-center space-x-3 p-2 rounded-md transition-colors ${isExisting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-slate-700'}`}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    disabled={isExisting}
                    onChange={() => handleToggleTerm(term)}
                    className="h-4 w-4 rounded bg-slate-600 border-slate-500 text-blue-500 focus:ring-blue-600 disabled:opacity-70"
                  />
                  <span className="text-sm text-slate-300">{term}</span>
                </label>
              );
            })}
             {filteredCategories.length === 0 && <p className="text-slate-400 col-span-2 text-center py-4">No categories match your search.</p>}
          </div>
        </main>
        
        <footer className="p-4 border-t border-slate-700 flex justify-end items-center gap-3">
            <p className="text-sm text-slate-400 mr-auto">{selectedTerms.size} selected</p>
            <button
                onClick={onClose}
                className="bg-slate-600 text-white rounded-md py-2 px-4 font-semibold text-sm hover:bg-slate-500 transition-colors"
            >
                Cancel
            </button>
            <button
                onClick={handleAddClick}
                disabled={selectedTerms.size === 0}
                className="bg-blue-600 text-white rounded-md py-2 px-4 font-semibold text-sm hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed disabled:text-slate-400 transition-colors"
            >
                Add Selected Terms
            </button>
        </footer>
      </div>
    </div>
  );
};

export default SearchTermModal;
