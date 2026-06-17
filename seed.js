import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Import all models
import Movie from './models/Movie.js';
import Screen from './models/Screen.js';
import Showtime from './models/Showtime.js';
import Customer from './models/Customer.js';
import Booking from './models/Booking.js';
import Ticket from './models/Ticket.js';
import Employee from './models/Employee.js';
import Concession from './models/Concession.js';
import Order from './models/Order.js';

dotenv.config();

const seed = async () => {
  try {
    console.log('Connecting to database for seeding...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Database connected.');

    // Clear all collections
    console.log('Clearing existing database collections...');
    await Movie.deleteMany({});
    await Screen.deleteMany({});
    await Showtime.deleteMany({});
    await Customer.deleteMany({});
    await Booking.deleteMany({});
    await Ticket.deleteMany({});
    await Employee.deleteMany({});
    await Concession.deleteMany({});
    await Order.deleteMany({});
    console.log('Existing data cleared.');

    // 1. Insert Movies
    const movies = await Movie.insertMany([
      {
        title: 'The Legend of Maula Jatt',
        poster: 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?auto=format&fit=crop&q=80&w=400',
        banner: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=1200',
        rating: '9.1',
        duration: '150 min',
        genre: 'Action/Drama',
        language: 'Punjabi',
        cast: 'Fawad Khan, Hamza Ali Abbasi, Mahira Khan',
        releaseDate: '2022-10-13',
        synopsis: 'A legendary rivalry between a local hero Maula Jatt and a brutal clan leader Noori Natt.',
        status: 'Now Showing'
      },
      {
        title: 'Kamli',
        poster: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=400',
        banner: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=80&w=1200',
        rating: '8.5',
        duration: '135 min',
        genre: 'Drama/Mystery',
        language: 'Urdu',
        cast: 'Saba Qamar, Hamza Ali Abbasi, Sania Saeed',
        releaseDate: '2022-06-03',
        synopsis: 'A young woman living with her blind sister-in-law awaits her husband\'s return, only to be drawn into a mysterious love affair.',
        status: 'Now Showing'
      },
      {
        title: 'Joyland',
        poster: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&q=80&w=400',
        banner: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=1200',
        rating: '8.7',
        duration: '126 min',
        genre: 'Drama/Romance',
        language: 'Urdu/Punjabi',
        cast: 'Ali Junejo, Rasti Farooq, Alina Khan',
        releaseDate: '2022-11-18',
        synopsis: 'A patriarchal family\'s youngest son secretly joins an erotic dance theatre and falls in love with a trans starlet.',
        status: 'Now Showing'
      },
      {
        title: 'Sherdil',
        poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=400',
        banner: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=1200',
        rating: '7.2',
        duration: '120 min',
        genre: 'Action/War',
        language: 'Urdu/English',
        cast: 'Mikaal Zulfiqar, Armeena Khan, Hassan Niazi',
        releaseDate: '2019-03-22',
        synopsis: 'A story of a pilot in the Pakistan Air Force, dealing with personal conflicts, duty, and honor.',
        status: 'Now Showing'
      },
      {
        title: 'Quaid-e-Azam Zindabad',
        poster: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&q=80&w=400',
        banner: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=1200',
        rating: '7.8',
        duration: '140 min',
        genre: 'Action/Comedy',
        language: 'Urdu',
        cast: 'Fahad Mustafa, Mahira Khan',
        releaseDate: '2022-07-09',
        synopsis: 'A corrupt cop gets a rude awakening when currency notes start displaying the Quaid\'s face speaking to him.',
        status: 'Coming Soon'
      },
      {
        title: 'London Nahi Jaunga',
        poster: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=400',
        banner: 'https://images.unsplash.com/photo-1533928298208-27ff66555d8d?auto=format&fit=crop&q=80&w=1200',
        rating: '7.0',
        duration: '145 min',
        genre: 'Comedy/Romance',
        language: 'Urdu/Punjabi',
        cast: 'Humayun Saeed, Mehwish Hayat, Kubra Khan',
        releaseDate: '2022-07-09',
        synopsis: 'A Pakistani man falls for an NRI girl in London and attempts to win her heart through a comedy of errors.',
        status: 'Coming Soon'
      }
    ]);
    console.log(`Seeded ${movies.length} movies.`);

    // 2. Insert Screens
    const screens = await Screen.insertMany([
      { name: 'Screen 1', type: 'Standard', capacity: 80, rows: 8, cols: 10 },
      { name: 'Screen 2', type: 'IMAX', capacity: 100, rows: 10, cols: 10 },
      { name: 'Screen 3', type: 'VIP Lounge', capacity: 40, rows: 5, cols: 8 },
      { name: 'Screen 4', type: '4DX Experience', capacity: 64, rows: 8, cols: 8 }
    ]);
    console.log(`Seeded ${screens.length} screens.`);

    // 3. Insert Showtimes
    const showtimes = await Showtime.insertMany([
      {
        movieId: movies[0]._id, // Maula Jatt
        screenId: screens[1]._id, // IMAX
        date: '2026-06-18',
        time: '03:00 PM',
        price: 1200,
        seatsBooked: ['B-3', 'B-4', 'C-1']
      },
      {
        movieId: movies[0]._id, // Maula Jatt
        screenId: screens[1]._id, // IMAX
        date: '2026-06-18',
        time: '07:00 PM',
        price: 1200,
        seatsBooked: ['E-5', 'E-6']
      },
      {
        movieId: movies[1]._id, // Kamli
        screenId: screens[0]._id, // Standard
        date: '2026-06-18',
        time: '06:00 PM',
        price: 800,
        seatsBooked: []
      },
      {
        movieId: movies[2]._id, // Joyland
        screenId: screens[2]._id, // VIP
        date: '2026-06-18',
        time: '10:00 PM',
        price: 2000,
        seatsBooked: ['A-1', 'A-2']
      },
      {
        movieId: movies[3]._id, // Sherdil
        screenId: screens[3]._id, // 4DX
        date: '2026-06-18',
        time: '04:00 PM',
        price: 1500,
        seatsBooked: ['D-4']
      },
      {
        movieId: movies[1]._id, // Kamli
        screenId: screens[0]._id, // Standard
        date: '2026-06-18',
        time: '01:30 PM',
        price: 800,
        seatsBooked: []
      }
    ]);
    console.log(`Seeded ${showtimes.length} showtimes.`);

    // 4. Insert Customers
    const customers = await Customer.insertMany([
      { name: 'Ali Ahmed', phone: '03001234567', cnic: '35201-1234567-1', email: 'ali@example.com' },
      { name: 'Zainab Fatima', phone: '03217654321', cnic: '35202-7654321-2', email: 'zainab@example.com' },
      { name: 'Bilal Khan', phone: '03339876543', cnic: '17301-9876543-3', email: 'bilal@example.com' }
    ]);
    console.log(`Seeded ${customers.length} customers.`);

    // 5. Insert Bookings
    const bookings = await Booking.insertMany([
      {
        customerId: customers[0]._id,
        showtimeId: showtimes[0]._id,
        bookingDate: new Date('2026-06-17T14:30:00Z'),
        totalPrice: 2400,
        seatCount: 2,
        paymentStatus: 'Paid'
      },
      {
        customerId: customers[1]._id,
        showtimeId: showtimes[3]._id,
        bookingDate: new Date('2026-06-17T15:00:00Z'),
        totalPrice: 4000,
        seatCount: 2,
        paymentStatus: 'Paid'
      },
      {
        customerId: customers[2]._id,
        showtimeId: showtimes[4]._id,
        bookingDate: new Date('2026-06-17T16:15:00Z'),
        totalPrice: 1500,
        seatCount: 1,
        paymentStatus: 'Paid'
      }
    ]);
    console.log(`Seeded ${bookings.length} bookings.`);

    // 6. Insert Tickets
    const tickets = await Ticket.insertMany([
      { bookingId: bookings[0]._id, seatNumber: 'B-3', ticketType: 'Premium', price: 1200 },
      { bookingId: bookings[0]._id, seatNumber: 'B-4', ticketType: 'Premium', price: 1200 },
      { bookingId: bookings[1]._id, seatNumber: 'A-1', ticketType: 'VIP', price: 2000 },
      { bookingId: bookings[1]._id, seatNumber: 'A-2', ticketType: 'VIP', price: 2000 },
      { bookingId: bookings[2]._id, seatNumber: 'D-4', ticketType: 'Standard', price: 1500 }
    ]);
    console.log(`Seeded ${tickets.length} tickets.`);

    // 7. Insert Employees
    const employees = await Employee.insertMany([
      { name: 'Haris Shah', role: 'Cinema Manager', email: 'haris@cinepax.pk', phone: '03009998887', salary: 75000 },
      { name: 'Sana Rizvi', role: 'Ticketing Agent', email: 'sana@cinepax.pk', phone: '03215554443', salary: 35000 },
      { name: 'Kamil Butt', role: 'Concession Supervisor', email: 'kamil@cinepax.pk', phone: '03334445556', salary: 40000 },
      { name: 'Yasir Mehmood', role: 'Technician', email: 'yasir@cinepax.pk', phone: '03126667778', salary: 45000 }
    ]);
    console.log(`Seeded ${employees.length} employees.`);

    // 8. Insert Concessions
    const concessions = await Concession.insertMany([
      { name: 'Salted Popcorn (Large)', category: 'Popcorn', price: 450, available: true, stock: 120 },
      { name: 'Caramel Popcorn (Large)', category: 'Popcorn', price: 550, available: true, stock: 95 },
      { name: 'Cheese Popcorn (Large)', category: 'Popcorn', price: 500, available: true, stock: 80 },
      { name: 'Coca-Cola (Regular)', category: 'Drinks', price: 250, available: true, stock: 300 },
      { name: 'Fanta (Regular)', category: 'Drinks', price: 250, available: true, stock: 250 },
      { name: 'Sprite (Regular)', category: 'Drinks', price: 250, available: true, stock: 280 },
      { name: 'Chicken Gourmet Burger', category: 'Burgers', price: 650, available: true, stock: 45 },
      { name: 'Beef Double Cheese Burger', category: 'Burgers', price: 800, available: true, stock: 30 },
      { name: 'Chicken Tikka Pizza Slice', category: 'Pizza', price: 400, available: true, stock: 60 },
      { name: 'Masala Fries (Large)', category: 'Fries', price: 300, available: true, stock: 150 },
      { name: 'Loaded Cheese Fries', category: 'Fries', price: 450, available: true, stock: 90 },
      { name: 'Chocolate Waffle Cone', category: 'Ice Cream', price: 350, available: true, stock: 75 }
    ]);
    console.log(`Seeded ${concessions.length} concessions.`);

    // 9. Insert Orders
    const orders = await Order.insertMany([
      {
        customerId: customers[0]._id,
        bookingId: bookings[0]._id,
        orderDate: new Date('2026-06-17T14:35:00Z'),
        items: [
          { concessionId: concessions[1]._id, quantity: 2, price: 550 }, // Caramel Popcorn
          { concessionId: concessions[3]._id, quantity: 2, price: 250 }  // Coca-Cola
        ],
        totalAmount: 1600
      },
      {
        customerId: customers[1]._id,
        bookingId: bookings[1]._id,
        orderDate: new Date('2026-06-17T15:05:00Z'),
        items: [
          { concessionId: concessions[2]._id, quantity: 1, price: 500 }, // Cheese Popcorn
          { concessionId: concessions[9]._id, quantity: 1, price: 300 }, // Masala Fries
          { concessionId: concessions[5]._id, quantity: 2, price: 250 }  // Sprite
        ],
        totalAmount: 1300
      }
    ]);
    console.log(`Seeded ${orders.length} orders.`);

    console.log('Seeding finished successfully!');
    await mongoose.disconnect();
    console.log('Database disconnected.');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seed();
