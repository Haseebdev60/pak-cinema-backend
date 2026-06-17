import { Router } from 'express';
import mongoose from 'mongoose';
import Showtime from '../models/Showtime.js';
import Booking from '../models/Booking.js';

const router = Router();

// GET all showtimes (populated)
router.get('/', async (req, res) => {
  try {
    const showtimes = await Showtime.find()
      .populate('movieId')
      .populate('screenId')
      .sort({ date: 1, time: 1 });

    const result = showtimes.map((st) => {
      const obj = st.toJSON();
      obj.movie = obj.movieId;
      obj.screen = obj.screenId;
      return obj;
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET showtime by id (populated)
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid showtime ID' });
    }
    const showtime = await Showtime.findById(req.params.id)
      .populate('movieId')
      .populate('screenId');

    if (!showtime) return res.status(404).json({ message: 'Showtime not found' });

    const obj = showtime.toJSON();
    obj.movie = obj.movieId;
    obj.screen = obj.screenId;

    res.json(obj);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST create showtime
router.post('/', async (req, res) => {
  try {
    const showtime = await Showtime.create(req.body);
    res.status(201).json(showtime);
  } catch (error) {
    res.status(400).json({ message: 'Validation error', error: error.message });
  }
});

// PUT update showtime
router.put('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid showtime ID' });
    }
    const showtime = await Showtime.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!showtime) return res.status(404).json({ message: 'Showtime not found' });
    res.json(showtime);
  } catch (error) {
    res.status(400).json({ message: 'Update error', error: error.message });
  }
});

// DELETE showtime + cascade delete bookings
router.delete('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid showtime ID' });
    }
    const showtime = await Showtime.findByIdAndDelete(req.params.id);
    if (!showtime) return res.status(404).json({ message: 'Showtime not found' });

    // Cascade delete all bookings for this showtime
    await Booking.deleteMany({ showtimeId: req.params.id });

    res.json({ message: 'Showtime and associated bookings deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
