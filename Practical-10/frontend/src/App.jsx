import React, { useState, useEffect, useMemo } from 'react';
import './App.css';
import { api } from './services/api';
import Navbar from './components/Navbar';
import EventMonitorHUD from './components/EventMonitorHUD';
import TaskFilter from './components/TaskFilter';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import VivaGuideModal from './components/VivaGuideModal';
import Toast from './components/Toast';
import Footer from './components/Footer';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [eventLogs, setEventLogs] = useState([]);
  const [eventStats, setEventStats] = useState(null);
  const [currentDelay, setCurrentDelay] = useState(1500);
  const [isLoading, setIsLoading] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isVivaOpen, setIsVivaOpen] = useState(false);

  // Toast
  const [toast, setToast] = useState({ message: '', type: 'info' });

  const notify = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast({ message: '', type: 'info' });
    }, 4500);
  };

  // Fetch telemetry logs and statistics
  const fetchTelemetry = async () => {
    try {
      const [logsRes, statsRes] = await Promise.all([
        api.getEventLogs(),
        api.getEventStats()
      ]);
      if (logsRes.ok && Array.isArray(logsRes.data)) {
        setEventLogs(logsRes.data);
      }
      if (statsRes.ok && statsRes.data) {
        setEventStats(statsRes.data);
        if (statsRes.data.currentDelayMs !== undefined) {
          setCurrentDelay(statsRes.data.currentDelayMs);
        }
      }
    } catch {
      // background poll failure ignored
    }
  };

  // Fetch tasks
  const loadTasks = async () => {
    setIsLoading(true);
    try {
      const res = await api.getTasks();
      if (res.ok) {
        setTasks(Array.isArray(res.data) ? res.data : []);
      } else {
        notify(res.error || 'Failed to fetch tasks', 'error');
      }
    } finally {
      setIsLoading(false);
      await fetchTelemetry();
    }
  };

  useEffect(() => {
    loadTasks();
    // Periodic poll for event log updates
    const interval = setInterval(fetchTelemetry, 2000);
    return () => clearInterval(interval);
  }, []);

  // Handlers
  const handleCreateTask = async (taskData) => {
    setIsLoading(true);
    try {
      const res = await api.createTask(taskData);
      if (res.ok) {
        setIsFormOpen(false);
        notify(
          `⚡ API responded immediately (${res.clientLatencyMs}ms)! Dispatched task-created event to background listener.`,
          taskData.simulateError ? 'warning' : 'success'
        );
        await loadTasks();
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
        notify(`Task updated! Dispatched task-updated event (${res.clientLatencyMs}ms).`, 'success');
        await loadTasks();
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
        notify(`Task toggled! Dispatched task-updated event.`, 'info');
        await loadTasks();
      }
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  const handleDeleteTask = async (id, title) => {
    if (!window.confirm(`Delete task "${title}"? This will emit an asynchronous "task-deleted" event.`)) return;
    setIsLoading(true);
    try {
      const res = await api.deleteTask(id);
      if (res.ok) {
        notify(`Task deleted! Dispatched "task-deleted" audit event to background listener.`, 'warning');
        await loadTasks();
      } else {
        notify(res.error || 'Failed to delete task', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateDelay = async (newDelayMs) => {
    try {
      const res = await api.setDelay(newDelayMs);
      if (res.ok) {
        setCurrentDelay(newDelayMs);
        notify(`Background listener delay set to ${newDelayMs}ms.`, 'info');
        await fetchTelemetry();
      }
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  const handleSimulateError = async () => {
    try {
      const res = await api.simulateError('Simulated background exception in notification worker');
      if (res.ok) {
        notify(`⚠️ Error event emitted! Caught by taskEvents.on('error') listener.`, 'warning');
        await fetchTelemetry();
      }
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  const handleClearLogs = async () => {
    try {
      const res = await api.clearLogs();
      if (res.ok) {
        setEventLogs([]);
        notify('Event logs cleared.', 'info');
        await fetchTelemetry();
      }
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  // Filtered Tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchesSearch =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (t.assignedTo && t.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()));

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
        eventStats={eventStats}
        onOpenViva={() => setIsVivaOpen(true)}
        onSimulateError={handleSimulateError}
        onClearLogs={handleClearLogs}
      />

      <main className="main-content">
        <div className="container">
          {/* Header Intro Banner */}
          <div className="architecture-banner">
            <div className="arch-text">
              <h2>📢 Asynchronous Processing with Event-Driven Architecture</h2>
              <p>
                Decoupling downstream side effects (notifications, audit logging) from the critical API request path using Node.js built-in <code>EventEmitter</code>.
              </p>
            </div>
            <div className="arch-flow">
              <span className="flow-pill">POST /tasks</span>
              <span className="flow-arrow">➔</span>
              <span className="flow-pill resp">HTTP 201 Created (~15ms)</span>
              <span className="flow-arrow">➔ [Non-Blocking]</span>
              <span className="flow-pill listener">Background Listener (~1500ms)</span>
            </div>
          </div>

          {/* Event Monitor HUD */}
          <EventMonitorHUD
            eventLogs={eventLogs}
            eventStats={eventStats}
            currentDelay={currentDelay}
            onUpdateDelay={handleUpdateDelay}
            onClearLogs={handleClearLogs}
            onRefreshLogs={fetchTelemetry}
          />

          {/* Task Management Controls */}
          <TaskFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedPriority={selectedPriority}
            onPriorityChange={setSelectedPriority}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            onRefreshTasks={loadTasks}
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
