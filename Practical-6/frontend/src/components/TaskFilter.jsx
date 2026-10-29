import React from 'react';
import './TaskFilter.css';

export default function TaskFilter({ filters, onChangeFilter, onResetFilters }) {
  const isFiltered =
    filters.search.trim() !== '' ||
    filters.status !== 'all' ||
    filters.priority !== 'all' ||
    filters.sort !== 'newest';

  return (
    <div className="filter-card">
      <div className="search-box">
        <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          type="text"
          placeholder="Search tasks by title or description..."
          value={filters.search}
          onChange={(e) => onChangeFilter('search', e.target.value)}
          className="search-input"
        />
        {filters.search && (
          <button
            className="clear-search-btn"
            onClick={() => onChangeFilter('search', '')}
            title="Clear search"
          >
            ×
          </button>
        )}
      </div>

      <div className="filter-controls">
        {/* Status Pills */}
        <div className="pill-group">
          <span className="filter-label">Status:</span>
          {['all', 'pending', 'completed'].map((status) => (
            <button
              key={status}
              className={`pill-btn ${filters.status === status ? 'pill-active' : ''}`}
              onClick={() => onChangeFilter('status', status)}
            >
              {status === 'all' ? 'All' : status === 'pending' ? 'Pending' : 'Completed'}
            </button>
          ))}
        </div>

        {/* Priority Filter */}
        <div className="select-wrapper">
          <span className="filter-label">Priority:</span>
          <select
            value={filters.priority}
            onChange={(e) => onChangeFilter('priority', e.target.value)}
            className="filter-select"
          >
            <option value="all">All Priorities</option>
            <option value="high">🔴 High</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">🟢 Low</option>
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="select-wrapper">
          <span className="filter-label">Sort By:</span>
          <select
            value={filters.sort}
            onChange={(e) => onChangeFilter('sort', e.target.value)}
            className="filter-select"
          >
            <option value="newest">🕒 Newest First</option>
            <option value="oldest">⏳ Oldest First</option>
            <option value="priority">⚡ Priority (High → Low)</option>
            <option value="alpha">🔤 Title (A - Z)</option>
          </select>
        </div>

        {/* Reset button */}
        {isFiltered && (
          <button
            className="reset-filters-btn"
            onClick={onResetFilters}
            title="Reset all filters"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}

