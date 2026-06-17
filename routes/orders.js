import { Router } from 'express';
import mongoose from 'mongoose';
import Order from '../models/Order.js';

const router = Router();

// GET all orders with details
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customerId')
      .populate('bookingId')
      .populate({
        path: 'items.concessionId',
        model: 'Concession'
      })
      .sort({ createdAt: -1 });

    const transformed = orders.map(order => {
      const obj = order.toJSON();
      obj.customer = obj.customerId;
      obj.booking = obj.bookingId;
      obj.itemsDetailed = (obj.items || []).map(item => ({
        ...item,
        concession: item.concessionId
      }));
      return obj;
    });

    res.json(transformed);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET order by id
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }
    const order = await Order.findById(req.params.id)
      .populate('customerId')
      .populate('bookingId')
      .populate({
        path: 'items.concessionId',
        model: 'Concession'
      });

    if (!order) return res.status(404).json({ message: 'Order not found' });

    const obj = order.toJSON();
    obj.customer = obj.customerId;
    obj.booking = obj.bookingId;
    obj.itemsDetailed = (obj.items || []).map(item => ({
      ...item,
      concession: item.concessionId
    }));

    res.json(obj);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST create order
router.post('/', async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: 'Validation error', error: error.message });
  }
});

// PUT update order
router.put('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: 'Update error', error: error.message });
  }
});

// DELETE order
router.delete('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
