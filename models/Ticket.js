import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema(
  {
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    seatNumber: { type: String, required: true },
    ticketType: {
      type: String,
      enum: ['Standard', 'Premium', 'VIP'],
      default: 'Standard',
    },
    price: { type: Number },
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

const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;
