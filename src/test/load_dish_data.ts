import mongoose from 'mongoose';
import Dish from '../models/dish';
import Restaurant from '../models/restaurant';
import Driver from '../models/driver'
// Function to generate mock data
export const generateMockData = async () => {
  try {
    // Hardcoded restaurant and dish data
    const restaurantsData = [
	  { name: 'Restaurant 1', phone: 1234567890, location: { type: 'Point', coordinates: [28.653605, 77.211281] } },
	  { name: 'Restaurant 2', phone: 9876543210, location: { type: 'Point', coordinates: [28.656859, 77.218699] } },
	];
    const createdRestaurants = await Restaurant.create(restaurantsData);


    const dishesData = [
      { name: 'Dish 1', price: 10, restaurantId: createdRestaurants[0]._id },
      { name: 'Dish 2', price: 15, restaurantId: createdRestaurants[0]._id },
      { name: 'Dish 3', price: 8, restaurantId: createdRestaurants[1]._id },
      { name: 'Dish 4', price: 12, restaurantId: createdRestaurants[1]._id },
    ];

    const createdDishes = await Dish.create(dishesData);

    if (!createdDishes) {
      console.error('Error creating dishes:', createdDishes);
      return { dishes: [] }; // Return an empty array or handle it as needed
    }

	const driversData = [
	  {
		name: 'Driver 1',
		availability: true,
		location: { type: 'Point', coordinates: [28.657043 ,77.221830] }, // Near Restaurant 1
	  },
	  {
		name: 'Driver 2',
		availability: true,
		location: { type: 'Point', coordinates: [28.656859, 77.218699] }, // Near Restaurant 2
	  },
	  {
		name: 'Driver 3',
		availability: true,
		location: { type: 'Point', coordinates: [28.652, 77.215] }, // Near Restaurant 1
	  },
	];

	// Insert data into the collection
	const createdDrivers = await Driver.create(driversData)
    return { dishes: createdDishes };
  } catch (error) {
    console.error('Error generating mock data:', error);
    return { dishes: [] }; // Return an empty array or handle it as needed
  }
};

