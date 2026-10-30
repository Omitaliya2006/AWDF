import React from 'react';
import './TaskFilter.css';

export default function TaskFilter({
  searchQuery,
  onSearchChange,
  selectedPriority,
  onPriorityChange,
  statusFilter,
  onStatusChange,
  onRefreshTasks,
  onOpenCreateModal,
  isLoading
}) {
  return (
    <div className="task-filter-bar">
      <div className="filter-search-group">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Filter tasks by title, description, or assigned user..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
        {searchQuery && (
          <button className="clear-search" onClick={() => onSearchChange('')}>
            ✕
          </button>
        )}
      </div>

      <div className="filter-dropdowns">
        <select
          value={selectedPriority}
          onChange={(e) => onPriorityChange(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Priorities</option>
          <option value="high">High Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="low">Low Priority</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active Only</option>
          <option value="completed">Completed Only</option>
        </select>

        <button
          className="btn-refresh"
          onClick={onRefreshTasks}
          disabled={isLoading}
          title="Refresh task list from MongoDB"
        >
          🔄 {isLoading ? 'Refreshing...' : 'Refresh'}
        </button>

        <button
          className="btn-create"
          onClick={onOpenCreateModal}
          title="Create a new task and trigger async event emission"
        >
          ➕ Dispatch Task
        </button>
      </div>
    </div>
  );
}
