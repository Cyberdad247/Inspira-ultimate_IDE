// Context Management Service
// [📚🔍⚖️🌐💡]⨹[🤖🧠🔄🔧]⇨[🎯💡🔄🔐]
const crypto = require('crypto');

class ContextService {
  constructor() {
    this.contexts = new Map();
    this.agentContexts = new Map();
  }

  createContext(agentId, initialData = {}) {
    const contextId = crypto.randomBytes(16).toString('hex');
    const context = {
      id: contextId,
      agentId,
      data: initialData,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.contexts.set(contextId, context);
    
    if (!this.agentContexts.has(agentId)) {
      this.agentContexts.set(agentId, new Set());
    }
    this.agentContexts.get(agentId).add(contextId);

    return context;
  }

  updateContext(contextId, updates) {
    if (!this.contexts.has(contextId)) {
      throw new Error('Context not found');
    }

    const context = this.contexts.get(contextId);
    context.data = { ...context.data, ...updates };
    context.updatedAt = new Date();
    return context;
  }

  getContext(contextId) {
    return this.contexts.get(contextId);
  }

  getAgentContexts(agentId) {
    if (!this.agentContexts.has(agentId)) {
      return [];
    }
    return Array.from(this.agentContexts.get(agentId))
      .map(id => this.contexts.get(id));
  }

  deleteContext(contextId) {
    if (!this.contexts.has(contextId)) {
      return false;
    }

    const context = this.contexts.get(contextId);
    if (this.agentContexts.has(context.agentId)) {
      this.agentContexts.get(context.agentId).delete(contextId);
    }
    this.contexts.delete(contextId);
    return true;
  }
}

module.exports = ContextService;