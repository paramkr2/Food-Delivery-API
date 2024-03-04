import mongoose from 'mongoose';
import Dish from '../models/dish';
import Restaurant from '../models/restaurant';

// Function to generate mock data
export const generateMockData = async () => {
  try {
    // Hardcoded restaurant and dish data
    const restaurantsData = [
      { name: 'Restaurant 1', phone: 1234567890, address: 'Address 1' },
      { name: 'Restaurant 2', phone: 9876543210, address: 'Address 2' },
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

    return { dishes: createdDishes };
  } catch (error) {
    console.error('Error generating mock data:', error);
    return { dishes: [] }; // Return an empty array or handle it as needed
  }
};

