import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Navbar from './components/Navbar';
import StatsDashboard from './components/StatsDashboard';
import TaskFilter from './components/TaskFilter';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import FullStackMonitor from './components/FullStackMonitor';
import VivaGuideModal from './components/VivaGuideModal';
import Toast from './components/Toast';
import api from './services/api';
import './App.css';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [backendStatus, setBackendStatus] = useState(null);

  // Modals & Sheets
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isMonitorOpen, setIsMonitorOpen] = useState(false);
  const [isVivaOpen, setIsVivaOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [isSeeding, setIsSeeding] = useState(false);

  // Filters & Sorting
  const [filters, setFilters] = useState({
    search: '',
    status: 'all', // 'all' | 'pending' | 'completed'
    priority: 'all', // 'all' | 'high' | 'medium' | 'low'
    sort: 'newest' // 'newest' | 'oldest' | 'priority' | 'alpha'
  });

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const closeToast = () => {
    setToast(null);
  };

  // Health check & initial fetch
  const checkHealth = useCallback(async () => {
    try {
      const health = await api.getHealth();
      setBackendStatus(health);
    } catch {
      setBackendStatus({ status: 'disconnected', database: { status: 'disconnected' } });
    }
  }, []);

  const loadTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await api.getTasks();
      setTasks(data);
      await checkHealth();
    } catch (err) {
      console.error('Error loading tasks:', err);
      setError(err.message || 'Failed to connect to backend server.');
      setBackendStatus({ status: 'disconnected', database: { status: 'disconnected' } });
    } finally {
      setIsLoading(false);
    }
  }, [checkHealth]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Create or Update Task handler
  const handleFormSubmit = async (taskData) => {
    if (editingTask) {
      const taskId = editingTask._id || editingTask.id;
      const updated = await api.updateTask(taskId, taskData);
      setTasks((prev) =>
        prev.map((t) => ((t._id || t.id) === taskId ? updated : t))
      );
      showToast(`Task "${updated.title}" updated successfully in MongoDB.`, 'success');
    } else {
      const created = await api.createTask(taskData);
      setTasks((prev) => [created, ...prev]);
      showToast(`Task "${created.title}" created in MongoDB.`, 'success');
    }
  };

  // Toggle Complete checkbox
  const handleToggleComplete = async (taskId, newStatus) => {
    try {
      const updated = await api.updateTask(taskId, { completed: newStatus });
      setTasks((prev) =>
        prev.map((t) => ((t._id || t.id) === taskId ? updated : t))
      );
      showToast(
        newStatus
          ? `Marked "${updated.title}" as completed.`
          : `Marked "${updated.title}" as pending.`,
        'success'
      );
    } catch (err) {
      showToast(err.message || 'Failed to update task status.', 'error');
    }
  };

  // Delete Task handler
  const handleDeleteTask = async (taskId) => {
    try {
      await api.deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => (t._id || t.id) !== taskId));
      showToast('Task deleted successfully from MongoDB.', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to delete task.', 'error');
    }
  };

  // Seed sample tasks handler
  const handleSeedData = async () => {
    try {
      setIsSeeding(true);
      const seeded = await api.seedTasks();
      setTasks(seeded);
      showToast('Sample tasks seeded into MongoDB database!', 'success');
      await checkHealth();
    } catch (err) {
      showToast(err.message || 'Failed to seed sample tasks.', 'error');
    } finally {
      setIsSeeding(false);
    }
  };

  // Filter & Sort management
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

  // Memoized filtered & sorted task list
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Search query filter
    if (filters.search.trim()) {
      const query = filters.search.toLowerCase();
      result = result.filter(
        (t) =>
          (t.title && t.title.toLowerCase().includes(query)) ||
          (t.description && t.description.toLowerCase().includes(query))
      );
    }

    // Status filter
    if (filters.status === 'completed') {
      result = result.filter((t) => t.completed);
    } else if (filters.status === 'pending') {
      result = result.filter((t) => !t.completed);
    }

    // Priority filter
    if (filters.priority !== 'all') {
      result = result.filter((t) => t.priority === filters.priority);
    }

    // Sorting
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
      {/* Top Navigation */}
      <Navbar
        backendStatus={backendStatus}
        onOpenCreateModal={() => {
          setEditingTask(null);
          setIsFormOpen(true);
        }}
        onOpenVivaModal={() => setIsVivaOpen(true)}
        onOpenMonitorModal={() => setIsMonitorOpen(true)}
        onSeedData={handleSeedData}
        isSeeding={isSeeding}
      />

      {/* Main App Content */}
      <main className="app-main">
        <div className="container">
          {/* Hero Header */}
          <section className="hero-section">
            <div className="hero-content">
              <span className="hero-subtitle">FULL-STACK INTEGRATION (MERN)</span>
              <h1 className="hero-title">
                Task Management System
              </h1>
              <p className="hero-description">
                Interactive React 19 UI consuming Node.js Express REST API endpoints with persistent MongoDB storage via Mongoose ODM.
              </p>
            </div>
            <div className="hero-badge-group">
              <div className="stack-badge">
                <span className="badge-dot react-dot"></span> React 19 + Vite
              </div>
              <div className="stack-badge">
                <span className="badge-dot node-dot"></span> Express 4.21
              </div>
              <div className="stack-badge">
                <span className="badge-dot mongo-dot"></span> MongoDB + Mongoose
              </div>
            </div>
          </section>

          {/* Metric Dashboard */}
          <StatsDashboard
            tasks={tasks}
            activeFilter={filters}
            onSelectFilter={handleFilterChange}
          />

          {/* Task Filtering Controls */}
          <TaskFilter
            filters={filters}
            onChangeFilter={handleFilterChange}
            onResetFilters={handleResetFilters}
          />

          {/* Task Collection View */}
          <TaskList
            tasks={filteredTasks}
            isLoading={isLoading}
            error={error}
            onRetry={loadTasks}
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

      {/* Footer */}
      <footer className="app-footer">
        <div className="container footer-content">
          <p>
            <strong>AWDF Practical 6</strong> • Full Stack Integration React + Node + MongoDB
          </p>
          <p className="footer-credits">
            Developed by <strong>Om Italiya (24IT029)</strong> • CSPIT CHARUSAT
          </p>
        </div>
      </footer>

      {/* Modals & Dialogs */}
      <TaskForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleFormSubmit}
        editingTask={editingTask}
      />

      <FullStackMonitor
        isOpen={isMonitorOpen}
        onClose={() => setIsMonitorOpen(false)}
        backendStatus={backendStatus}
      />

      <VivaGuideModal
        isOpen={isVivaOpen}
        onClose={() => setIsVivaOpen(false)}
      />

      <Toast
        toast={toast}
        onClose={closeToast}
      />
    </div>
  );
}

