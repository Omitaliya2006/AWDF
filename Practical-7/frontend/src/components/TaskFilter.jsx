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
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search user tasks..."
          value={filters.search}
          onChange={(e) => onChangeFilter('search', e.target.value)}
          className="search-input"
        />
        {filters.search && (
          <button className="clear-search-btn" onClick={() => onChangeFilter('search', '')}>
            &times;
          </button>
        )}
      </div>

      <div className="filter-controls">
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

        <div className="select-wrapper">
          <span className="filter-label">Sort:</span>
          <select
            value={filters.sort}
            onChange={(e) => onChangeFilter('sort', e.target.value)}
            className="filter-select"
          >
            <option value="newest">🕒 Newest</option>
            <option value="oldest">⏳ Oldest</option>
            <option value="priority">⚡ Priority</option>
            <option value="alpha">🔤 Title</option>
          </select>
        </div>

        {isFiltered && (
          <button className="reset-filters-btn" onClick={onResetFilters}>
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
