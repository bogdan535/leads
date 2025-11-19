
import React from 'react';
import Card from './Card';
import { CsvData } from '../types';
import { UploadIcon } from './icons';

interface SearchModePanelProps {
  csvFile: File | null;
  onFileChange: (file: File | null) => void;
  csvData: CsvData | null;
  cityColumn: string;
  setCityColumn: (col: string) => void;
  stateColumn: string;
  setStateColumn: (col: string) => void;
  countryColumn: string;
  setCountryColumn: (col: string) => void;
}

const SearchModePanel: React.FC<SearchModePanelProps> = ({
  csvFile,
  onFileChange,
  csvData,
  cityColumn,
  setCityColumn,
  stateColumn,
  setStateColumn,
  countryColumn,
  setCountryColumn,
}) => {
  return (
    <Card title="2. Search Mode">
      <div>
        <label htmlFor="file-upload" className="w-full cursor-pointer">
            <div className="flex flex-col items-center justify-center w-full h-24 border-2 border-slate-600 border-dashed rounded-lg bg-slate-700/50 hover:bg-slate-700">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadIcon className="w-8 h-8 mb-2 text-slate-400" />
                    {csvFile ? (
                        <p className="text-sm text-slate-300"><span className="font-semibold">{csvFile.name}</span></p>
                    ) : (
                        <p className="text-sm text-slate-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    )}
                </div>
                <input id="file-upload" type="file" className="hidden" accept=".csv" onChange={(e) => onFileChange(e.target.files ? e.target.files[0] : null)} />
            </div>
        </label>
      </div>
      
      {csvData && csvData.headers.length > 0 && (
        <div>
            <h3 className="text-md font-medium text-slate-300 mb-2">Map Columns</h3>
            <p className="text-xs text-slate-400 mb-4">
                Your CSV must contain City and Country columns. Country should be a 2-letter code (e.g., US, CA). State/Province is optional.
            </p>
            <div className="space-y-4">
                <div>
                    <label htmlFor="cityColumn" className="block text-sm font-medium text-slate-300 mb-1">
                        City Column
                    </label>
                    <select
                        id="cityColumn"
                        value={cityColumn}
                        onChange={(e) => setCityColumn(e.target.value)}
                        className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">-- Select --</option>
                        {csvData.headers.map(header => <option key={header} value={header}>{header}</option>)}
                    </select>
                </div>
                 <div>
                    <label htmlFor="stateColumn" className="block text-sm font-medium text-slate-300 mb-1">
                        State / Province Column (Optional)
                    </label>
                    <select
                        id="stateColumn"
                        value={stateColumn}
                        onChange={(e) => setStateColumn(e.target.value)}
                        className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">-- Select --</option>
                        {csvData.headers.map(header => <option key={header} value={header}>{header}</option>)}
                    </select>
                </div>
                 <div>
                    <label htmlFor="countryColumn" className="block text-sm font-medium text-slate-300 mb-1">
                        Country Column
                    </label>
                    <select
                        id="countryColumn"
                        value={countryColumn}
                        onChange={(e) => setCountryColumn(e.target.value)}
                        className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">-- Select --</option>
                        {csvData.headers.map(header => <option key={header} value={header}>{header}</option>)}
                    </select>
                </div>
            </div>
        </div>
      )}
    </Card>
  );
};

export default SearchModePanel;
