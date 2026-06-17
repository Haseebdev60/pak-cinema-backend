import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    poster: { type: String },
    banner: { type: String },
    rating: { type: String, default: '0' },
    duration: { type: String },
    genre: { type: String },
    language: { type: String },
    cast: { type: String },
    releaseDate: { type: String },
    synopsis: { type: String },
    status: {
      type: String,
      enum: ['Now Showing', 'Coming Soon'],
      default: 'Now Showing',
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

const Movie = mongoose.model('Movie', movieSchema);

export default Movie;
