// Code Diff Tracking Service
// [📚🔍⚖️🌐💡]⨹[🤖🧠🔄🔧]⇨[🎯💡🔄🔐]
const diff = require('diff');
const crypto = require('crypto');

class CodeDiffService {
  constructor() {
    this.diffs = new Map();
    this.fileHistory = new Map();
  }

  createDiff(agentId, filePath, oldContent, newContent) {
    const diffId = crypto.randomBytes(16).toString('hex');
    const changes = diff.diffLines(oldContent, newContent);
    const timestamp = new Date();

    const diffRecord = {
      id: diffId,
      agentId,
      filePath,
      changes,
      timestamp,
      summary: this.generateSummary(changes)
    };

    this.diffs.set(diffId, diffRecord);

    if (!this.fileHistory.has(filePath)) {
      this.fileHistory.set(filePath, []);
    }
    this.fileHistory.get(filePath).push(diffId);

    return diffRecord;
  }

  generateSummary(changes) {
    let added = 0;
    let removed = 0;

    changes.forEach(change => {
      if (change.added) added += change.count;
      if (change.removed) removed += change.count;
    });

    return { added, removed };
  }

  getDiff(diffId) {
    return this.diffs.get(diffId);
  }

  getFileHistory(filePath) {
    if (!this.fileHistory.has(filePath)) {
      return [];
    }
    return this.fileHistory.get(filePath).map(id => this.diffs.get(id));
  }

  getAgentDiffs(agentId) {
    return Array.from(this.diffs.values())
      .filter(d => d.agentId === agentId);
  }
}

module.exports = CodeDiffService;