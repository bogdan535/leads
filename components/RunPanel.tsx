
import React from 'react';
import Card from './Card';
import { SearchProgress } from '../types';
import { DownloadIcon } from './icons';

interface RunPanelProps {
  apiCallEstimate: number;
  onStartSearch: () => void;
  onExport: () => void;
  isLoading: boolean;
  progress: SearchProgress;
  hasResults: boolean;
}

const RunPanel: React.FC<RunPanelProps> = ({
  apiCallEstimate,
  onStartSearch,
  onExport,
  isLoading,
  progress,
  hasResults,
}) => {
  const progressPercentage = progress.total > 0 ? (progress.current / progress.total) * 100 : 0;

  return (
    <Card title="3. Run Search & Export">
      <div>
        <p className="text-sm text-slate-400">API Call Estimate: {apiCallEstimate} initial search calls</p>
      </div>
      
      <button
        onClick={onStartSearch}
        disabled={isLoading}
        className="w-full bg-slate-600 text-white rounded-md py-3 px-4 font-semibold text-base hover:bg-slate-500 disabled:bg-slate-700 disabled:cursor-not-allowed disabled:text-slate-400 transition-colors"
      >
        {isLoading ? 'Searching...' : 'Start Search'}
      </button>

      {isLoading && (
        <div className="space-y-2">
            <div className="w-full bg-slate-700 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progressPercentage}%`, transition: 'width 0.3s ease-in-out' }}></div>
            </div>
            <p className="text-xs text-center text-slate-400 truncate">{progress.status}</p>
        </div>
      )}

      {!isLoading && hasResults && (
         <button
            onClick={onExport}
            className="w-full bg-green-600 text-white rounded-md py-3 px-4 font-semibold text-base hover:bg-green-500 disabled:bg-green-800 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
            <DownloadIcon />
            Export to CSV
        </button>
      )}
    </Card>
  );
};

export default RunPanel;
