import {Schema,model,Document,Types} from 'mongoose'

const addressSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true },
    city: String,
    state_district: String,
    state: { type: String, required: true },
    postcode: { type: String, required: true },
    neighbourhood: String,
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], default: [0, 0] }
    }
});

addressSchema.index({ location: '2dsphere' });

const Address = model('Address', addressSchema);

export default Address;
