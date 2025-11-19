
import { CsvData, SearchResult } from '../types';

// A simple CSV parser that handles quoted fields.
// For very large or complex CSVs, a dedicated library like PapaParse is recommended.
const parseCsv = (csvText: string): CsvData => {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    if (values.length === headers.length) {
      const row = headers.reduce((acc, header, index) => {
        acc[header] = values[index].trim().replace(/"/g, '');
        return acc;
      }, {} as Record<string, string>);
      rows.push(row);
    }
  }
  return { headers, rows };
};


export const processCsvFile = (file: File): Promise<CsvData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (text) {
          resolve(parseCsv(text));
        } else {
          reject(new Error("File is empty or could not be read."));
        }
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
};

export const exportResultsToCsv = (results: SearchResult[], searchTerms: string[], locations: Record<string, string>[]) => {
    if (results.length === 0) {
        alert("No results to export.");
        return;
    }

    const headers = [
        'Search Term', 'Search City', 'Search State', 'Search Country',
        'Name', 'Phone Number', 'Full Address', 'Website',
        'Rating', 'Review Count', 'Price Level', 'Types',
        'Latitude', 'Longitude', 'Place Link'
    ];
    
    // Create a map for quick lookup
    const locationMap = new Map();
    locations.forEach((loc, index) => {
        locationMap.set(index, loc);
    });

    const csvRows = [headers.join(',')];

    results.forEach((result: any) => {
        const searchTerm = result.searchTerm;
        const location = result.location;

        const rowData = [
            `"${searchTerm}"`,
            `"${location.city}"`,
            `"${location.state || ''}"`,
            `"${location.country || ''}"`,
            `"${result.name?.replace(/"/g, '""') || ''}"`,
            `"${result.phone_number || ''}"`,
            `"${result.full_address?.replace(/"/g, '""') || ''}"`,
            `"${result.website || ''}"`,
            result.rating || '',
            result.review_count || '',
            `"${result.price_level || ''}"`,
            `"${result.types?.join('; ') || ''}"`,
            result.latitude || '',
            result.longitude || '',
            `"${result.place_link || ''}"`,
        ];
        csvRows.push(rowData.join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'business_leads.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
