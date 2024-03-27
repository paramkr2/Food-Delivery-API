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
			.attach('image',path.resolve(__dirname, '../../images/dish.jpg'));
			
		console.log('Item after updating', res.body);
		expect(res.status).toBe(200)
		expect(res.body).toHaveProperty('imagePath')
		dish = res.body ;
	});
	

	
	
	it('should fetch the list of dishes in users restaurant', async () => {
		const res = await request(app)
			.get('/admin/list')
			.set({Authorization:'123'})
			
		expect(res.status).toBe(200);
	})
	
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
	
	
	it('Should Fetch the added dishes', async () => {
		const res = await request(app)
			.get('/cart/fetch')
			.set({Authorization:token})
			
			expect(res.status).toBe(200);
			expect(Object.keys(res.body).length).toBe(1);
	});
	
	
	let restaurants= []
	it('Should fetch nearby restaurants', async () => {
		let data = { location: { type: 'Point', coordinates: [28.653605, 77.211281] } };
		const res = await request(app)
			.get('/nearbyRestaurants')
			.set({ Authorization: token })
			.query(data);

		expect(res.status).toBe(200);
		restaurants = res.body; // Assuming the response contains an array of restaurants
	});

	it('Should fetch dishes of a restaurant', async () => {
		const res = await request(app)
			.get('/itemsRestaurants')
			.query({ restaurantId: restaurants[0]._id }); // Assuming restaurants variable is defined outside the test

			expect(res.status).toBe(200);
			console.log('fetch dishes', res.body)
			expect(res.body.length).toBeGreaterThan(1);;
	});

	
	it('Should confirm order and Delete Cart ' , async() => {
		const res = await request(app)
			.post('/cart/confirmOrder')
			.set({Authorization:token})
		expect(res.status).toBe(200)
	})
	
		
});

