// AI Status Routes
// [📚🔍⚖️🌐💡]⨹[🤖🧠🔄🔧]⇨[🎯💡🔄🔐]
const express = require('express');
const router = express.Router();
const AIStatusService = require('../ai/statusService');
const statusService = new AIStatusService();

router.get('/status', (req, res) => {
  try {
    const systemStatus = statusService.getSystemStatus();
    res.json(systemStatus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/status/:agentId', (req, res) => {
  try {
    const { agentId } = req.params;
    const agentStatus = statusService.getAgentStatus(agentId);
    res.json(agentStatus);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.post('/status/:agentId', (req, res) => {
  try {
    const { agentId } = req.params;
    const { status, confidence } = req.body;
    statusService.setStatus(agentId, status, confidence);
    res.status(201).json({ message: 'Status updated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;