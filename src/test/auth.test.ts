import request from 'supertest';
import app from '../index'
import dbconnect from '../db/db'
import mongoose from 'mongoose'
import {generateMockData} from './load_dish_data';
import Restaurant from '../models/restaurant';
import User from '../models/user'
import jwt from 'jsonwebtoken'
const FormData = require('form-data');
import { Buffer } from 'buffer';
import fs from 'fs'
import path from 'path'


const clearDatabase = async () => {
  const collections = Object.keys(mongoose.connection.collections);
  
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName]; // Fix: Use square brackets
    await collection.deleteMany({});
  }
};

jest.mock('jsonwebtoken')

beforeAll(async () => {
  await dbconnect();
  await clearDatabase();
},10000);

afterAll( async () => {
	await mongoose.connection.close();
});



describe('Payment Routes', ()=> {

	let paymentId; // Define a variable to store the payment ID

	it('should create payment', async () => {
	  const res = await request(app)
		.post('/payment/create')
		.send({ amount: 1000, currency: 'usd', paymentMethod: 'pm_card_visa' });

	  expect(res.status).toBe(200);
	  expect(res.body).toHaveProperty('id');
	  paymentId = res.body.id; // Store the payment ID for later use
	});

	it('should confirm payment', async () => {
	  expect(paymentId).toBeDefined(); // Ensure paymentId is defined from the first request
	  const res = await request(app)
		.post('/payment/confirm')
		.send({ paymentIntentId:paymentId });

	  expect(res.status).toBe(200);
	  // Add additional assertions as needed to verify the confirmation result
	});



})



describe('Admin Routes', () => {
    let user, restaurant;

    beforeAll(async () => {
        user = await User.create({username: 'aman', password: 'password', email: 'amn@gmail.com', phone: 123, restaurantOwner: true});
        restaurant = await Restaurant.create({name: 'taj', phone: 123, ownerId: user._id});
		const mockPayload = { userId: user._id, restaurantOwner: true };
        jest.spyOn(jwt, 'verify').mockReturnValue(mockPayload);

    });
	let dish ;
  
	it('should create dish with an image and form data', async () => {
		
		const res = await request(app)
			.post('/admin/create')
			.set({ Authorization: '123' })
			.field('name', 'someName')
			.field('restaurantId', restaurant._id.toString())
			.field('price', String(10))
			.field('description', 'Some Description')
			.attach('image',path.resolve(__dirname, '../../images/dish.jpg'));
		
		console.log('Created Item',res.body);
		expect(res.status).toBe(201)
		expect(res.body).toHaveProperty('imagePath')
		dish = res.body;
	});
	
	it('should update dish with an image and form data', async () => {
		
		const res = await request(app)
			.post('/admin/update')
			.set({ Authorization: '123' })
			.field('dishId',dish._id.toString())
			.field('name', 'some other name ')
			.field('restaurantId', restaurant._id.toString())
			.field('price', String(10))
			.field('description', 'Some Description')
			.attach('image',path.resolve(__dirname, '../../images/burger.jpg'));
			
		console.log('Item after updating', res.body);
		expect(res.status).toBe(200)
		// To confirm image is updloaded we check if the path is diffrent
		console.log( `Comparing image paths ${res.body.imagePath}  ${dish.imagePath}`)
		expect( res.body.imagePath != dish.imagePath ).toBe(true)
		
		// this still doesnt check if the values are updated 
		
		dish = res.body ;
	});
	
	it('/admin/list should fetch the list of dishes in users restaurant', async () => {
		const res = await request(app)
			.get('/admin/list')
			.set({Authorization:'123'})
			
		expect(res.status).toBe(200);
	})
	
	it('Get /itemsRestaurants | Should fetch dishes of a restaurant', async () => {
			const res = await request(app)
				.get('/restaurant/items')
				.query({ restaurantId:restaurant._id.toString() }); // Assuming restaurants variable is defined outside the test

				expect(res.status).toBe(200);
				console.log('fetch dishes', res.body)
				expect(res.body.length).toEqual(1);;
		});
	
	it('should delete item and associated image', async () => {
		// Check if the image file exists before deletion
		const imagePath = dish.imagePath;
		const imageExistsBeforeDeletion = fs.existsSync(imagePath);
		expect(imageExistsBeforeDeletion).toBe(true);

		// Send delete request to delete the item
		const res = await request(app)
		  .delete('/admin/delete')
		  .set({ Authorization: '123' })
		  .query({ dishId:dish._id });

		// Check if the request was successful
		expect(res.status).toBe(200);

		// Check if the image file no longer exists after deletion
		const imageExistsAfterDeletion = fs.existsSync(imagePath);
		expect(imageExistsAfterDeletion).toBe(false);
	  });
	
		
});


describe('Integration Test : Auth,Cart, restaurants ' ,  () => {
	const exampleUser = {
	  username: 'john_doe',
	  email: 'john.doe@example.com',
	  password: 'secure_password',
	  phone: '1234567890',
	  location:{type:'Point',coordinates:[28.661057,77.211821]},
	  restaurantOwner:false
	};

	let token = ''
	
	beforeAll(async () => {
        jest.spyOn(jwt, 'sign').mockReturnValue('dummytoken');
    });
	
	it('should signup new user' , async () => {
		const res = await request(app)
			.post('/auth/signup')
			.send(exampleUser)
		console.log('Signup Response' , res.body);
		expect(res.status).toBe(201)
	});
	
	it('should login the existin user', async() =>{
	
		const res = await request(app)
			.post('/auth/login')
			.send(exampleUser)
			console.log('login response',res.body);
			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty('token');
			token = res.body.token ;
	});
	it('should return username erro for wrong creditionals ', async() =>{
		const res = await request(app)
			.post('/auth/login')
			.send({username:'rohitsharma',password:'pass'})
			
			expect(res.status).toBe(409);
	})
	let restaurants= []
	it('Should fetch nearby restaurants', async () => {
		let data = { location: { type: 'Point', coordinates: [28.653605, 77.211281] } };
		const res = await request(app)
			.get('/restaurant/nearby')
			.set({ Authorization: token })
			.query(data);

		expect(res.status).toBe(200);
		restaurants = res.body; // Assuming the response contains an array of restaurants
	});
		
});



describe('Address Routes', ()=> {
	
	let user, restaurant,userOwner;

    beforeAll(async () => {
        user = await User.create({username: 'aman1', password: 'password', email: 'amaaan@gmail.com', phone:12345678, restaurantOwner:true,restaurantName:'Haras' });
        userOwner = await User.create({username: 'ownerName', password: 'password', email: 'amnn@gmail.com', phone: 12345678, restaurantOwner: true});
		restaurant = await Restaurant.create({name: 'taj', phone: 123, ownerId: userOwner._id});
    });
	
	it( 'should create Address for user ',async () => {
		const mockPayload = { userId: user._id, restaurantOwner: false };
        jest.spyOn(jwt, 'verify').mockReturnValue(mockPayload);
		const data = {
		  "city": "New York",
		  "state_district": "Manhattan",
		  "state": "New York",
		  "postcode": "10001",
		  "neighbourhood": "Chelsea",
		  "location": {
			"type": "Point",
			"coordinates": [40.7128, -74.0060]
		  }
		}
		const res = await request(app)
			.post('/user/address')
			.set({ Authorization: '123' })
			.send(data)
		
		expect(res.status).toBe(200)
		expect(res.body).toHaveProperty('location')
	})

	
	it( 'should create Address for restaurant ',async () => {
		console.log('started creating restaurant')
		const mockPayload = { userId: userOwner._id, restaurantOwner: true  };
        jest.spyOn(jwt, 'verify').mockReturnValue(mockPayload);
		const data = {
		  "city": "New York",
		  "state_district": "Manhattan",
		  "state": "New York",
		  "postcode": "10001",
		  "neighbourhood": "Chelsea",
		  "location": {
			"type": "Point",
			"coordinates": [40.7128, -74.0060]
		  }
		}
		const res = await request(app)
			.post('/restaurant/address')
			.set({ Authorization: 'mockToken' })
			.send(data)
		console.log('updated restaurant address in test', res.body)
		expect(res.status).toBe(200)
		expect(res.body).toHaveProperty('location')
	})
	
	it('should fetch address for user ', async () => {
		const mockPayload = { userId: String(user._id), restaurantOwner: false  };
        jest.spyOn(jwt, 'verify').mockReturnValue(mockPayload);
		const res = await request(app)
			.get('/user/address')
			.set({Authorization:'mockToken'})
			
		expect(res.status).toBe(200)
		expect(res.body).toHaveProperty('location')
	})
	
	it('should fetch address for restaurant', async() => {
		// any user should be able to fetch address 
		const mockPayload = { userId: user._id, restaurantOwner: false  };
        jest.spyOn(jwt, 'verify').mockReturnValue(mockPayload);
		const res = await request(app)
			.get(`/restaurant/address/${String(restaurant._id)}`)
			.set({Authorization:'mockToken'})
		
		console.log(res.body)
		expect(res.status).toBe(200)
		expect(res.body).toHaveProperty('location');
		
	})

})
