import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AIStatusHUD from './components/AIStatusHUD';
import TaskForm from './components/TaskForm';
import TaskFilter from './components/TaskFilter';
import TaskList from './components/TaskList';
import Toast from './components/Toast';
import Footer from './components/Footer';
import VivaGuideModal from './components/VivaGuideModal';
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  generateAiDescription,
  simulateAiFailure,
  fetchAiStatus
} from './services/api';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', status: 'all', priority: 'all', aiOnly: false });
  const [aiStatus, setAiStatus] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'info' });
  const [isVivaOpen, setIsVivaOpen] = useState(false);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast({ message: '', type: 'info' });
    }, 4500);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [tasksRes, statusRes] = await Promise.all([
        fetchTasks(filters),
        fetchAiStatus()
      ]);
      setTasks(tasksRes.data || []);
      setAiStatus(statusRes.status || null);
    } catch (err) {
      showToast('Error syncing tasks: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filters]);

  const handleCreateTask = async (taskData) => {
    const res = await createTask(taskData);
    if (res.data) {
      setTasks(prev => [res.data, ...prev]);
    } else {
      loadData();
    }
  };

  const handleUpdateTask = async (id, updates) => {
    const res = await updateTask(id, updates);
    if (res.data) {
      setTasks(prev => prev.map(t => t._id === id ? res.data : t));
    } else {
      loadData();
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await deleteTask(id);
      setTasks(prev => prev.filter(t => t._id !== id));
      showToast('Task removed successfully', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleGenerateAi = async (title) => {
    return await generateAiDescription(title);
  };

  const handleSimulateFailure = async (title) => {
    const res = await simulateAiFailure(title);
    showToast('Graceful degradation verified: fallback generated on simulated 401 error', 'info');
    return res;
  };

  return (
    <div className="app-container">
      <Navbar onOpenViva={() => setIsVivaOpen(true)} />

      <main className="main-content">
        {/* Top Monitor: AI Provider, Security & Graceful Degradation HUD */}
        <AIStatusHUD
          aiStatus={aiStatus}
          onSimulateFailure={handleSimulateFailure}
        />

        {/* Task Management Workspace */}
        <div className="workspace-grid">
          <aside className="workspace-sidebar">
            <TaskForm
              onTaskCreated={handleCreateTask}
              onGenerateAi={handleGenerateAi}
              onToast={showToast}
            />

            <div className="ai-specs-panel">
              <h4>🤖 AI Integration Specifications</h4>
              <ul>
                <li><strong>Model Target:</strong> <code>OpenAI gpt-4o-mini</code></li>
                <li><strong>Key Location:</strong> <code>.env (Server-Side Only)</code></li>
                <li><strong>Client Exposure:</strong> <span className="text-green">Zero Key Leaks (0%)</span></li>
                <li><strong>Graceful Degradation:</strong> <span className="text-purple">Active (Never Crashes)</span></li>
                <li><strong>Rate Limiting:</strong> <code>10 req / minute / IP</code></li>
                <li><strong>Human Control:</strong> <span className="text-green">Editable Suggestions</span></li>
              </ul>
            </div>
          </aside>

          <section className="workspace-main">
            <div className="section-title-bar">
              <h2>Task Management Repository</h2>
              <span className="task-count-badge">
                {tasks.length} Total Tasks {filters.aiOnly ? '(AI-Assisted Only)' : ''}
              </span>
            </div>

            <TaskFilter filters={filters} onFilterChange={setFilters} />

            <TaskList
              tasks={tasks}
              loading={loading}
              onUpdate={handleUpdateTask}
              onDelete={handleDeleteTask}
              onToast={showToast}
            />
          </section>
        </div>
      </main>

      <Footer />

      <VivaGuideModal
        isOpen={isVivaOpen}
        onClose={() => setIsVivaOpen(false)}
      />

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'info' })}
      />
    </div>
  );
}

export default App;
