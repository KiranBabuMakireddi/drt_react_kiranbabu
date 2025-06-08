import { useState, type KeyboardEvent } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [input, setInput] = useState('');

  const handleSearch = () => {
    const trimmed = input.trim();
    if (trimmed) onSearch(trimmed);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleClear = () => {
    setInput('');
    onSearch(''); // Trigger reset on clear
  };

  return (
    <div className="mb-4">
      <label htmlFor="search" className="block text-sm font-medium text-white mb-1">
        Search by Name or NORAD ID
      </label>

      <div className="flex gap-2">
        <input
          id="search"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. SL-8 or 3048"
          className="flex-1 px-4 py-2 rounded-md text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Search satellites by name or NORAD ID"
        />

        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
          aria-label="Search"
        >
          Search
        </button>

        {input && (
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300"
            aria-label="Clear search input"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
