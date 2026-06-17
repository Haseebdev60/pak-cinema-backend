import mongoose from 'mongoose';

const screenSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ['Standard', 'IMAX', 'VIP Lounge', '4DX Experience', 'Premium'],
    },
    capacity: { type: Number },
    rows: { type: Number },
    cols: { type: Number },
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

const Screen = mongoose.model('Screen', screenSchema);

export default Screen;
