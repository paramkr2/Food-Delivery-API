import {Schema,model,Document,Types} from 'mongoose'

const addressSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true },
    city: {type:String},
    state_district: {type:String},
    state: { type: String, required: true },
    postcode: { type: String, required: true },
    neighbourhood: {type:String},
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], default: [0, 0],required:true }
    }
});


addressSchema.index({ location: '2dsphere' });

const Address = model('Address', addressSchema);

export default Address;
