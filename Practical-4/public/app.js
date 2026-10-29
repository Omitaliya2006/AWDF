/**
 * Client Dashboard JavaScript for Practical 4
 * Provides interactive CRUD triggers, response inspection, and log monitoring.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
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

  // Theme Management
  const currentTheme = localStorage.getItem('awdf-p4-theme') || 'dark';
  document.body.setAttribute('data-theme', currentTheme);
  themeToggleBtn.textContent = currentTheme === 'dark' ? '☀️' : '🌙';

  themeToggleBtn.addEventListener('click', () => {
    const nextTheme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', nextTheme);
    localStorage.setItem('awdf-p4-theme', nextTheme);
    themeToggleBtn.textContent = nextTheme === 'dark' ? '☀️' : '🌙';
  });

  // Helper to execute API calls and update Response Inspector
  async function executeRequest(method, url, body = null, headers = {}) {
    const startTime = performance.now();
    lastRequestMethod.textContent = method;
    lastRequestMethod.className = `method-tag method-${method.toLowerCase()}`;
    lastRequestUrl.textContent = url;

    const requestOptions = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    if (body) {
      requestOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    try {
      const res = await fetch(url, requestOptions);
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);

      responseDuration.textContent = `${duration}ms`;
      statusCodeBadge.textContent = `${res.status} ${res.statusText || ''}`;
      statusCodeBadge.className = `status-badge status-${res.status}`;

      const data = await res.json().catch(() => ({ raw: 'Non-JSON response' }));
      responseJson.textContent = JSON.stringify(data, null, 2);

      // Refresh logs & task list
      fetchLogs();
      return { status: res.status, data };
    } catch (err) {
      const endTime = performance.now();
      responseDuration.textContent = `${Math.round(endTime - startTime)}ms`;
      statusCodeBadge.textContent = 'Network Error';
      statusCodeBadge.className = 'status-badge status-500';
      responseJson.textContent = JSON.stringify({ error: err.message }, null, 2);
      return { status: 0, error: err.message };
    }
  }

  // Load All Tasks (GET /tasks)
  async function loadTasks() {
    const result = await executeRequest('GET', '/tasks');
    if (result.data && Array.isArray(result.data.data)) {
      renderTasks(result.data.data);
    }
  }

  // Render Tasks in Left Column
  function renderTasks(tasks) {
    taskCountBadge.textContent = `${tasks.length} task${tasks.length === 1 ? '' : 's'}`;

    if (tasks.length === 0) {
      tasksContainer.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
          No tasks found. Use the form above to create one via <code>POST /tasks</code>.
        </div>
      `;
      return;
    }

    tasksContainer.innerHTML = tasks
      .map(
        (task) => `
        <div class="task-item-card" data-id="${task.id}">
          <div class="task-top">
            <h4 class="task-title">${escapeHtml(task.title)}</h4>
            <span class="task-id-badge">ID: #${task.id}</span>
          </div>

          ${task.description ? `<p class="task-desc">${escapeHtml(task.description)}</p>` : ''}

          <div class="task-meta">
            <div class="task-badges">
              <span class="badge badge-${task.status}">${task.status}</span>
              <span class="badge badge-priority-${task.priority}">${task.priority}</span>
            </div>

            <div class="task-actions">
              <button class="task-action-btn btn-toggle-status" data-id="${task.id}" data-current="${task.status}" title="Cycle status">
                ${task.status === 'completed' ? '↺ Reopen' : '✓ Done'}
              </button>
              <button class="task-action-btn btn-del" data-id="${task.id}" title="Delete task">
                🗑 Delete
              </button>
            </div>
          </div>
        </div>
      `
      )
      .join('');

    // Attach Event Listeners to Card Action Buttons
    document.querySelectorAll('.btn-toggle-status').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        const id = e.currentTarget.dataset.id;
        const current = e.currentTarget.dataset.current;
        const nextStatus = current === 'completed' ? 'in-progress' : 'completed';
        await executeRequest('PUT', `/tasks/${id}`, { status: nextStatus });
        loadTasks();
      });
    });

    document.querySelectorAll('.btn-del').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        const id = e.currentTarget.dataset.id;
        if (confirm(`Are you sure you want to delete Task #${id}?`)) {
          await executeRequest('DELETE', `/tasks/${id}`);
          loadTasks();
        }
      });
    });
  }

  // Handle Form Submission (POST /tasks)
  createTaskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDesc').value;
    const status = document.getElementById('taskStatus').value;
    const priority = document.getElementById('taskPriority').value;

    const result = await executeRequest('POST', '/tasks', { title, description, status, priority });
    if (result.status === 201) {
      createTaskForm.reset();
      loadTasks();
    }
  });

  // Live Server Logs Fetcher (GET /api/logs)
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
  document.getElementById('btnFetchOne').addEventListener('click', () => executeRequest('GET', '/tasks/1'));
  document.getElementById('btnFetchNotFound').addEventListener('click', () => executeRequest('GET', '/tasks/999'));
  document.getElementById('btnSimulateError').addEventListener('click', () => executeRequest('GET', '/simulate-error'));
  document.getElementById('btnTestInvalidRoute').addEventListener('click', () => executeRequest('GET', '/undefined-route'));
  document.getElementById('btnTestInvalidId').addEventListener('click', () => executeRequest('GET', '/tasks/abc'));
  document.getElementById('btnRefreshTasks').addEventListener('click', () => loadTasks());
  document.getElementById('btnClearLogs').addEventListener('click', () => {
    logsContainer.innerHTML = '<div style="color: var(--text-muted); padding: 0.5rem;">Logs cleared in view.</div>';
  });

  function escapeHtml(text) {
    if (!text) return '';
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // Initial Load
  loadTasks();
  fetchLogs();
  setInterval(fetchLogs, 5000);
});
