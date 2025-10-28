'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { getSearchSuggestions } from '../lib/search';
import OptimizedImage from './OptimizedImage';
import { getStrapiURL } from '../lib/api';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setIsLoading(true);
        try {
          const results = await getSearchSuggestions(query);
          setSuggestions(results);
          setIsOpen(true);
          setSelectedIndex(-1);
        } catch (error) {
          console.error('Search error:', error);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
        setIsOpen(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          const suggestion = suggestions[selectedIndex];
          window.location.href = `/posts/${suggestion.slug}`;
        } else if (query.trim()) {
          // Submit search (could navigate to search results page)
          window.location.href = `/search?q=${encodeURIComponent(query)}`;
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(query)}`;
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md">
      {/* Search Form with accessible label */}
      <form
        onSubmit={handleSubmit}
        className="relative"
        role="search"
        aria-label="Article search"
      >
        <div className="flex flex-col">
          {/* Accessible label - hidden but screen reader visible */}
          <label htmlFor="search-input" className="sr-only">
            Search articles
          </label>

          <div className="relative" aria-expanded={isOpen}>
            <input
              ref={inputRef}
              id="search-input"
              type="text"
              placeholder="Search articles..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => query.trim().length >= 2 && setIsOpen(true)}
              aria-label="Search articles"
              aria-describedby="search-help"
              aria-autocomplete="list"
              aria-controls={isOpen ? 'search-suggestions' : undefined}
              aria-busy={isLoading}
              className="w-full px-4 py-2 bg-gray-800 text-white placeholder-gray-400 rounded-lg border border-gray-700 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
              autoComplete="off"
            />
            {/* Search Icon - Decorative, hidden from screen readers */}
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {/* Loading Indicator */}
            {isLoading && (
              <div
                className="absolute right-12 top-1/2 -translate-y-1/2"
                aria-hidden="true"
              >
                <div className="animate-spin h-4 w-4 border-2 border-cyan-500 border-t-transparent rounded-full" />
              </div>
            )}
          </div>

          {/* Help text for search */}
          <p id="search-help" className="sr-only">
            Type at least 2 characters to search. Use arrow keys to navigate
            suggestions, Enter to select.
          </p>
        </div>
      </form>

      {/* Dropdown Suggestions - Accessible Listbox */}
      {isOpen && suggestions.length > 0 && (
        <div
          id="search-suggestions"
          className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
          role="listbox"
          aria-label="Search suggestions"
          aria-live="polite"
          aria-atomic="false"
        >
          {suggestions.map((suggestion, index) => (
            <Link
              key={suggestion.id}
              href={`/posts/${suggestion.slug}`}
              className={`block w-full text-left px-4 py-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 hover:bg-gray-800 transition-colors ${
                index === selectedIndex ? 'bg-gray-800' : ''
              } ${index !== suggestions.length - 1 ? 'border-b border-gray-800' : ''}`}
              role="option"
              aria-selected={index === selectedIndex}
              aria-label={`${suggestion.title}`}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <div className="flex items-center gap-3">
                <svg
                  className="w-4 h-4 text-gray-400 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {suggestion.title}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* No Results - Accessible message */}
      {isOpen &&
        query.trim().length >= 2 &&
        suggestions.length === 0 &&
        !isLoading && (
          <div
            className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-50 px-4 py-3"
            role="status"
            aria-live="polite"
          >
            <p className="text-sm text-gray-400 text-center">
              No articles found matching &quot;{query}&quot;
            </p>
          </div>
        )}

      {/* Screen reader only styles */}
      <style jsx>{`
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }
      `}</style>
    </div>
  );
}
