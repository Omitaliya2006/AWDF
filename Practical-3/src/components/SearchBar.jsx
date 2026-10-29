import React, { useState } from 'react';
import './SearchBar.css';

/**
 * SearchBar Component (Lab Supplementary Problem & Rubrics)
 * Provides dynamic GitHub username query input, preset suggestions,
 * and error state simulation for testing resilience.
 *
 * @param {Object} props
 * @param {string} props.currentUsername - Currently active username being displayed
 * @param {Function} props.onSearch - Callback to trigger fetch for a new username
 * @param {boolean} props.isLoading - Whether an API request is currently in progress
 * @param {Function} props.onSimulateError - Callback to simulate an API failure state
 */
function SearchBar({ currentUsername, onSearch, isLoading, onSimulateError }) {
  const [inputValue, setInputValue] = useState(currentUsername);

  const presets = [
    { label: 'Omitaliya2006 (Student)', username: 'Omitaliya2006' },
    { label: 'facebook', username: 'facebook' },
    { label: 'vitejs', username: 'vitejs' },
    { label: 'microsoft', username: 'microsoft' },
    { label: 'google', username: 'google' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (trimmed) {
      onSearch(trimmed);
    }
  };

  const handlePresetClick = (username) => {
    setInputValue(username);
    onSearch(username);
  };

  return (
    <div className="search-bar-wrapper glass-card">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-group">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Enter GitHub username (e.g. Omitaliya2006)..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
            aria-label="GitHub username"
          />
          {inputValue && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => setInputValue('')}
              title="Clear input"
            >
              ✕
            </button>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary search-submit-btn"
          disabled={isLoading || !inputValue.trim()}
        >
          {isLoading ? (
            <>
              <span className="button-spinner" />
              <span>Fetching...</span>
            </>
          ) : (
            <>
              <span>Fetch API Data</span>
              <span>⚡</span>
            </>
          )}
        </button>

        {/* Error Simulation Button for Lab Evaluation */}
        <button
          type="button"
          onClick={onSimulateError}
          className="btn btn-secondary simulate-error-btn"
          title="Simulate 404 API Error to test ErrorMessage component and retry logic"
        >
          <span>⚠️ Simulate Error</span>
        </button>
      </form>

      {/* Preset Chips */}
      <div className="presets-row">
        <span className="presets-label">Quick Profiles:</span>
        <div className="preset-chips">
          {presets.map((preset) => (
            <button
              key={preset.username}
              type="button"
              onClick={() => handlePresetClick(preset.username)}
              className={`preset-chip ${currentUsername.toLowerCase() === preset.username.toLowerCase() ? 'active' : ''}`}
              disabled={isLoading}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
