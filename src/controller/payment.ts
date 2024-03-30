import Stripe from 'stripe';
import Order from '../models/order'; // Import the Order model

const stripe = new Stripe('sk_test_51OySTLSAWAYegyhd1FFAytfMKKXPdLh4cU8weexmzxfShqOMgw78inwXBiFRfKZVuIHAaFKy5HOX5FY3eZg8j8ej00k9Itl4ZL');
const YOUR_WEBHOOK_SECRET = 'whsec_257Mhte2xmnDKaZHVldzt7B1y7x4G3lT'; // Get this from your Stripe dashboard

const createPaymentIntent = async (amount, currency, paymentMethod, description, shipping) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
     description: 'Food Ordering Services',// Include description as metadata 
    }); 
    return paymentIntent;
  } catch (error) {
    console.error('Error creating Payment Intent:', error);
    throw error;
  }
};

export const create = async (req, res) => {
  const {amount, currency, paymentMethod,description , shipping } = req.body; // Assuming the request body contains amount, currency, and source
	
  try {
  let params: Stripe.PaymentIntentCreateParams;
	console.log('something')
	//console.log( 'trying to print stripe params',Stripe.PaymentIntentCreateParams);
    const charge = await createPaymentIntent(amount, currency, paymentMethod,description,shipping );
	console.log( ' In /charge',charge);
    res.status(200).json( charge );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const confirmPaymentIntent = async (paymentIntentId) => {
  try {
    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);
    return paymentIntent;
  } catch (error) {
    console.error('Error confirming Payment Intent:', error);
    throw error;
  }
};

export const confirm = async (req, res) => {
  const {paymentIntentId } = req.body; // Assuming the request body contains amount, currency, and source
  try {
    const confirm = await confirmPaymentIntent(String(paymentIntentId))
	console.log( ' In /confirm',confirm);
    res.status(200).json( confirm );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const handleWebhookEvent = async (req) => {
	console.log('webhook',req.body)
  const sig = req.headers['stripe-signature'];
  try {
    // Construct the event from the request body and verify the signature
    const event = stripe.webhooks.constructEvent(req.body, sig, YOUR_WEBHOOK_SECRET);
    let paymentIntentId;
    switch (event.type) {
      case 'charge.failed':
        console.log('Charge failed:', event);
        // Extract payment intent ID from the event data
       paymentIntentId = event.data.object.payment_intent;
        
        // Fetch the corresponding order based on payment intent ID
        const order = await Order.findOne({ paymentIntentId });
        
        if (!order) {
          console.log('Order not found for paymentIntentId:', paymentIntentId);
          return;
        }
        order.paymentStatus = 'Failed';
        await order.save();
        
        console.log('Order payment status updated to Failed:', order);
        break;
        
      case 'charge.succeeded':
        console.log('Charge succeeded:');
        paymentIntentId = event.data.object.payment_intent
        const completedOrder = await Order.findOne({ paymentIntentId });
        if (!completedOrder) {
          console.log('Order not found for paymentIntentId:', paymentIntentId);
          return;
        }
        completedOrder.paymentStatus = 'Completed';
        await completedOrder.save();
        
        console.log('Order payment status updated to Completed:', completedOrder);
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error('Webhook error:', error.message);
    throw error;
  }
};

