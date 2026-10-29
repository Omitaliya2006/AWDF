/**
 * Task Controller with In-Memory Caching (node-cache)
 * Practical 9: In-Memory Caching and Query Optimization
 * Student: Om Italiya (24IT029) - CSPIT CHARUSAT
 */

const Task = require('../models/Task');
const cache = require('../config/cache');

// Key naming conventions
const CACHE_KEY_ALL = 'all_tasks';
const getTaskCacheKey = (id) => `task_${id}`;

/**
 * GET /tasks
 * Check cache first -> HIT: return immediately -> MISS: query MongoDB, cache, return
 */
async function getAllTasks(req, res, next) {
  const startTime = process.hrtime();
  try {
    const bypassCache = req.query.bypassCache === 'true' || req.headers['x-bypass-cache'] === 'true';

    // Step 3: Check cache if bypass is not requested
    if (!bypassCache) {
      const cached = cache.get('all_tasks');
      if (cached) {
        const diff = process.hrtime(startTime);
        const duration = (diff[0] * 1000 + diff[1] / 1e6).toFixed(2);
        res.setHeader('X-Cache', 'HIT');
        res.setHeader('X-Response-Time', `${duration}ms`);
        return res.status(200).json({
          success: true,
          source: 'cache',
          cacheStatus: 'HIT',
          responseTimeMs: parseFloat(duration),
          count: cached.length,
          data: cached
        });
      }
    }

    // Cache MISS or Cache Bypass -> Query MongoDB
    const tasks = await Task.find().sort({ createdAt: -1 });

    // Store in cache with standard TTL (60s)
    if (!bypassCache) {
      cache.set('all_tasks', tasks);
    }

    const diff = process.hrtime(startTime);
    const duration = (diff[0] * 1000 + diff[1] / 1e6).toFixed(2);
    res.setHeader('X-Cache', bypassCache ? 'BYPASS' : 'MISS');
    res.setHeader('X-Response-Time', `${duration}ms`);

    return res.status(200).json({
      success: true,
      source: 'database',
      cacheStatus: bypassCache ? 'BYPASS' : 'MISS',
      responseTimeMs: parseFloat(duration),
      count: tasks.length,
      data: tasks
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /tasks/:id
 * Supplementary Problem: Cache single-task endpoint separately
 */
async function getTaskById(req, res, next) {
  const startTime = process.hrtime();
  const { id } = req.params;
  const singleKey = getTaskCacheKey(id);

  try {
    const bypassCache = req.query.bypassCache === 'true' || req.headers['x-bypass-cache'] === 'true';

    // Check single-task cache
    if (!bypassCache) {
      const cachedTask = cache.get(singleKey);
      if (cachedTask) {
        const diff = process.hrtime(startTime);
        const duration = (diff[0] * 1000 + diff[1] / 1e6).toFixed(2);
        res.setHeader('X-Cache', 'HIT');
        res.setHeader('X-Response-Time', `${duration}ms`);
        return res.status(200).json({
          success: true,
          source: 'cache',
          cacheStatus: 'HIT',
          responseTimeMs: parseFloat(duration),
          data: cachedTask
        });
      }
    }

    // Cache MISS -> Query MongoDB
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task Not Found',
        message: `Task with ID ${id} does not exist.`
      });
    }

    if (!bypassCache) {
      cache.set(singleKey, task);
    }

    const diff = process.hrtime(startTime);
    const duration = (diff[0] * 1000 + diff[1] / 1e6).toFixed(2);
    res.setHeader('X-Cache', bypassCache ? 'BYPASS' : 'MISS');
    res.setHeader('X-Response-Time', `${duration}ms`);

    return res.status(200).json({
      success: true,
      source: 'database',
      cacheStatus: bypassCache ? 'BYPASS' : 'MISS',
      responseTimeMs: parseFloat(duration),
      data: task
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /tasks
 * Create task -> Invalidate 'all_tasks' cache key so stale data is never served
 */
async function createTask(req, res, next) {
  try {
    const { title, description, completed, priority } = req.body;

    if (!title || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Task title is required.'
      });
    }

    const newTask = await Task.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      completed: Boolean(completed),
      priority: priority || 'medium'
    });

    // Step 4: Invalidate cache after successful write
    cache.del('all_tasks');

    return res.status(201).json({
      success: true,
      message: 'Task created successfully and all_tasks cache invalidated.',
      invalidatedKeys: ['all_tasks'],
      data: newTask
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /tasks/:id
 * Update task -> Invalidate both 'all_tasks' and 'task_:id' cache keys
 */
async function updateTask(req, res, next) {
  const { id } = req.params;
  const singleKey = getTaskCacheKey(id);

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        error: 'Task Not Found',
        message: `Cannot update non-existent task with ID ${id}`
      });
    }

    // Step 4: Invalidate both list and individual item caches
    cache.del(['all_tasks', singleKey]);

    return res.status(200).json({
      success: true,
      message: `Task ${id} updated and caches invalidated.`,
      invalidatedKeys: ['all_tasks', singleKey],
      data: updatedTask
    });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /tasks/:id
 * Delete task -> Invalidate both 'all_tasks' and 'task_:id' cache keys
 */
async function deleteTask(req, res, next) {
  const { id } = req.params;
  const singleKey = getTaskCacheKey(id);

  try {
    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({
        success: false,
        error: 'Task Not Found',
        message: `Cannot delete non-existent task with ID ${id}`
      });
    }

    // Step 4: Invalidate both list and individual item caches
    cache.del(['all_tasks', singleKey]);

    return res.status(200).json({
      success: true,
      message: `Task ${id} deleted and caches invalidated.`,
      invalidatedKeys: ['all_tasks', singleKey],
      data: deletedTask
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};
