import { useState, useMemo, memo } from 'react';
import {
  FaSatellite,
  FaRocket,
  FaQuestion,
  FaRegCircle,
  FaFilter,
  FaTimesCircle,
} from 'react-icons/fa';
import type { Satellite } from '../types/satellite';

const objectTypesList = [
  { label: 'PAYLOAD', icon: <FaRegCircle /> },
  { label: 'ROCKET BODY', icon: <FaRocket /> },
  { label: 'DEBRIS', icon: <FaSatellite /> },
  { label: 'UNKNOWN', icon: <FaQuestion /> },
];

const orbitCodesList = [
  'LEO', 'LEO1', 'LEO2', 'LEO3', 'LEO4',
  'MEO', 'GEO', 'HEO', 'IGO', 'EGO',
  'NSO', 'GTO', 'GHO', 'HAO',
  'MGO', 'LMO', 'UFO', 'ESO', 'UNKNOWN',
];

interface FiltersProps {
  filters: {
    objectTypes: string[];
    orbitCodes: string[];
  };
  setFilters: (filters: { objectTypes: string[]; orbitCodes: string[] }) => void;
  data: Satellite[];
}

const Filters = ({ filters, setFilters, data }: FiltersProps) => {
  const [selectedTypes, setSelectedTypes] = useState(filters.objectTypes);
  const [selectedOrbits, setSelectedOrbits] = useState(filters.orbitCodes);

  const toggle = (list: string[], value: string): string[] =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

  const applyFilters = () => {
    setFilters({ objectTypes: selectedTypes, orbitCodes: selectedOrbits });
  };

  const clearFilters = () => {
    setSelectedTypes([]);
    setSelectedOrbits([]);
    setFilters({ objectTypes: [], orbitCodes: [] });
  };

  const normalizeOrbitCodes = (orbitCode: string): string[] => {
    if (!orbitCode || orbitCode === 'UNKNOWN') return ['UNKNOWN'];
    return orbitCode
      .replace(/[{}]/g, '')
      .split(',')
      .map((code) => code.trim())
      .filter(Boolean);
  };

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const itemType = item.objectType || 'UNKNOWN';
      const orbitList = normalizeOrbitCodes(item.orbitCode || 'UNKNOWN');
      const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(itemType);
      const orbitMatch = selectedOrbits.length === 0 || orbitList.some((code) => selectedOrbits.includes(code));
      return typeMatch && orbitMatch;
    });
  }, [data, selectedTypes, selectedOrbits]);

  const typeCounts = useMemo(() => {
    return data.reduce((acc, item) => {
      const key = item.objectType || 'UNKNOWN';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [data]);

  const orbitCounts = useMemo(() => {
    return data.reduce((acc, item) => {
      const orbits = normalizeOrbitCodes(item.orbitCode || 'UNKNOWN');
      orbits.forEach((code) => {
        acc[code] = (acc[code] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);
  }, [data]);

  // 🧼 Loading skeleton
  if (data.length === 0) {
    return (
      <div className="mb-6 space-y-4 animate-pulse">
        {/* Filtered Objects Summary */}
        <div className="flex flex-wrap gap-2 items-center">
          <div className="h-8 w-48 bg-gray-200 rounded-full" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-8 w-44 bg-gray-200 rounded-full" />
          ))}
        </div>

        {/* Orbit Code Section */}
        <div className="flex flex-wrap gap-2 items-center">
          <div className="h-6 w-28 bg-gray-200 rounded-md" />
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-8 w-32 bg-gray-200 rounded-full" />
          ))}

          {/* Right-aligned Buttons */}
          <div className="ml-auto flex gap-2 mt-2">
            <div className="h-8 w-20 bg-gray-300 rounded-full" />
            <div className="h-8 w-20 bg-gray-300 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 space-y-4">
      {/* Filtered object count and object type filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm bg-neutral-200 px-3 py-1 rounded-full text-neutral-800">
          Filtered Objects <span className="ml-1 text-neutral-600">({filteredData.length})</span>
        </span>

        {objectTypesList.map(({ label, icon }) => (
          <label
            key={label}
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm cursor-pointer border transition-all
              ${selectedTypes.includes(label)
                ? 'bg-blue-100 text-blue-900 border-blue-300'
                : 'bg-white text-neutral-800 border-neutral-300'}`}
          >
            <input
              type="checkbox"
              checked={selectedTypes.includes(label)}
              onChange={() => setSelectedTypes(toggle(selectedTypes, label))}
              className="sr-only"
            />
            {icon}
            <span>{label}</span>
            <span className="text-neutral-500">({typeCounts[label] || 0})</span>
          </label>
        ))}
      </div>

      {/* Orbit codes and buttons */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="text-sm font-semibold text-[#22af95]">Orbit Codes:</div>
        {orbitCodesList.map((code) => (
          <label
            key={code}
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm cursor-pointer border transition-all
              ${selectedOrbits.includes(code)
                ? 'bg-green-100 text-green-900 border-green-300'
                : 'bg-white text-neutral-800 border-neutral-300'}`}
          >
            <input
              type="checkbox"
              checked={selectedOrbits.includes(code)}
              onChange={() => setSelectedOrbits(toggle(selectedOrbits, code))}
              className="sr-only"
            />
            <span>{code}</span>
            <span className="ml-1 text-neutral-500">({orbitCounts[code] || 0})</span>
          </label>
        ))}

        <div className="ml-auto flex gap-2">
          <button
            onClick={applyFilters}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-full text-white flex items-center space-x-2"
            aria-label="Apply filters"
          >
            <FaFilter />
            <span>Apply</span>
          </button>

          <button
            onClick={clearFilters}
            className="px-4 py-1.5 bg-red-600 hover:bg-red-700 rounded-full text-white flex items-center space-x-2"
            aria-label="Clear filters"
          >
            <FaTimesCircle />
            <span>Clear</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(Filters);
