// Code Diff Tracking Routes
// [📚🔍⚖️🌐💡]⨹[🤖🧠🔄🔧]⇨[🎯💡🔄🔐]
const express = require('express');
const router = express.Router();
const CodeDiffService = require('../diff/codeDiffService');
const diffService = new CodeDiffService();

router.get('/diffs', (req, res) => {
  try {
    const diffs = diffService.getAllDiffs();
    res.json(diffs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/diff/:diffId', (req, res) => {
  try {
    const { diffId } = req.params;
    const diff = diffService.getDiff(diffId);
    res.json(diff);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.post('/diff', (req, res) => {
  try {
    const { filePath, before, after } = req.body;
    const newDiff = diffService.createDiff(filePath, before, after);
    res.status(201).json(newDiff);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/diff/file/:filePath', (req, res) => {
  try {
    const { filePath } = req.params;
    const fileDiffs = diffService.getDiffsForFile(filePath);
    res.json(fileDiffs);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

module.exports = router;