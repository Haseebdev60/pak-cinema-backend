import { Router } from 'express';
import mongoose from 'mongoose';
import Screen from '../models/Screen.js';
import Showtime from '../models/Showtime.js';

const router = Router();

// GET all screens
router.get('/', async (req, res) => {
  try {
    const screens = await Screen.find().sort({ name: 1 });
    res.json(screens);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET screen by id
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid screen ID' });
    }
    const screen = await Screen.findById(req.params.id);
    if (!screen) return res.status(404).json({ message: 'Screen not found' });
    res.json(screen);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST create screen
router.post('/', async (req, res) => {
  try {
    const screen = await Screen.create(req.body);
    res.status(201).json(screen);
  } catch (error) {
    res.status(400).json({ message: 'Validation error', error: error.message });
  }
});

// PUT update screen
router.put('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid screen ID' });
    }
    const screen = await Screen.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!screen) return res.status(404).json({ message: 'Screen not found' });
    res.json(screen);
  } catch (error) {
    res.status(400).json({ message: 'Update error', error: error.message });
  }
});

// DELETE screen + cascade delete showtimes
router.delete('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid screen ID' });
    }
    const screen = await Screen.findByIdAndDelete(req.params.id);
    if (!screen) return res.status(404).json({ message: 'Screen not found' });

    // Cascade delete all showtimes for this screen
    await Showtime.deleteMany({ screenId: req.params.id });

    res.json({ message: 'Screen and associated showtimes deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
