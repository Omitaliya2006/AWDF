import React from 'react';
import './UserProfile.css';

/**
 * UserProfile Component (Lab Step 4 & Supplementary Problem)
 * Renders GitHub User Profile summary data fetched via REST API.
 *
 * @param {Object} props
 * @param {Object} props.user - GitHub user profile object
 * @param {number} props.repoCount - Number of repos currently fetched/displayed
 */
function UserProfile({ user, repoCount }) {
  if (!user) return null;

  const joinDate = user.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      })
    : null;

  return (
    <div className="user-profile-card glass-card">
      <div className="user-profile-header">
        <div className="user-avatar-wrapper">
          <img
            src={user.avatar_url || 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png'}
            alt={`${user.login}'s avatar`}
            className="user-avatar-img"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png';
            }}
          />
          <span className="user-online-badge" title="Profile Active" />
        </div>

        <div className="user-identity">
          <div className="user-name-row">
            <h2 className="user-fullname">{user.name || user.login}</h2>
            <span className="user-academic-badge">Academic Lab Profile</span>
          </div>
          <p className="user-handle">
            <a
              href={user.html_url}
              target="_blank"
              rel="noreferrer"
              className="user-handle-link"
              title="Open GitHub Profile"
            >
              @{user.login} ↗
            </a>
          </p>

          <p className="user-bio">
            {user.bio || 'Information Technology Student at CSPIT, CHARUSAT. Developing modern web frameworks and full-stack solutions.'}
          </p>
        </div>
      </div>

      <div className="user-stats-grid">
        <div className="user-stat-card">
          <span className="stat-label">Public Repos</span>
          <span className="stat-value">{user.public_repos ?? repoCount ?? 0}</span>
        </div>

        <div className="user-stat-card">
          <span className="stat-label">Followers</span>
          <span className="stat-value">{user.followers ?? 0}</span>
        </div>

        <div className="user-stat-card">
          <span className="stat-label">Following</span>
          <span className="stat-value">{user.following ?? 0}</span>
        </div>

        {joinDate && (
          <div className="user-stat-card">
            <span className="stat-label">Joined</span>
            <span className="stat-value">{joinDate}</span>
          </div>
        )}
      </div>

      <div className="user-profile-footer">
        <div className="user-meta-items">
          {user.location && (
            <span className="user-meta-item">
              <span className="meta-icon">📍</span>
              {user.location}
            </span>
          )}
          {user.company && (
            <span className="user-meta-item">
              <span className="meta-icon">🏢</span>
              {user.company}
            </span>
          )}
          <span className="user-meta-item">
            <span className="meta-icon">🎓</span>
            CSPIT • CHARUSAT
          </span>
        </div>

        <a
          href={user.html_url}
          target="_blank"
          rel="noreferrer"
          className="btn btn-primary user-github-btn"
        >
          <span>View on GitHub</span>
          <span>↗</span>
        </a>
      </div>
    </div>
  );
}

export default UserProfile;
