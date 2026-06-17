import { Router } from 'express';
import mongoose from 'mongoose';
import Booking from '../models/Booking.js';
import Customer from '../models/Customer.js';
import Showtime from '../models/Showtime.js';
import Ticket from '../models/Ticket.js';
import Order from '../models/Order.js';
import Concession from '../models/Concession.js';

const router = Router();

// GET all bookings (populated and enriched)
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('customerId')
      .populate({
        path: 'showtimeId',
        populate: { path: 'movieId screenId' }
      })
      .sort({ createdAt: -1 });

    const enrichedBookings = await Promise.all(
      bookings.map(async (b) => {
        const tickets = await Ticket.find({ bookingId: b._id });
        const obj = b.toJSON();
        obj.customer = obj.customerId;
        obj.showtime = obj.showtimeId;
        if (obj.showtime) {
          obj.movie = obj.showtime.movieId;
          obj.screen = obj.showtime.screenId;
        }
        obj.tickets = tickets;
        return obj;
      })
    );

    res.json(enrichedBookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET booking by id
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid booking ID' });
    }
    const booking = await Booking.findById(req.params.id)
      .populate('customerId')
      .populate({
        path: 'showtimeId',
        populate: { path: 'movieId screenId' }
      });

    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const tickets = await Ticket.find({ bookingId: booking._id });
    const obj = booking.toJSON();
    obj.customer = obj.customerId;
    obj.showtime = obj.showtimeId;
    if (obj.showtime) {
      obj.movie = obj.showtime.movieId;
      obj.screen = obj.showtime.screenId;
    }
    obj.tickets = tickets;

    res.json(obj);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST create booking (transactional)
router.post('/', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { customer, showtimeId, seats, ticketType, concessionsOrdered } = req.body;

    if (!showtimeId || !seats || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ message: 'Missing showtimeId or seats' });
    }

    // 1. Find or create customer
    let dbCustomer = null;
    if (customer.cnic) {
      dbCustomer = await Customer.findOne({ cnic: customer.cnic }).session(session);
    }
    if (!dbCustomer && customer.phone) {
      dbCustomer = await Customer.findOne({ phone: customer.phone }).session(session);
    }
    if (!dbCustomer) {
      dbCustomer = new Customer({
        name: customer.name,
        phone: customer.phone,
        cnic: customer.cnic,
        email: customer.email
      });
      await dbCustomer.save({ session });
    } else {
      // Update customer details if they are updated
      dbCustomer.name = customer.name || dbCustomer.name;
      dbCustomer.email = customer.email || dbCustomer.email;
      await dbCustomer.save({ session });
    }

    // 2. Validate showtime
    const showtime = await Showtime.findById(showtimeId).session(session);
    if (!showtime) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Showtime not found' });
    }

    // Check seat availability
    const overlapping = seats.filter(seat => showtime.seatsBooked.includes(seat));
    if (overlapping.length > 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: `Seats already booked: ${overlapping.join(', ')}` });
    }

    // 3. Book seats
    showtime.seatsBooked.push(...seats);
    await showtime.save({ session });

    // 4. Create Booking
    const totalPrice = (showtime.price || 0) * seats.length;
    const booking = new Booking({
      customerId: dbCustomer._id,
      showtimeId: showtime._id,
      totalPrice,
      seatCount: seats.length,
      paymentStatus: 'Paid'
    });
    await booking.save({ session });

    // 5. Create Tickets
    const tickets = [];
    for (const seat of seats) {
      const ticket = new Ticket({
        bookingId: booking._id,
        seatNumber: seat,
        ticketType: ticketType || 'Standard',
        price: showtime.price
      });
      await ticket.save({ session });
      tickets.push(ticket);
    }

    // 6. Concessions Order
    let order = null;
    if (concessionsOrdered && Array.isArray(concessionsOrdered) && concessionsOrdered.length > 0) {
      let totalAmount = 0;
      const orderItems = [];

      for (const item of concessionsOrdered) {
        const concession = await Concession.findById(item.concessionId).session(session);
        if (!concession) {
          throw new Error(`Concession item ${item.concessionId} not found`);
        }
        if (concession.stock < item.quantity) {
          throw new Error(`Insufficient stock for concession ${concession.name}`);
        }

        // Deduct stock
        concession.stock -= item.quantity;
        await concession.save({ session });

        orderItems.push({
          concessionId: concession._id,
          quantity: item.quantity,
          price: concession.price
        });
        totalAmount += concession.price * item.quantity;
      }

      order = new Order({
        customerId: dbCustomer._id,
        bookingId: booking._id,
        items: orderItems,
        totalAmount
      });
      await order.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      booking,
      customer: dbCustomer,
      tickets,
      order
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: 'Booking transaction failed', error: error.message });
  }
});

// DELETE booking (Release seats, delete tickets & orders)
router.delete('/:id', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid booking ID' });
    }

    const booking = await Booking.findById(req.params.id).session(session);
    if (!booking) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Find associated tickets to know which seats to release
    const tickets = await Ticket.find({ bookingId: booking._id }).session(session);
    const seatNumbers = tickets.map(t => t.seatNumber);

    // Release seats from showtime
    const showtime = await Showtime.findById(booking.showtimeId).session(session);
    if (showtime) {
      showtime.seatsBooked = showtime.seatsBooked.filter(seat => !seatNumbers.includes(seat));
      await showtime.save({ session });
    }

    // Delete tickets
    await Ticket.deleteMany({ bookingId: booking._id }).session(session);

    // Delete associated orders
    await Order.deleteMany({ bookingId: booking._id }).session(session);

    // Delete booking
    await Booking.findByIdAndDelete(booking._id).session(session);

    await session.commitTransaction();
    session.endSession();

    res.json({ message: 'Booking deleted successfully and seats released.' });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: 'Delete booking transaction failed', error: error.message });
  }
});

export default router;
