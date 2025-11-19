import React, { useState, useMemo, useCallback } from 'react';
import { CsvData, SearchProgress, SearchResult } from './types';
import { processCsvFile, exportResultsToCsv } from './services/csvService';
import { searchBusinesses } from './services/apiService';
import ConfigurationPanel from './components/ConfigurationPanel';
import SearchModePanel from './components/SearchModePanel';
import RunPanel from './components/RunPanel';

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [searchTerms, setSearchTerms] = useState<string[]>([]);
  const maxResults = 500;

  const [csvData, setCsvData] = useState<CsvData | null>(null);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [cityColumn, setCityColumn] = useState<string>('');
  const [stateColumn, setStateColumn] = useState<string>('');
  const [countryColumn, setCountryColumn] = useState<string>('');
  
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<SearchProgress>({ current: 0, total: 0, status: 'Idle' });
  const [error, setError] = useState<string | null>(null);

  const apiCallEstimate = useMemo(() => {
    return (csvData?.rows.length || 0) * searchTerms.length;
  }, [csvData, searchTerms]);

  const handleFileChange = async (file: File | null) => {
    if (file) {
      setCsvFile(file);
      try {
        const data = await processCsvFile(file);
        setCsvData(data);
        if (data.headers.length > 0) {
            // Auto-select columns if common names are found
            const lowerCaseHeaders = data.headers.map(h => h.toLowerCase());
            const city = data.headers[lowerCaseHeaders.indexOf('city')] || data.headers[0];
            const state = data.headers[lowerCaseHeaders.indexOf('state')] || '';
            const country = data.headers[lowerCaseHeaders.indexOf('country')] || '';
            setCityColumn(city);
            setStateColumn(state);
            setCountryColumn(country);
        }
      } catch (e) {
        console.error(e);
        setError('Failed to parse CSV file. Please ensure it is a valid CSV.');
        setCsvFile(null);
        setCsvData(null);
      }
    } else {
        setCsvFile(null);
        setCsvData(null);
    }
  };
  
  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleStartSearch = useCallback(async () => {
    if (!apiKey) { setError('RapidAPI Key is required.'); return; }
    if (searchTerms.length === 0) { setError('At least one search term is required.'); return; }
    if (!csvData || csvData.rows.length === 0) { setError('A CSV file with location data is required.'); return; }
    if (!cityColumn) { setError('Please map the City column.'); return; }
    if (!countryColumn) { setError('Please map the Country column.'); return; }


    setIsLoading(true);
    setError(null);
    setSearchResults([]);
    const totalRequests = apiCallEstimate;
    setProgress({ current: 0, total: totalRequests, status: 'Starting search...' });

    const allResults: any[] = [];
    let currentRequest = 0;

    try {
      for (const row of csvData.rows) {
        const city = row[cityColumn];
        const state = stateColumn ? row[stateColumn] : '';
        const country = row[countryColumn];
        
        if (!city || !country) continue;

        for (const term of searchTerms) {
          currentRequest++;
          const locationString = [city, state].filter(Boolean).join(', ');
          const status = `Searching for "${term}" in ${locationString}... (${currentRequest}/${totalRequests})`;
          setProgress({ current: currentRequest, total: totalRequests, status });
          
          const query = `${term} in ${locationString}`;

          try {
            const results = await searchBusinesses(apiKey, query, maxResults, country);
            const resultsWithMeta = results.map(r => ({
                ...r,
                searchTerm: term,
                location: { city, state, country }
            }));
            allResults.push(...resultsWithMeta);
            setSearchResults(prev => [...prev, ...resultsWithMeta]);

          } catch (e: any) {
             console.error(`Error searching for ${query}:`, e.message);
             setError(`An error occurred on request ${currentRequest}: ${e.message}. Moving to next request.`);
             // continue to next iteration despite error
          }
          await sleep(100); // Small delay to avoid hitting rate limits too hard
        }
      }
      setProgress({ current: totalRequests, total: totalRequests, status: 'Search complete!' });
    } catch (e: any) {
        setError(`A critical error occurred: ${e.message}`);
        setProgress(prev => ({ ...prev, status: 'Search failed.' }));
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, searchTerms, csvData, cityColumn, stateColumn, countryColumn, apiCallEstimate]);

  const handleExport = () => {
      const locations = csvData?.rows.map(row => ({
          city: row[cityColumn],
          state: row[stateColumn],
          country: row[countryColumn]
      })) || [];
      exportResultsToCsv(searchResults, searchTerms, locations);
  };

  return (
    <div className="min-h-screen text-slate-200 font-sans p-4 sm:p-8">
      <header className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-white">Find Business Leads</h1>
        <p className="text-slate-400 mt-2">Find business leads with deep data enrichment, and more.</p>
      </header>

      {error && (
        <div className="max-w-4xl mx-auto bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg relative mb-6" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError(null)}>
            <svg className="fill-current h-6 w-6 text-red-400" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
          </span>
        </div>
      )}

      <main className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-7xl mx-auto">
        <div className="lg:col-span-3 flex flex-col gap-8">
          <ConfigurationPanel
            apiKey={apiKey}
            setApiKey={setApiKey}
            searchTerms={searchTerms}
            setSearchTerms={setSearchTerms}
          />
          <SearchModePanel
            csvFile={csvFile}
            onFileChange={handleFileChange}
            csvData={csvData}
            cityColumn={cityColumn}
            setCityColumn={setCityColumn}
            stateColumn={stateColumn}
            setStateColumn={setStateColumn}
            countryColumn={countryColumn}
            setCountryColumn={setCountryColumn}
          />
        </div>
        <div className="lg:col-span-2">
            <RunPanel
                apiCallEstimate={apiCallEstimate}
                onStartSearch={handleStartSearch}
                onExport={handleExport}
                isLoading={isLoading}
                progress={progress}
                hasResults={searchResults.length > 0}
            />
        </div>
      </main>
    </div>
  );
};

export default App;