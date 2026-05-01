import React, { useState, useRef } from 'react';

interface SearchBoxProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export const SearchBox: React.FC<SearchBoxProps> = ({ onSearch, placeholder = 'Search products...', debounceMs = 300 }) => {
  const [query, setQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (debounceMs > 0) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        onSearch(value);
      }, debounceMs);
    } else {
      onSearch(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    setIsSubmitting(true);
    setError(null);
    try {
      onSearch(trimmed);
    } catch (err) {
      setError('Search failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setError(null);
  };

  return (
    <form onSubmit={handleSubmit} className="search-box">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label="Search products"
        className="flex-1 px-3 py-2 rounded-md border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange"
        disabled={isSubmitting}
      />
      <button
        type="submit"
        disabled={isSubmitting || !query.trim()}
        className="ml-2 px-3 py-2 bg-brand-orange text-white rounded-md font-medium hover:bg-brand-orange/90 focus:outline-none"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full border-2 border-brand-orange border-t-transparent animate-spin" />
          </span>
        ) : (
          'Search'
        )}
      </button>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      {query.length > 0 && (
        <button
          type="button"
          onClick={clearSearch}
          className="ml-2 px-2 py-1 rounded-md text-slate-500 hover:text-slate-700 focus:outline-none"
          aria-label="Clear search"
        >
          <span className="w-4 h-4" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </span>
        </button>
      )}
    </form>
  );
};

export default SearchBox;