import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import PipelineHUD from './components/PipelineHUD';
import StatsDashboard from './components/StatsDashboard';
import TaskFilter from './components/TaskFilter';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import VivaGuideModal from './components/VivaGuideModal';
import Toast from './components/Toast';
import api, { setUnauthorizedHandler } from './services/api';
import './App.css';

export default function App() {
  const [user, setUser] = useState(() => api.getUser());
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [backendStatus, setBackendStatus] = useState(null);

  // Dialogs
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isPipelineOpen, setIsPipelineOpen] = useState(false);
  const [isVivaOpen, setIsVivaOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [isSeeding, setIsSeeding] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    priority: 'all',
    sort: 'newest'
  });

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type });
  }, []);

  const closeToast = () => setToast(null);

  // 1. Setup 401 Unauthorized interceptor (Supplementary Problem: auto-logout & redirect)
  useEffect(() => {
    setUnauthorizedHandler((msg) => {
      setUser(null);
      setTasks([]);
      showToast(msg, 'error');
      setAuthMode('login');
      setIsAuthModalOpen(true);
    });
  }, [showToast]);

  // 2. Health check
  const checkHealth = useCallback(async () => {
    try {
      const health = await api.getHealth();
      setBackendStatus(health);
    } catch {
      setBackendStatus({ status: 'disconnected', database: { status: 'disconnected' } });
    }
  }, []);

  // 3. Load Tasks for Authenticated User
  const loadTasks = useCallback(async () => {
    if (!api.getToken()) {
      setTasks([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await api.getTasks();
      setTasks(data);
    } catch (err) {
      if (err.status !== 401) {
        setError(err.message || 'Failed to load protected tasks.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkHealth();
    if (user) {
      loadTasks();
    }
  }, [checkHealth, loadTasks, user]);

  // Auth Handlers
  const handleAuthSuccess = (authenticatedUser) => {
    setUser(authenticatedUser);
    showToast(`Welcome, ${authenticatedUser.name}! JWT token issued.`, 'success');
    loadTasks();
  };

  const handleLogout = () => {
    api.logout();
    setUser(null);
    setTasks([]);
    showToast('Signed out successfully. Token cleared.', 'info');
  };

  // CRUD Handlers
  const handleFormSubmit = async (taskData) => {
    if (editingTask) {
      const taskId = editingTask._id || editingTask.id;
      const updated = await api.updateTask(taskId, taskData);
      setTasks((prev) =>
        prev.map((t) => ((t._id || t.id) === taskId ? updated : t))
      );
      showToast(`Task "${updated.title}" updated in MongoDB.`, 'success');
    } else {
      const created = await api.createTask(taskData);
      setTasks((prev) => [created, ...prev]);
      showToast(`Task "${created.title}" created with JWT authorization.`, 'success');
    }
  };

  const handleToggleComplete = async (taskId, newStatus) => {
    try {
      const updated = await api.updateTask(taskId, { completed: newStatus });
      setTasks((prev) =>
        prev.map((t) => ((t._id || t.id) === taskId ? updated : t))
      );
      showToast(newStatus ? 'Task marked completed.' : 'Task marked pending.', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to update task status.', 'error');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await api.deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => (t._id || t.id) !== taskId));
      showToast('Task removed from MongoDB.', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to delete task.', 'error');
    }
  };

  const handleSeedData = async () => {
    try {
      setIsSeeding(true);
      const seeded = await api.seedTasks();
      setTasks(seeded);
      showToast('Account seeded with Practical 7 sample tasks!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to seed sample tasks.', 'error');
    } finally {
      setIsSeeding(false);
    }
  };

  // Filter handlers
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      priority: 'all',
      sort: 'newest'
    });
  };

  // Filtered & Sorted Tasks
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    if (filters.search.trim()) {
      const query = filters.search.toLowerCase();
      result = result.filter(
        (t) =>
          (t.title && t.title.toLowerCase().includes(query)) ||
          (t.description && t.description.toLowerCase().includes(query))
      );
    }

    if (filters.status === 'completed') {
      result = result.filter((t) => t.completed);
    } else if (filters.status === 'pending') {
      result = result.filter((t) => !t.completed);
    }

    if (filters.priority !== 'all') {
      result = result.filter((t) => t.priority === filters.priority);
    }

    result.sort((a, b) => {
      if (filters.sort === 'newest') {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
      if (filters.sort === 'oldest') {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      }
      if (filters.sort === 'alpha') {
        return (a.title || '').localeCompare(b.title || '');
      }
      if (filters.sort === 'priority') {
        const score = { high: 3, medium: 2, low: 1 };
        return (score[b.priority] || 0) - (score[a.priority] || 0);
      }
      return 0;
    });

    return result;
  }, [tasks, filters]);

  return (
    <div className="app-layout">
      <Navbar
        user={user}
        backendStatus={backendStatus}
        onOpenAuthModal={() => {
          setAuthMode('login');
          setIsAuthModalOpen(true);
        }}
        onLogout={handleLogout}
        onOpenCreateModal={() => {
          setEditingTask(null);
          setIsFormOpen(true);
        }}
        onOpenPipelineModal={() => setIsPipelineOpen(true)}
        onOpenVivaModal={() => setIsVivaOpen(true)}
        onSeedData={handleSeedData}
        isSeeding={isSeeding}
      />

      <main className="app-main">
        <div className="container">
          {/* Hero Section */}
          <section className="hero-section">
            <div className="hero-content">
              <span className="hero-subtitle">AUTHENTICATION & MIDDLEWARE PIPELINE</span>
              <h1 className="hero-title">
                JWT Task Security Platform
              </h1>
              <p className="hero-description">
                Express middleware pipeline with bcryptjs salted password hashing, JWT Bearer token generation & verification, and strict input validation rules.
              </p>
            </div>
            <div className="hero-badge-group">
              <div className="stack-badge">
                <span className="badge-dot auth-dot"></span> JWT & bcryptjs
              </div>
              <div className="stack-badge">
                <span className="badge-dot node-dot"></span> Express Pipeline
              </div>
              <div className="stack-badge">
                <span className="badge-dot mongo-dot"></span> MongoDB User Scoping
              </div>
            </div>
          </section>

          {/* Metric Dashboard */}
          <StatsDashboard
            tasks={tasks}
            activeFilter={filters}
            onSelectFilter={handleFilterChange}
          />

          {/* Filter Bar */}
          <TaskFilter
            filters={filters}
            onChangeFilter={handleFilterChange}
            onResetFilters={handleResetFilters}
          />

          {/* Protected Task Collection */}
          <TaskList
            tasks={filteredTasks}
            isLoading={isLoading}
            error={error}
            user={user}
            onRetry={loadTasks}
            onOpenAuthModal={() => {
              setAuthMode('login');
              setIsAuthModalOpen(true);
            }}
            onToggleComplete={handleToggleComplete}
            onEditTask={(task) => {
              setEditingTask(task);
              setIsFormOpen(true);
            }}
            onDeleteTask={handleDeleteTask}
            onOpenCreateModal={() => {
              setEditingTask(null);
              setIsFormOpen(true);
            }}
            onSeedData={handleSeedData}
          />
        </div>
      </main>

      <footer className="app-footer">
        <div className="container footer-content">
          <p>
            <strong>AWDF Practical 7</strong> • Authentication and Middleware Pipeline
          </p>
          <p className="footer-credits">
            Developed by <strong>Om Italiya (24IT029)</strong> • CSPIT CHARUSAT
          </p>
        </div>
      </footer>

      {/* Modals & Dialogs */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        initialMode={authMode}
      />

      <TaskForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleFormSubmit}
        editingTask={editingTask}
      />

      <PipelineHUD
        isOpen={isPipelineOpen}
        onClose={() => setIsPipelineOpen(false)}
        backendStatus={backendStatus}
        user={user}
      />

      <VivaGuideModal
        isOpen={isVivaOpen}
        onClose={() => setIsVivaOpen(false)}
      />

      <Toast toast={toast} onClose={closeToast} />
    </div>
  );
}
