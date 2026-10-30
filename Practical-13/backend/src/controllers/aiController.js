/**
 * Practical 13: AI API Integration into a Web Application
 * AI Controller handling Text Generation, Fallbacks & Responsible AI
 * Author: Om Italiya (24IT029)
 */

const aiService = require('../services/aiService');

// @desc Generate AI-powered task description, priority & deadline
// @route POST /api/ai/generate-description
exports.generateDescription = async (req, res) => {
  try {
    const { title, forceFailure } = req.body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Task title is required to generate a description'
      });
    }

    const result = await aiService.generateTaskDescription(title, { forceFailure });

    return res.status(200).json({
      success: true,
      title: title.trim(),
      description: result.description,
      suggestedPriority: result.suggestedPriority,
      suggestedDueDate: result.suggestedDueDate,
      estimatedDays: result.estimatedDays,
      fallback: result.fallback,
      provider: result.provider,
      model: result.model,
      disclaimer: result.disclaimer,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    // Ultimate defensive catch to ensure the app never crashes
    console.error('[AI Controller Error]:', error.message);
    return res.status(200).json({
      success: true,
      description: `Task: ${req.body.title || 'Untitled'} - Please write description manually.`,
      suggestedPriority: 'medium',
      suggestedDueDate: new Date().toISOString(),
      fallback: true,
      provider: 'safety-catch',
      disclaimer: '⚠️ AI service error handled gracefully. Core app remains operational.'
    });
  }
};

// @desc Explicitly simulate an AI API failure to demonstrate Graceful Degradation
// @route POST /api/ai/simulate-failure
exports.simulateFailure = async (req, res) => {
  const { title } = req.body;
  const taskTitle = title || 'Critical Security Fix for JWT Token Expiration';

  const result = await aiService.generateTaskDescription(taskTitle, { forceFailure: true });

  return res.status(200).json({
    success: true,
    simulatedFailure: true,
    message: 'Simulated external AI API failure (HTTP 401/timeout). Demonstrating graceful degradation.',
    data: result
  });
};

// @desc Get AI Service Provider Status & Governance Metadata
// @route GET /api/ai/status
exports.getAIStatus = (req, res) => {
  const status = aiService.getServiceStatus();
  return res.status(200).json({
    success: true,
    author: 'Om Italiya (24IT029)',
    service: 'Task Management AI Integration Service',
    status
  });
};
