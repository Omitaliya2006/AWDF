import React, { useState, useEffect, useMemo } from 'react';
import './App.css';
import { api } from './services/api';
import Navbar from './components/Navbar';
import ContainerTopologyHUD from './components/ContainerTopologyHUD';
import TaskFilter from './components/TaskFilter';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import VivaGuideModal from './components/VivaGuideModal';
import Toast from './components/Toast';
import Footer from './components/Footer';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [containerInfo, setContainerInfo] = useState(null);
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

  // Fetch Container Telemetry
  const fetchContainerInfo = async () => {
    try {
      const res = await api.getContainerInfo();
      if (res.ok && res.raw) {
        setContainerInfo(res.raw);
      }
    } catch {
      // background fetch error ignored
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
        notify(res.error || 'Failed to fetch tasks from container backend', 'error');
      }
    } finally {
      setIsLoading(false);
      await fetchContainerInfo();
    }
  };

  useEffect(() => {
    loadTasks();
    const interval = setInterval(fetchContainerInfo, 5000);
    return () => clearInterval(interval);
  }, []);

  // Handlers
  const handleCreateTask = async (taskData) => {
    setIsLoading(true);
    try {
      const res = await api.createTask(taskData);
      if (res.ok) {
        setIsFormOpen(false);
        notify('🐳 Task created and persisted in MongoDB named volume (awdf-mongo-data)!', 'success');
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
        notify('Task updated successfully in container database.', 'success');
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
        notify(`Task completion toggled in MongoDB volume.`, 'info');
        await loadTasks();
      }
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  const handleDeleteTask = async (id, title) => {
    if (!window.confirm(`Delete task "${title}" from MongoDB volume?`)) return;
    setIsLoading(true);
    try {
      const res = await api.deleteTask(id);
      if (res.ok) {
        notify('Task removed from persistent container storage.', 'warning');
        await loadTasks();
      } else {
        notify(res.error || 'Failed to delete task', 'error');
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
        onOpenViva={() => setIsVivaOpen(true)}
        containerInfo={containerInfo}
      />

      <main className="main-content">
        <div className="container">
          {/* Header Intro Banner */}
          <div className="architecture-banner">
            <div className="arch-text">
              <h2>🐳 Full-Stack Containerization (Docker & Docker Compose)</h2>
              <p>
                Multi-container orchestration linking React (5173), Express (5000), and MongoDB (27017) over a dedicated bridge network with persistent named volume storage.
              </p>
            </div>
            <div className="arch-flow">
              <span className="flow-pill client">React (:5173)</span>
              <span className="flow-arrow">➔ [bridge]</span>
              <span className="flow-pill api">Express (:5000)</span>
              <span className="flow-arrow">➔ [DNS]</span>
              <span className="flow-pill db">MongoDB (:27017)</span>
            </div>
          </div>

          {/* Container Topology HUD */}
          <ContainerTopologyHUD
            containerInfo={containerInfo}
            taskCount={tasks.length}
            onRefreshInfo={fetchContainerInfo}
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
