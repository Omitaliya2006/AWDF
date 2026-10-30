/**
 * Practical 13: AI API Integration into a Web Application
 * Frontend API Service Layer
 * Author: Om Italiya (24IT029)
 */

export const generateAiDescription = async (title, forceFailure = false) => {
  const res = await fetch('/api/ai/generate-description', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, forceFailure })
  });
  const data = await res.json();
  if (res.status === 429) {
    throw new Error(data.message || 'AI request rate limit reached. Please wait a moment.');
  }
  if (!res.ok) throw new Error(data.message || 'AI generation failed');
  return data;
};

export const simulateAiFailure = async (title) => {
  const res = await fetch('/api/ai/simulate-failure', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  });
  return await res.json();
};

export const fetchAiStatus = async () => {
  try {
    const res = await fetch('/api/ai/status');
    if (!res.ok) throw new Error('Failed to load status');
    return await res.json();
  } catch (err) {
    return {
      success: true,
      author: 'Om Italiya (24IT029)',
      status: {
        provider: 'openai',
        keyConfigured: false,
        keyStorageLocation: '.env (Server-Side Only)',
        fallbackEngineActive: true,
        responsibleAiPrinciples: [
          'Data Minimization: Only task titles sent; zero PII or credentials shared.',
          'Human-in-the-Loop: AI output is an editable suggestion, never committed automatically.',
          'Graceful Degradation: App core functionality remains 100% operational during API failure.',
          'Transparency: Prominent disclaimer badges inform users of AI-generated content.'
        ]
      }
    };
  }
};

export const fetchTasks = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.status && filters.status !== 'all') params.append('status', filters.status);
    if (filters.priority && filters.priority !== 'all') params.append('priority', filters.priority);
    if (filters.aiOnly) params.append('aiOnly', 'true');
    if (filters.search) params.append('search', filters.search);

    const res = await fetch(`/api/tasks?${params.toString()}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[API Service] Task fetch fallback:', err.message);
    return {
      success: true,
      count: 2,
      data: [
        {
          _id: 'local_ai_1',
          title: 'Integrate OpenAI / Gemini API Securely',
          description: '[Security & Authentication]\nSummary: Configure server-side API call in Express and hide key in .env.\n• API key never exposed in browser Network tab.\n• Graceful degradation fallback on 401 error.\n• Rate limiter protecting API quotas.',
          status: 'completed',
          priority: 'high',
          assignedTo: 'Om Italiya (24IT029)',
          isAiGenerated: true,
          aiProvider: 'openai'
        },
        {
          _id: 'local_ai_2',
          title: 'Demonstrate Graceful Degradation Live',
          description: 'Simulate API failure and verify the app continues functioning without crash.',
          status: 'in-progress',
          priority: 'medium',
          assignedTo: 'Om Italiya (24IT029)',
          isAiGenerated: true,
          aiProvider: 'graceful-fallback-engine'
        }
      ]
    };
  }
};

export const createTask = async (taskData) => {
  const res = await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create task');
  return data;
};

export const updateTask = async (id, taskData) => {
  const res = await fetch(`/api/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update task');
  return data;
};

export const deleteTask = async (id) => {
  const res = await fetch(`/api/tasks/${id}`, {
    method: 'DELETE'
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete task');
  return data;
};
