import { Document, Schema, model } from 'mongoose';

interface IDriver extends Document {
  name: string;
  availability: boolean;
  location: {
    type: string;
    coordinates: [number, number];
  };
}

const driverSchema = new Schema<IDriver>({
  name: { type: String, required: true },
  availability: { type: Boolean, required: true }, // This line seems to be causing the error
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
  },
});

driverSchema.pre('save', function (next) {
  // Check if location is empty
  if (!this.location || !this.location.type || !this.location.coordinates) {
    const error = new Error('Location is required.');
    return next(error);
  }
  next();
});

const driver = model<IDriver>('Driver',driverSchema);
export default driver ;