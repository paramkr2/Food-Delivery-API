const stripe = require('stripe')('sk_test_51OySTLSAWAYegyhd1FFAytfMKKXPdLh4cU8weexmzxfShqOMgw78inwXBiFRfKZVuIHAaFKy5HOX5FY3eZg8j8ej00k9Itl4ZL');


export const createCharge = async  (amount, currency, source) => {
  try {
    const charge = await stripe.charges.create({
      amount,
      currency,
      source,
      description: 'Payment Description',
    });
    return charge;
  } catch (error) {
    console.error('Error creating charge:', error);
    throw error;
  }
}

const YOUR_WEBHOOK_SECRET = 'your_webhook_secret'; // Get this from your Stripe dashboard

function handleWebhookEvent(req) {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, YOUR_WEBHOOK_SECRET);
  } catch (error) {
    console.error('Webhook error:', error.message);
    throw error;
  }
	let paymentIntent ;
  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      paymentIntent = event.data.object;
      // Handle successful payment intent
      break;
    case 'payment_intent.payment_failed':
      paymentIntent = event.data.object;
      // Handle failed payment intent
      break;
    // Handle other event types as needed
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
}

async function confirmPaymentIntent(paymentIntentId) {
  try {
    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);
    return paymentIntent;
  } catch (error) {
    console.error('Error confirming payment intent:', error);
    throw error;
  }
}
