import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    showtimeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Showtime', required: true },
    bookingDate: { type: Date, default: Date.now },
    totalPrice: { type: Number },
    seatCount: { type: Number },
    paymentStatus: {
      type: String,
      enum: ['Paid', 'Unpaid', 'Cancelled'],
      default: 'Paid',
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
    toObject: {
      virtuals: true,
      transform(doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
