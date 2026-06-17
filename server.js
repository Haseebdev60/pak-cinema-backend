import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Route imports
import movieRoutes from './routes/movies.js';
import screenRoutes from './routes/screens.js';
import showtimeRoutes from './routes/showtimes.js';
import customerRoutes from './routes/customers.js';
import bookingRoutes from './routes/bookings.js';
import ticketRoutes from './routes/tickets.js';
import employeeRoutes from './routes/employees.js';
import concessionRoutes from './routes/concessions.js';
import orderRoutes from './routes/orders.js';
import adminRoutes from './routes/admin.js';

// Load env variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes Mount
app.use('/api/movies', movieRoutes);
app.use('/api/screens', screenRoutes);
app.use('/api/showtimes', showtimeRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/concessions', concessionRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Root Route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Pakistani Cinema Management System Backend API!',
    status: 'Running',
    version: '1.0.0'
  });
});

// Port and Listen
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
