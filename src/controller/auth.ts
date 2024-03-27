import User from '../models/user' ;
import Restaurant from '../models/restaurant'
import jwt from 'jsonwebtoken' ;
import bcrypt from 'bcrypt' 
const secretkey = process.env.secretkey;
export const login = async (req,res) => {
	try{
		const {username,password} = req.body ;
		// check if  username is unique..
		const user = await User.findOne({username:username});
		if(  !user ){
			return res.status(409).json({
				error:'Incorrect Username'
				})
		}
		// compare password 
		
		// the order here did matter.. 
		const result = await bcrypt.compare(password,user.password);
		if( !result){
				return res.status(401).json({'error':'Password doesnt match'})
		}
		
		const token = jwt.sign({userId:user._id, username:username, restaurantOwner:user.restaurantOwner },
			secretkey,
			{expiresIn:'1h'}
		);
		
		return res.status(200).json({'token':token,msg:'Login Successfull'})
	}catch{
		return res.status(500).json({'error':'Internal server error'});
	}
};


export const signup = async (req,res) => {
	try{
		const {username,password,email,phone,location,restaurantOwner,restaurantName} = req.body;
		
		const existingUser = await User.findOne({username});
		if( existingUser != null ){
			console.log('Existing User ')
			return res.status(409).json({"error":'Username already exists'})
		}
		const hashedPassword = await bcrypt.hash(password, 10);
		const user = await User.create({username,password:hashedPassword,email,phone,restaurantOwner}) // dont know about address 
		
		let jwtPayload = {userId:user._id, username:username, restaurantOwner:user.restaurantOwner,restaurantId:null  }
		if(restaurantOwner){
			const restaurant = await Restaurant.create({ownerId:user._id,name:restaurantName,phone,location})
			jwtPayload = {...jwtPayload,restaurantId:restaurant._id}
		}
		
		const token = jwt.sign(jwtPayload,
			secretkey,
			{expiresIn:'1h'}
		);
		res.status(201).json({'token':token,"msg":"User Registered"})
	}catch(error){
		console.log('Signup Error', error );
		res.status(500).json({"error":`Internal Server Error ${error}`})
	}
}
	
