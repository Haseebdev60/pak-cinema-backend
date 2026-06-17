import mongoose from 'mongoose';

const concessionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ['Popcorn', 'Drinks', 'Snacks', 'Burgers', 'Pizza', 'Fries', 'Ice Cream'],
    },
    price: { type: Number, required: true },
    available: { type: Boolean, default: true },
    stock: { type: Number, default: 0 },
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

const Concession = mongoose.model('Concession', concessionSchema);

export default Concession;
