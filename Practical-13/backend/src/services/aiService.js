/**
 * Practical 13: AI API Integration into a Web Application
 * Secure AI Service Layer with Graceful Degradation & Provider Abstraction
 * Author: Om Italiya (24IT029)
 */

let OpenAI = null;
try {
  OpenAI = require('openai');
} catch (e) {
  // If openai is not yet installed or loaded, fallback gracefully
}

// Contextual heuristic generator for graceful degradation when external API is unreachable or fails
const generateContextualFallback = (title) => {
  const lower = (title || '').toLowerCase();

  let category = 'General Development Task';
  let priority = 'medium';
  let estimatedDays = 3;
  let steps = [
    'Analyze requirements and review existing codebase architecture.',
    'Implement the core functionality and handle edge cases.',
    'Write automated tests and document implementation details.'
  ];

  if (lower.includes('bug') || lower.includes('fix') || lower.includes('error') || lower.includes('crash')) {
    category = 'Bug Fix & Defect Remediation';
    priority = 'high';
    estimatedDays = 1;
    steps = [
      'Reproduce the defect locally and isolate the root cause.',
      'Implement defensive fix and verify regression test suite.',
      'Deploy patch and monitor application logs.'
    ];
  } else if (lower.includes('auth') || lower.includes('security') || lower.includes('jwt') || lower.includes('password')) {
    category = 'Security & Authentication Engineering';
    priority = 'high';
    estimatedDays = 2;
    steps = [
      'Verify token signing, secret management, and expiration policies.',
      'Sanitize request inputs and protect API routes with auth middleware.',
      'Ensure sensitive credentials are never leaked in server logs.'
    ];
  } else if (lower.includes('test') || lower.includes('jest') || lower.includes('ci') || lower.includes('docker')) {
    category = 'DevOps & Quality Assurance';
    priority = 'high';
    estimatedDays = 2;
    steps = [
      'Define automated unit/integration test specifications.',
      'Verify container build stages and pipeline pass/fail status.',
      'Validate exit codes and regression coverage.'
    ];
  } else if (lower.includes('ui') || lower.includes('css') || lower.includes('frontend') || lower.includes('component')) {
    category = 'Frontend User Interface & Styling';
    priority = 'medium';
    estimatedDays = 3;
    steps = [
      'Design responsive, accessible component layout matching design specs.',
      'Connect component state with backend API endpoints.',
      'Test across mobile and desktop browser viewports.'
    ];
  } else if (lower.includes('database') || lower.includes('mongo') || lower.includes('schema') || lower.includes('model')) {
    category = 'Database Architecture & Data Modeling';
    priority = 'medium';
    estimatedDays = 2;
    steps = [
      'Define Mongoose schema fields with strict type validation.',
      'Add database indexing for query performance optimization.',
      'Implement pre-save hooks for input sanitization.'
    ];
  }

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + estimatedDays);

  const formattedDescription = 
`[${category}]
Summary: Complete implementation and verification for "${title}".

Key Objectives:
• ${steps[0]}
• ${steps[1]}
• ${steps[2]}

Suggested Priority: ${priority.toUpperCase()} | Estimated Completion: ${estimatedDays} business day(s).`;

  return {
    description: formattedDescription,
    suggestedPriority: priority,
    suggestedDueDate: dueDate.toISOString(),
    estimatedDays,
    category,
    fallback: true,
    provider: 'graceful-fallback-engine',
    model: 'heuristic-rule-engine-v1',
    disclaimer: '⚠️ AI suggestion generated via local fallback engine. Please review and adjust before saving.'
  };
};

class AIService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || '';
    this.provider = process.env.AI_SERVICE_PROVIDER || 'openai';
  }

  /**
   * Generates task description, priority, and deadline suggestion.
   * If external API call succeeds -> returns AI generated content.
   * If external call fails/times out -> catches error and returns contextual fallback.
   */
  async generateTaskDescription(title, options = {}) {
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      throw new Error('Task title is required to generate description.');
    }

    const cleanTitle = title.trim();

    // Force failure mode for live demonstration of graceful degradation
    if (options.forceFailure === true || cleanTitle.toLowerCase().includes('[simulate-failure]')) {
      console.warn('[AI Service] Force failure triggered: Demonstrating graceful degradation path.');
      return generateContextualFallback(cleanTitle);
    }

    // Check if an actual live API key is present
    const apiKey = process.env.OPENAI_API_KEY;
    const isMockKey = !apiKey || apiKey === 'your_key_here' || apiKey.startsWith('mock-');

    if (isMockKey || !OpenAI) {
      console.log(`[AI Service] No production OpenAI key configured. Invoking graceful degradation engine.`);
      return generateContextualFallback(cleanTitle);
    }

    // Call official OpenAI SDK
    try {
      const client = new OpenAI({ apiKey: apiKey, timeout: 8000 });

      const prompt = `You are a software project management assistant. Given the task title "${cleanTitle}", write a concise, professional task description with 2-3 bullet points for acceptance criteria. Also recommend a priority (low, medium, or high) and estimated days to complete (1 to 5).
Format response as JSON with keys: "description", "priority", "estimatedDays".`;

      const completion = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an AI assistant for a software task management app. Always answer in valid JSON.' },
          { role: 'user', content: prompt }
        ],
        response_format: { type: 'json_object' },
        max_tokens: 250,
        temperature: 0.7
      });

      const responseText = completion.choices[0]?.message?.content || '{}';
      const parsed = JSON.parse(responseText);

      const estimatedDays = parsed.estimatedDays || 2;
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + estimatedDays);

      return {
        description: parsed.description || cleanTitle,
        suggestedPriority: (parsed.priority || 'medium').toLowerCase(),
        suggestedDueDate: dueDate.toISOString(),
        estimatedDays,
        fallback: false,
        provider: 'openai',
        model: 'gpt-4o-mini',
        disclaimer: '✨ AI-generated suggestion via OpenAI gpt-4o-mini. Review and verify accuracy before saving.'
      };
    } catch (err) {
      // GRACEFUL DEGRADATION: Catch external API failure (401, 429, timeout, network error)
      console.warn(`[AI Service Graceful Degradation] External AI API call failed: ${err.message}. Serving fallback.`);
      const fallbackData = generateContextualFallback(cleanTitle);
      fallbackData.errorDetail = 'External AI service temporarily unavailable or key unconfigured.';
      return fallbackData;
    }
  }

  getServiceStatus() {
    const hasKey = !!process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.startsWith('mock-');
    return {
      provider: this.provider,
      keyConfigured: hasKey,
      keyStorageLocation: '.env (Server-Side Only)',
      fallbackEngineActive: true,
      rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_AI_WINDOW_MS, 10) || 60000,
      rateLimitMax: parseInt(process.env.RATE_LIMIT_AI_MAX, 10) || 10,
      responsibleAiPrinciples: [
        'Data Minimization: Only task titles sent; zero PII or credentials shared.',
        'Human-in-the-Loop: AI output is an editable suggestion, never committed automatically.',
        'Graceful Degradation: App core functionality remains 100% operational during API failure.',
        'Transparency: Prominent disclaimer badges inform users of AI-generated content.'
      ]
    };
  }
}

module.exports = new AIService();
