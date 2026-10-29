import React from 'react';
import './RepoFilters.css';

/**
 * RepoFilters Component (Supplementary Problem & Rubrics)
 * Provides real-time filtering by search query, programming language,
 * and sorting (Stars, Forks, Recently Updated, Alphabetical).
 *
 * @param {Object} props
 * @param {string} props.searchQuery - Current search filter text
 * @param {Function} props.setSearchQuery - Updater for search text
 * @param {string} props.selectedLanguage - Currently selected language filter
 * @param {Function} props.setSelectedLanguage - Updater for language
 * @param {Array<string>} props.availableLanguages - List of unique languages in repos
 * @param {string} props.sortBy - Current sort metric ('updated' | 'stars' | 'forks' | 'name')
 * @param {Function} props.setSortBy - Updater for sort metric
 * @param {number} props.filteredCount - Count of currently visible repos
 * @param {number} props.totalCount - Total count of repos fetched
 * @param {Function} props.onReset - Reset all filters
 */
function RepoFilters({
  searchQuery,
  setSearchQuery,
  selectedLanguage,
  setSelectedLanguage,
  availableLanguages = [],
  sortBy,
  setSortBy,
  filteredCount,
  totalCount,
  onReset
}) {
  const isFiltered = searchQuery.trim() !== '' || selectedLanguage !== 'all' || sortBy !== 'updated';

  return (
    <div className="repo-filters-container glass-card">
      <div className="filters-primary-row">
        {/* Real-time Repo Text Filter */}
        <div className="filter-search-box">
          <span className="filter-icon">🔎</span>
          <input
            type="text"
            className="filter-input"
            placeholder="Filter repositories by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Filter repositories"
          />
          {searchQuery && (
            <button
              type="button"
              className="filter-clear-icon"
              onClick={() => setSearchQuery('')}
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Language Selector */}
        <div className="filter-select-group">
          <label htmlFor="repo-lang-select" className="filter-label">Language:</label>
          <select
            id="repo-lang-select"
            className="filter-select"
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
          >
            <option value="all">All Languages</option>
            {availableLanguages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Selector */}
        <div className="filter-select-group">
          <label htmlFor="repo-sort-select" className="filter-label">Sort By:</label>
          <select
            id="repo-sort-select"
            className="filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="updated">Recently Updated</option>
            <option value="stars">Most Stars ⭐</option>
            <option value="forks">Most Forks 🍴</option>
            <option value="name">Name (A - Z)</option>
          </select>
        </div>
      </div>

      {/* Results status and reset */}
      <div className="filters-status-row">
        <span className="results-counter">
          Showing <strong className="counter-highlight">{filteredCount}</strong> of {totalCount} repositories
        </span>

        {isFiltered && (
          <button
            type="button"
            className="btn-text-reset"
            onClick={onReset}
          >
            Reset Filters ↺
          </button>
        )}
      </div>
    </div>
  );
}

export default RepoFilters;
