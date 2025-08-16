// AI Status Tracking Service
// [📚🔍⚖️🌐💡]⨹[🤖🧠🔄🔧]⇨[🎯💡🔄🔐]
const EventEmitter = require('events');

class AIStatusService extends EventEmitter {
  constructor() {
    super();
    this.status = 'idle';
    this.confidence = 1.0;
    this.agents = {};
  }

  setStatus(agentId, status, confidence = 1.0) {
    this.agents[agentId] = { status, confidence };
    this.updateOverallStatus();
    this.emit('statusChange', { agentId, status, confidence });
  }

  updateOverallStatus() {
    const activeStates = Object.values(this.agents)
      .map(agent => agent.status)
      .filter(s => s !== 'idle');

    this.status = activeStates.length > 0 ? 'active' : 'idle';
    this.confidence = Math.min(...Object.values(this.agents)
      .map(agent => agent.confidence));
  }

  getAgentStatus(agentId) {
    return this.agents[agentId] || { status: 'idle', confidence: 1.0 };
  }

  getSystemStatus() {
    return {
      status: this.status,
      confidence: this.confidence,
      agents: { ...this.agents }
    };
  }
}

module.exports = AIStatusService;