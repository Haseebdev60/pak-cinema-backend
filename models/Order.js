import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
    orderDate: { type: Date, default: Date.now },
    items: [
      {
        concessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Concession' },
        quantity: { type: Number },
        price: { type: Number },
      },
    ],
    totalAmount: { type: Number },
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

const Order = mongoose.model('Order', orderSchema);

export default Order;
