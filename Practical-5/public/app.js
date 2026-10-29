/**
 * Practical 5 Client Dashboard (MongoDB & Mongoose)
 * Handles interactive live database CRUD triggers, schema validation error inspection,
 * and live request log streaming.
 */

document.addEventListener('DOMContentLoaded', () => {
  const tasksContainer = document.getElementById('tasksContainer');
  const taskCountBadge = document.getElementById('taskCountBadge');
  const createTaskForm = document.getElementById('createTaskForm');
  const responseJson = document.getElementById('responseJson');
  const statusCodeBadge = document.getElementById('statusCodeBadge');
  const responseDuration = document.getElementById('responseDuration');
  const lastRequestMethod = document.getElementById('lastRequestMethod');
  const lastRequestUrl = document.getElementById('lastRequestUrl');
  const logsContainer = document.getElementById('logsContainer');
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const mongoStatusText = document.getElementById('mongoStatusText');

  // Theme Management
  const currentTheme = localStorage.getItem('awdf-p5-theme') || 'dark';
  document.body.setAttribute('data-theme', currentTheme);
  themeToggleBtn.textContent = currentTheme === 'dark' ? '☀️' : '🌙';

  themeToggleBtn.addEventListener('click', () => {
    const nextTheme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', nextTheme);
    localStorage.setItem('awdf-p5-theme', nextTheme);
    themeToggleBtn.textContent = nextTheme === 'dark' ? '☀️' : '🌙';
  });

  // Check Database connection metadata
  async function checkApiHealth() {
    try {
      const res = await fetch('/api');
      const data = await res.json();
      if (data.database && data.database.status === 'Connected') {
        mongoStatusText.textContent = `MongoDB: Connected (${data.database.name})`;
      }
    } catch {
      mongoStatusText.textContent = 'MongoDB: Reconnecting...';
    }
  }

  // Execute API call & inspect response
  async function executeRequest(method, url, body = null) {
    const startTime = performance.now();
    lastRequestMethod.textContent = method;
    lastRequestMethod.className = `method-tag method-${method.toLowerCase()}`;
    lastRequestUrl.textContent = url;

    const options = {
      method,
      headers: { 'Content-Type': 'application/json' }
    };
    if (body) {
      options.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    try {
      const res = await fetch(url, options);
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);

      responseDuration.textContent = `${duration}ms`;
      statusCodeBadge.textContent = `${res.status} ${res.statusText || ''}`;
      statusCodeBadge.className = `status-badge status-${res.status}`;

      const data = await res.json().catch(() => ({ raw: 'Non-JSON response' }));
      responseJson.textContent = JSON.stringify(data, null, 2);

      fetchLogs();
      return { status: res.status, data };
    } catch (err) {
      const duration = Math.round(performance.now() - startTime);
      responseDuration.textContent = `${duration}ms`;
      statusCodeBadge.textContent = 'Network Error';
      statusCodeBadge.className = 'status-badge status-500';
      responseJson.textContent = JSON.stringify({ error: err.message }, null, 2);
      return { status: 0, error: err.message };
    }
  }

  // Load all tasks from MongoDB
  async function loadTasks() {
    const result = await executeRequest('GET', '/tasks');
    if (result.data && Array.isArray(result.data.data)) {
      renderTasks(result.data.data);
    }
  }

  // Render MongoDB documents as cards
  function renderTasks(tasks) {
    taskCountBadge.textContent = `${tasks.length} document${tasks.length === 1 ? '' : 's'}`;

    if (tasks.length === 0) {
      tasksContainer.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
          No tasks found in MongoDB collection. Create one using the form above.
        </div>
      `;
      return;
    }

    tasksContainer.innerHTML = tasks
      .map((task) => {
        const id = task._id || task.id;
        const formattedDate = new Date(task.createdAt || Date.now()).toLocaleDateString();
        return `
          <div class="task-item-card" data-id="${id}">
            <div class="task-top">
              <h4 class="task-title">${escapeHtml(task.title)}</h4>
              <span class="task-id-badge" title="MongoDB ObjectId">_id: ${id.slice(-6)}</span>
            </div>

            ${task.description ? `<p class="task-desc">${escapeHtml(task.description)}</p>` : ''}

            <div class="task-meta">
              <div class="task-badges">
                <span class="badge ${task.completed ? 'badge-completed' : 'badge-pending'}">
                  ${task.completed ? '✓ Completed' : 'Pending'}
                </span>
                <span class="badge badge-priority-${task.priority}">
                  ${task.priority}
                </span>
                <span style="color: var(--text-muted); font-size: 0.7rem;">${formattedDate}</span>
              </div>

              <div class="task-actions">
                <button class="task-action-btn btn-toggle" data-id="${id}" data-completed="${task.completed}">
                  ${task.completed ? '↺ Reopen' : '✓ Complete'}
                </button>
                <button class="task-action-btn btn-del" data-id="${id}">
                  🗑 Delete
                </button>
              </div>
            </div>
          </div>
        `;
      })
      .join('');

    // Attach listeners
    document.querySelectorAll('.btn-toggle').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        const id = e.currentTarget.dataset.id;
        const isCompleted = e.currentTarget.dataset.completed === 'true';
        await executeRequest('PUT', `/tasks/${id}`, { completed: !isCompleted });
        loadTasks();
      });
    });

    document.querySelectorAll('.btn-del').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        const id = e.currentTarget.dataset.id;
        if (confirm(`Delete MongoDB document with ObjectId ${id}?`)) {
          await executeRequest('DELETE', `/tasks/${id}`);
          loadTasks();
        }
      });
    });
  }

  // Handle form submission (POST /tasks)
  createTaskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDesc').value;
    const priority = document.getElementById('taskPriority').value;
    const completed = document.getElementById('taskCompleted').value === 'true';

    const result = await executeRequest('POST', '/tasks', { title, description, priority, completed });
    if (result.status === 201) {
      createTaskForm.reset();
      loadTasks();
    }
  });

  // Fetch live logs from /api/logs
  async function fetchLogs() {
    try {
      const res = await fetch('/api/logs');
      const data = await res.json();
      if (data && Array.isArray(data.logs)) {
        renderLogs(data.logs.slice(0, 15));
      }
    } catch {
      // ignore
    }
  }

  function renderLogs(logs) {
    if (logs.length === 0) {
      logsContainer.innerHTML = '<div style="color: var(--text-muted); padding: 0.5rem;">No request logs recorded yet.</div>';
      return;
    }

    logsContainer.innerHTML = logs
      .map((log) => {
        const isError = log.statusCode >= 400;
        return `
          <div class="log-entry ${isError ? 'error-log' : ''}">
            <span class="method-tag method-${log.method.toLowerCase()}">${log.method}</span>
            <code>${escapeHtml(log.url)}</code>
            <span class="status-badge status-${log.statusCode}">${log.statusCode}</span>
            <span class="log-dur">${log.duration}</span>
            <span class="log-time">${new Date(log.timestamp).toLocaleTimeString()}</span>
          </div>
        `;
      })
      .join('');
  }

  // Quick Action Buttons
  document.getElementById('btnFetchAll').addEventListener('click', () => loadTasks());

  document.getElementById('btnTestValidationFailure').addEventListener('click', () => {
    // Deliberately omit required 'title' field to trigger Mongoose ValidationError
    executeRequest('POST', '/tasks', { description: 'Missing required title field' });
  });

  document.getElementById('btnTestInvalidEnum').addEventListener('click', () => {
    // Deliberately pass invalid enum value for priority
    executeRequest('POST', '/tasks', { title: 'Test Task', priority: 'extreme-urgent-invalid-enum' });
  });

  document.getElementById('btnTestInvalidId').addEventListener('click', () => {
    executeRequest('GET', '/tasks/invalid-objectid-12345');
  });

  document.getElementById('btnTestNonExistentId').addEventListener('click', () => {
    executeRequest('GET', '/tasks/507f1f77bcf86cd799439011');
  });

  document.getElementById('btnRefreshTasks').addEventListener('click', () => loadTasks());

  document.getElementById('btnClearLogs').addEventListener('click', () => {
    logsContainer.innerHTML = '<div style="color: var(--text-muted); padding: 0.5rem;">Logs cleared in view.</div>';
  });

  function escapeHtml(text) {
    if (!text) return '';
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // Initial Boot
  checkApiHealth();
  loadTasks();
  fetchLogs();
  setInterval(fetchLogs, 5000);
});
