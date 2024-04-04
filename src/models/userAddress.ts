import { Schema, model } from 'mongoose';

const userAddressSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true },
    city: { type: String },
    state_district: { type: String },
    state: { type: String, required: true },
    postcode: { type: String, required: true },
    neighbourhood: { type: String },
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], default: [0, 0], required: true },
    }
});

userAddressSchema.index({ location: '2dsphere' });

// Corrected model name to be consistent with schema
const UserAddress = model('UserAddress', userAddressSchema);

export default UserAddress;
