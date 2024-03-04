import {Schema,model} from 'mongoose'

const restaurantSchema = Schema({
	name:{type:String,required:true},
	phone:{type:Number,required:true},
	address:{type:Number}],
})

const Restaurant = model('Restaurant',restaurantSchema);
export default Restaurant;