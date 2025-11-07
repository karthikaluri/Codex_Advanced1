const express = require('express');
const router = express.Router();
const Problem = require('../models/Problem');

router.get('/', async (req, res) => {
  const list = await Problem.find().limit(100);
  res.json(list);
});

router.get('/:id', async (req, res) => {
  const p = await Problem.findById(req.params.id);
  if (!p) return res.status(404).json({ error: 'Not found' });
  res.json(p);
});

// Admin-style create (no auth for demo)
router.post('/', async (req, res) => {
  const data = req.body;
  const p = new Problem(data);
  await p.save();
  res.json(p);
});

module.exports = router;
