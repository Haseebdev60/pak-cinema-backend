import { Router } from 'express';
import mongoose from 'mongoose';
import Concession from '../models/Concession.js';

const router = Router();

// GET all concessions
router.get('/', async (req, res) => {
  try {
    const concessions = await Concession.find().sort({ name: 1 });
    res.json(concessions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET concession by id
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid concession ID' });
    }
    const concession = await Concession.findById(req.params.id);
    if (!concession) return res.status(404).json({ message: 'Concession not found' });
    res.json(concession);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST create concession
router.post('/', async (req, res) => {
  try {
    const concession = await Concession.create(req.body);
    res.status(201).json(concession);
  } catch (error) {
    res.status(400).json({ message: 'Validation error', error: error.message });
  }
});

// PUT update concession
router.put('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid concession ID' });
    }
    const concession = await Concession.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!concession) return res.status(404).json({ message: 'Concession not found' });
    res.json(concession);
  } catch (error) {
    res.status(400).json({ message: 'Update error', error: error.message });
  }
});

// DELETE concession
router.delete('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid concession ID' });
    }
    const concession = await Concession.findByIdAndDelete(req.params.id);
    if (!concession) return res.status(404).json({ message: 'Concession not found' });
    res.json({ message: 'Concession deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
