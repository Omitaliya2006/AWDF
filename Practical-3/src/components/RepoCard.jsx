import React from 'react';
import './RepoCard.css';

const LANGUAGE_COLORS = {
  JavaScript: '#f7df1e',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Java: '#b07219',
  C: '#555555',
  'C++': '#f34b7d',
  'C#': '#178600',
  PHP: '#4F5D95',
  Ruby: '#701516',
  Go: '#00ADD8',
  Rust: '#dea584',
  Kotlin: '#A97BFF',
  Swift: '#F05138',
  Shell: '#89e051'
};

const getLanguageColor = (lang) => {
  return LANGUAGE_COLORS[lang] || '#6366f1';
};

/**
 * RepoCard Component (Lab Step 4 & Supplementary Problem)
 * Renders individual repository data returned from GitHub REST API.
 *
 * @param {Object} props
 * @param {Object} props.repo - GitHub repository data object
 */
function RepoCard({ repo }) {
  const formattedDate = repo.updated_at
    ? new Date(repo.updated_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : null;

  return (
    <article className="repo-card glass-card">
      <div className="repo-card-header">
        <div className="repo-name-group">
          <span className="repo-icon">📂</span>
          <h3 className="repo-title">
            <a
              href={repo.html_url}
              target="_blank"
              rel="noreferrer"
              className="repo-link"
              title={`View ${repo.name} on GitHub`}
            >
              {repo.name}
            </a>
          </h3>
        </div>
        <span className="repo-visibility">
          {repo.private ? 'Private' : 'Public'}
        </span>
      </div>

      <p className="repo-desc">
        {repo.description || 'No description provided for this repository.'}
      </p>

      <div className="repo-meta-row">
        {/* Language Badge */}
        {repo.language && (
          <span className="repo-lang-badge">
            <span
              className="lang-dot"
              style={{
                backgroundColor: getLanguageColor(repo.language),
                boxShadow: `0 0 6px ${getLanguageColor(repo.language)}`
              }}
            />
            {repo.language}
          </span>
        )}

        {/* Supplementary: Star Count */}
        <span className="repo-stat" title="Stars">
          <span className="stat-icon">⭐</span>
          <span className="stat-count">{repo.stargazers_count ?? 0}</span>
        </span>

        {/* Fork Count */}
        <span className="repo-stat" title="Forks">
          <span className="stat-icon">🍴</span>
          <span className="stat-count">{repo.forks_count ?? 0}</span>
        </span>

        {/* Updated Date */}
        {formattedDate && (
          <span className="repo-date">Updated: {formattedDate}</span>
        )}
      </div>

      <div className="repo-card-footer">
        <a
          href={repo.html_url}
          target="_blank"
          rel="noreferrer"
          className="btn btn-secondary repo-btn"
        >
          <span>View on GitHub</span>
          <span>↗</span>
        </a>
      </div>
    </article>
  );
}

export default RepoCard;
