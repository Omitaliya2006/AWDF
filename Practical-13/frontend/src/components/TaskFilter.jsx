import React from 'react';
import './TaskFilter.css';

const TaskFilter = ({ filters, onFilterChange }) => {
  return (
    <div className="task-filter-bar">
      <div className="search-box">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search task title or AI-generated description..."
          value={filters.search}
          onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
        />
        {filters.search && (
          <button
            className="clear-search"
            onClick={() => onFilterChange({ ...filters, search: '' })}
          >
            ✕
          </button>
        )}
      </div>

      <div className="filter-selects">
        <select
          value={filters.status}
          onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In-Progress</option>
          <option value="completed">Completed</option>
        </select>

        <select
          value={filters.priority}
          onChange={(e) => onFilterChange({ ...filters, priority: e.target.value })}
        >
          <option value="all">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <button
          className={`ai-filter-toggle ${filters.aiOnly ? 'active' : ''}`}
          onClick={() => onFilterChange({ ...filters, aiOnly: !filters.aiOnly })}
          title="Filter to only show tasks created with AI suggestions"
        >
          ✨ AI Only
        </button>
      </div>
    </div>
  );
};

export default TaskFilter;
