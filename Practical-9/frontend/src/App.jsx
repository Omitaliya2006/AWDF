import React, { useState, useEffect, useMemo } from 'react';
import './App.css';
import { api } from './services/api';
import Navbar from './components/Navbar';
import CacheMonitorHUD from './components/CacheMonitorHUD';
import TaskFilter from './components/TaskFilter';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import BenchmarkModal from './components/BenchmarkModal';
import VivaGuideModal from './components/VivaGuideModal';
import Toast from './components/Toast';
import Footer from './components/Footer';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [cacheStats, setCacheStats] = useState(null);
  const [latestTelemetry, setLatestTelemetry] = useState(null);
  const [bypassCache, setBypassCache] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isBenchmarkOpen, setIsBenchmarkOpen] = useState(false);
  const [isVivaOpen, setIsVivaOpen] = useState(false);

  // Toast
  const [toast, setToast] = useState({ message: '', type: 'info' });

  const notify = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast({ message: '', type: 'info' });
    }, 4000);
  };

  // Fetch telemetry stats
  const refreshCacheStats = async () => {
    try {
      const res = await api.getCacheStats();
      if (res.ok && res.data) {
        setCacheStats(res.data);
      }
    } catch {
      // ignore
    }
  };

  // Fetch tasks
  const loadTasks = async (bypass = bypassCache) => {
    setIsLoading(true);
    try {
      const res = await api.getTasks(bypass);
      if (res.ok) {
        setTasks(Array.isArray(res.data) ? res.data : []);
        setLatestTelemetry(res.telemetry);
        await refreshCacheStats();
      } else {
        notify(res.error || 'Failed to fetch tasks', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks(bypassCache);
  }, [bypassCache]);

  // Handlers
  const handleToggleBypass = (val) => {
    setBypassCache(val);
    notify(
      val ? 'Cache BYPASS enabled: requests will query MongoDB directly' : 'Cache ENABLED: requests will use node-cache RAM',
      val ? 'warning' : 'success'
    );
  };

  const handleCreateTask = async (taskData) => {
    setIsLoading(true);
    try {
      const res = await api.createTask(taskData);
      if (res.ok) {
        setIsFormOpen(false);
        notify('Task created! In-memory cache invalidated (stale data prevented).', 'success');
        await loadTasks(bypassCache);
      } else {
        notify(res.error || 'Failed to create task', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTask = async (taskData) => {
    if (!editingTask) return;
    setIsLoading(true);
    try {
      const res = await api.updateTask(editingTask._id, taskData);
      if (res.ok) {
        setEditingTask(null);
        setIsFormOpen(false);
        notify(`Task updated! Invalidated 'all_tasks' and 'task_${editingTask._id.slice(-6)}'.`, 'success');
        await loadTasks(bypassCache);
      } else {
        notify(res.error || 'Failed to update task', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      const res = await api.updateTask(task._id, { completed: !task.completed });
      if (res.ok) {
        notify(`Task toggled! Caches invalidated for task_${task._id.slice(-6)}.`, 'info');
        await loadTasks(bypassCache);
      }
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Delete this task? This will invalidate the in-memory cache.')) return;
    setIsLoading(true);
    try {
      const res = await api.deleteTask(id);
      if (res.ok) {
        notify('Task deleted! In-memory cache invalidated.', 'warning');
        await loadTasks(bypassCache);
      } else {
        notify(res.error || 'Failed to delete task', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFlushCache = async () => {
    setIsLoading(true);
    try {
      const res = await api.flushCache();
      if (res.ok) {
        setCacheStats(res.data);
        notify('All keys flushed from node-cache RAM.', 'warning');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Filtered Tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchesSearch =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesPriority =
        selectedPriority === 'all' || t.priority === selectedPriority;

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'completed' && t.completed) ||
        (statusFilter === 'active' && !t.completed);

      return matchesSearch && matchesPriority && matchesStatus;
    });
  }, [tasks, searchQuery, selectedPriority, statusFilter]);

  return (
    <div className="app-layout">
      <Navbar
        bypassCache={bypassCache}
        onToggleBypass={handleToggleBypass}
        onOpenBenchmark={() => setIsBenchmarkOpen(true)}
        onOpenViva={() => setIsVivaOpen(true)}
        cacheStats={cacheStats}
      />

      <main className="main-content">
        <div className="container">
          {/* Header Intro Banner */}
          <div className="architecture-banner">
            <div className="arch-text">
              <h2>⚡ In-Memory Caching & Query Optimization (node-cache)</h2>
              <p>
                Demonstrating sub-millisecond RAM retrieval, cache-aside pattern, and instant write-invalidation across MongoDB and Node.js.
              </p>
            </div>
            <div className="arch-flow">
              <span className="flow-pill">Client</span>
              <span className="flow-arrow">➔</span>
              <span className="flow-pill highlight">node-cache (RAM ~0.8ms)</span>
              <span className="flow-arrow">➔ [MISS]</span>
              <span className="flow-pill db">MongoDB (~15ms)</span>
            </div>
          </div>

          {/* Cache Telemetry HUD */}
          <CacheMonitorHUD
            stats={cacheStats}
            latestTelemetry={latestTelemetry}
            onFlushCache={handleFlushCache}
            onRefreshStats={refreshCacheStats}
            isLoading={isLoading}
          />

          {/* Task Management Controls */}
          <TaskFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedPriority={selectedPriority}
            onPriorityChange={setSelectedPriority}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            onRefreshTasks={() => loadTasks(bypassCache)}
            onOpenCreateModal={() => {
              setEditingTask(null);
              setIsFormOpen(true);
            }}
            isLoading={isLoading}
          />

          {/* Task Cards Grid */}
          <TaskList
            tasks={filteredTasks}
            onToggleComplete={handleToggleComplete}
            onEditTask={(task) => {
              setEditingTask(task);
              setIsFormOpen(true);
            }}
            onDeleteTask={handleDeleteTask}
            onNotify={notify}
            isLoading={isLoading}
          />
        </div>
      </main>

      {/* Modals */}
      <TaskForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTask(null);
        }}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        initialTask={editingTask}
      />

      <BenchmarkModal
        isOpen={isBenchmarkOpen}
        onClose={() => setIsBenchmarkOpen(false)}
      />

      <VivaGuideModal
        isOpen={isVivaOpen}
        onClose={() => setIsVivaOpen(false)}
      />

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'info' })}
      />

      <Footer />
    </div>
  );
}
