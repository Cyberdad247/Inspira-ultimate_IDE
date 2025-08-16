// Context Management Routes
// [📚🔍⚖️🌐💡]⨹[🤖🧠🔄🔧]⇨[🎯💡🔄🔐]
const express = require('express');
const router = express.Router();
const ContextService = require('../context/contextService');
const contextService = new ContextService();

router.get('/contexts', (req, res) => {
  try {
    const contexts = contextService.getAllContexts();
    res.json(contexts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/context/:contextId', (req, res) => {
  try {
    const { contextId } = req.params;
    const context = contextService.getContext(contextId);
    res.json(context);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.post('/context', (req, res) => {
  try {
    const { name, description, symbols } = req.body;
    const newContext = contextService.createContext(name, description, symbols);
    res.status(201).json(newContext);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/context/:contextId', (req, res) => {
  try {
    const { contextId } = req.params;
    const { name, description, symbols } = req.body;
    const updatedContext = contextService.updateContext(contextId, name, description, symbols);
    res.json(updatedContext);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/context/:contextId', (req, res) => {
  try {
    const { contextId } = req.params;
    contextService.deleteContext(contextId);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;