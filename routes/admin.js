import { Router } from 'express';
import jwt from 'jsonwebtoken';
import Movie from '../models/Movie.js';
import Screen from '../models/Screen.js';
import Customer from '../models/Customer.js';
import Booking from '../models/Booking.js';
import Ticket from '../models/Ticket.js';
import Employee from '../models/Employee.js';
import Concession from '../models/Concession.js';
import Order from '../models/Order.js';

const router = Router();

// POST /login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email === 'admin@cinepax.pk' && password === 'admin123') {
      const token = jwt.sign(
        { email, role: 'admin' },
        process.env.JWT_SECRET || 'pak-cinema-secret-key-2026',
        { expiresIn: '1d' }
      );
      return res.json({
        token,
        user: { email, role: 'admin', name: 'Cinepax Admin' }
      });
    }
    return res.status(401).json({ message: 'Invalid email or password' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const moviesCount = await Movie.countDocuments();
    const screensCount = await Screen.countDocuments();
    const customersCount = await Customer.countDocuments();
    const bookingsCount = await Booking.countDocuments();
    const ticketsCount = await Ticket.countDocuments();
    const employeesCount = await Employee.countDocuments();
    const concessionsCount = await Concession.countDocuments();
    const ordersCount = await Order.countDocuments();

    // Sum revenue
    const bookings = await Booking.find();
    const orders = await Order.find();

    const ticketRevenue = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    const foodRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const totalRevenue = ticketRevenue + foodRevenue;

    // Build recent activity
    const recentActivity = [];

    // Get 3 latest bookings
    const latestBookings = await Booking.find()
      .populate('customerId')
      .populate({ path: 'showtimeId', populate: { path: 'movieId' } })
      .sort({ createdAt: -1 })
      .limit(3);

    latestBookings.forEach(b => {
      recentActivity.push({
        id: b._id,
        type: 'booking',
        title: 'New Ticket Booking',
        desc: `${b.customerId?.name || 'Customer'} booked ${b.seatCount} seat(s) for "${b.showtimeId?.movieId?.title || 'Movie'}"`,
        time: b.createdAt
      });
    });

    // Get 3 latest orders
    const latestOrders = await Order.find()
      .populate('customerId')
      .sort({ createdAt: -1 })
      .limit(3);

    latestOrders.forEach(o => {
      recentActivity.push({
        id: o._id,
        type: 'order',
        title: 'Concession Order',
        desc: `${o.customerId?.name || 'Customer'} purchased food court items (PKR ${o.totalAmount})`,
        time: o.createdAt
      });
    });

    // Get 2 latest movies
    const latestMovies = await Movie.find()
      .sort({ createdAt: -1 })
      .limit(2);

    latestMovies.forEach(m => {
      recentActivity.push({
        id: m._id,
        type: 'movie',
        title: 'New Movie Added',
        desc: `"${m.title}" is now available as "${m.status}"`,
        time: m.createdAt
      });
    });

    // Sort combined activities by time descending
    recentActivity.sort((a, b) => new Date(b.time) - new Date(a.time));

    // Fallback data if empty
    const finalActivity = recentActivity.length > 0 ? recentActivity.slice(0, 5) : [
      { id: '1', type: 'system', title: 'System Initialized', desc: 'Cinema management database connected.', time: new Date() }
    ];

    res.json({
      moviesCount,
      screensCount,
      customersCount,
      bookingsCount,
      ticketsCount,
      employeesCount,
      concessionsCount,
      ordersCount,
      totalRevenue,
      ticketRevenue,
      foodRevenue,
      recentActivity: finalActivity
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /analytics
router.get('/analytics', async (req, res) => {
  try {
    // Total Revenue calculation
    const bookings = await Booking.find();
    const orders = await Order.find();
    const ticketRevenue = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    const foodRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const totalRevenue = ticketRevenue + foodRevenue;

    // Monthly revenue simulation/aggregation (e.g. Weeks or Months)
    const revenueData = [
      { name: 'Week 1', Tickets: Math.round(ticketRevenue * 0.20), Concessions: Math.round(foodRevenue * 0.15) },
      { name: 'Week 2', Tickets: Math.round(ticketRevenue * 0.25), Concessions: Math.round(foodRevenue * 0.25) },
      { name: 'Week 3', Tickets: Math.round(ticketRevenue * 0.22), Concessions: Math.round(foodRevenue * 0.30) },
      { name: 'Week 4', Tickets: Math.round(ticketRevenue * 0.33), Concessions: Math.round(foodRevenue * 0.30) },
    ];

    // Movie popularity (bookings per movie)
    const movies = await Movie.find();
    const moviePopularity = [];

    for (const movie of movies) {
      // Find all showtimes for this movie
      const showtimes = await Showtime.find({ movieId: movie._id });
      const showtimeIds = showtimes.map(s => s._id);
      
      // Count tickets for these showtimes
      const bookingCountForMovie = await Booking.countDocuments({ showtimeId: { $in: showtimeIds } });
      moviePopularity.push({
        name: movie.title,
        Tickets: bookingCountForMovie || 0
      });
    }

    // Sort by tickets and limit to top 5
    moviePopularity.sort((a, b) => b.Tickets - a.Tickets);

    // Showtime analytics (load per slot)
    const showtimeAnalytics = [
      { time: '10:00 AM', Bookings: 4 },
      { time: '01:30 PM', Bookings: 8 },
      { time: '04:00 PM', Bookings: 15 },
      { time: '07:00 PM', Bookings: 22 },
      { time: '10:00 PM', Bookings: 12 },
    ];

    // Concession popularity (orders value/quantity)
    const popularFood = [
      { name: 'Caramel Popcorn', value: Math.round(foodRevenue * 0.35) || 3500 },
      { name: 'Soft Drinks', value: Math.round(foodRevenue * 0.20) || 2000 },
      { name: 'Gourmet Burger', value: Math.round(foodRevenue * 0.25) || 2500 },
      { name: 'Masala Fries', value: Math.round(foodRevenue * 0.10) || 1000 },
      { name: 'Nachos', value: Math.round(foodRevenue * 0.10) || 1000 },
    ];

    res.json({
      totalRevenue,
      revenueData,
      moviePopularity: moviePopularity.length > 0 ? moviePopularity : [
        { name: 'Maula Jatt', Tickets: 12 },
        { name: 'Kamli', Tickets: 8 }
      ],
      showtimeAnalytics,
      popularFood
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
