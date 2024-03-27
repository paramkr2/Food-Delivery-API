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

const exampleUser = {
	  username: 'john_doe',
	  email: 'john.doe@example.com',
	  password: 'secure_password',
	  phone: '123-456-7890',
	  location:{type:'Point',coordinates:[28.661057,77.211821]}
	};
let token = ""
const fs = require('fs'); // Import 'fs' for file system access
const path = require('path'); // Import 'path' for path manipulation

describe('Admin Routes', () => {
    let user, restaurant;

    beforeAll(async () => {
        user = await User.create({username: 'aman', password: 'password', email: 'amn@gmail.com', phone: 123, restaurantOwner: true});
        restaurant = await Restaurant.create({name: 'taj', phone: 123, ownerId: user._id});
		const mockPayload = { userId: user._id, restaurantOwner: true };
        jest.spyOn(jwt, 'verify').mockReturnValue(mockPayload);

    });
	let dishId ;
  
	it('should create dish with an image and form data', async () => {
		// ... (rest of your test)
		const res = await request(app)
			.post('/admin/create')
			.set({ Authorization: '123' })
			.field('name', 'someName')
			.field('restaurantId', restaurant._id.toString())
			.field('price', String(10))
			.field('description', 'Some Description')
			.attach('image',path.resolve(__dirname, '../../images/dish.jpg'));
		expect(res.status).toBe(201)
		expect(res.body).toHaveProperty('imagePath')

	});

	/*
	it('should update dish for a userId' , async () => {
		let dish = {dishId , name:'arhar'}
		const res = await request(app)
            .post('/admin/update')
            .set({Authorization: '123'})
            .send(dish)
			
			console.log(res.body);
			expect(res.status).toBe(200);
	})
	
	it('should fetch the list of restaurants', async () => {
		const res = await request(app)
			.get('/admin/list')
			.set({Authorization:'123'})
			
		expect(res.status).toBe(200);
	})
	
	it('shoudl delete item ', async ()=>{
		const res = await request(app)
			.delete('/admin/delete')
			.set({Authorization:'123'})
			.query({dishId})
			
		expect(res.status).toBe(200);
	})
	*/
	
	
});
/*
describe('Integration Test : Auth,Cart, restaurants ' ,  () => {
	let testDish1 ,testDish2 , testDish3;
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
	it('should return username error', async() =>{
		const res = await request(app)
			.post('/auth/login')
			.send({username:'rohitsharma',password:'pass'})
			
			expect(res.status).toBe(409);
	})
	
	it('Should add 1st item to cart',async() => {
		const mockData = await generateMockData();
		testDish1 = { itemId: mockData.dishes[0]._id, quantity: 1, forceAdd: 0 };
		testDish3 = { itemId: mockData.dishes[1]._id, quantity: 1, forceAdd: 0 };
		testDish2 = { itemId: mockData.dishes[2]._id, quantity: 1, forceAdd: 0 };
		const res = await request(app)
			.post('/cart/add')
			.set({Authorization:token})
			.send(testDish1)
			expect(res.status).toBe(201);
	});
	
	
	it('Should add end item from same to cart',async() => {
		const res = await request(app)
			.post('/cart/add')
			.set({Authorization:token})
			.send(testDish3)
			expect(res.status).toBe(201);
	});
	
	
	it('Should give error on diffrent resturant if not forceAdd', async () => {
		const res = await request(app)
			.post('/cart/add')
			.set({Authorization:token})
			.send(testDish2)
			expect(res.status).toBe(405);
	});
	it('Should add on diffrent resturant if forceAdd', async () => {
		testDish2.forceAdd = 1 
		const res = await request(app)
			.post('/cart/add')
			.set({Authorization:token})
			.send(testDish2)
			expect(res.status).toBe(201);
	});
	
	it('Should Fetch the added dishes', async () => {
		const res = await request(app)
			.get('/cart/fetch')
			.set({Authorization:token})
			
			expect(res.status).toBe(200);
			expect(Object.keys(res.body).length).toBe(1);
	});
	it('Should Update dish quantity',async() => {
		const res = await request(app)
			.put('/cart/update')
			.set({Authorization:token})
			.send({
				dishId:testDish2.itemId,
				quantity:10
			})
			
			expect(res.status).toBe(200)
	})
	it('Should Remove dish from cart' , async() => {
		const res = await request(app)
			.delete('/cart/remove')
			.set({Authorization:token})
			.query({dishId:testDish2.itemId.toString()})
			
			console.log( 'Remove Item', res.body)
			expect(res.status).toBe(200)
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
	
	it('Should not confirm when cart empty' , async () => {
		const res = await request(app)
			.post('/cart/confirmOrder')
			.set({Authorization:token})
		expect(res.status).toBe(404)
	})
	
		
});

*/