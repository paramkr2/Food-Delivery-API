import {Schema,model} from 'mongoose'


const addressSchema = Schema({
	userid:{type:Schema.Types.ObjectId,required:true},
	state:{type:String},
	city:{type:String},
	street:{type:String},
})

const Address = model('Address',addressSchema);
export default Address;