import React, { useState } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onLocationRequest: () => void;
  loading?: boolean;
  className?: string;
}

export function SearchBar({ onSearch, onLocationRequest, loading = false, className = '' }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <div className={`bg-gray-800 rounded-xl p-4 shadow-xl ${className}`}>
      <form onSubmit={handleSubmit} className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a city..."
            className="w-full bg-gray-700 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-600 transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg px-6 py-3 font-medium transition-colors flex items-center space-x-2"
        >
          {loading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Search size={20} />
          )}
          <span>Search</span>
        </button>

        <button
          type="button"
          onClick={onLocationRequest}
          disabled={loading}
          className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-600 text-white rounded-lg px-4 py-3 transition-colors flex items-center space-x-2"
          title="Use current location"
        >
          <MapPin size={20} />
        </button>
      </form>
    </div>
  );
}