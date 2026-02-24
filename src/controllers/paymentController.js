import Stripe from 'stripe';
import { env } from '../config/env.js';

const stripe = env.stripeSecretKey ? new Stripe(env.stripeSecretKey) : null;

const toCents = (amount) => Math.round(Number(amount) * 100);

const assertStripeConfigured = () => {
  if (!stripe) {
    const err = new Error('Stripe is not configured. Set STRIPE_SECRET_KEY.');
    err.status = 500;
    throw err;
  }
};

export const createPaymentIntent = async (req, res) => {
  assertStripeConfigured();

  const { totalAmount, listingId = '', packageId = '', eventDate = '', hours = '' } = req.body;
  const amount = toCents(totalAmount);

  if (!amount || amount < 50) {
    return res.status(400).json({ message: 'Invalid amount. Minimum is $0.50.' });
  }

  const clientId = req.user?._id ? req.user._id.toString() : '';

  const intent = await stripe.paymentIntents.create({
    amount,
    currency: 'usd',
    automatic_payment_methods: { enabled: true },
    metadata: {
      clientId,
      listingId: String(listingId),
      packageId: String(packageId),
      eventDate: String(eventDate),
      hours: String(hours)
    }
  });

  return res.status(201).json({
    clientSecret: intent.client_secret,
    paymentIntentId: intent.id
  });
};

export const getPaymentIntentStatus = async (req, res) => {
  assertStripeConfigured();

  const intent = await stripe.paymentIntents.retrieve(req.params.paymentIntentId);
  if (intent.metadata?.clientId && intent.metadata.clientId !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  return res.json({
    paymentIntent: {
      id: intent.id,
      status: intent.status,
      amount: intent.amount,
      currency: intent.currency
    }
  });
};

export const verifySucceededPaymentIntent = async ({ paymentId, expectedTotalAmount, clientId }) => {
  assertStripeConfigured();

  const intent = await stripe.paymentIntents.retrieve(paymentId);

  if (intent.status !== 'succeeded') {
    const err = new Error('Payment has not completed successfully');
    err.status = 400;
    throw err;
  }

  if (intent.metadata?.clientId && intent.metadata.clientId !== clientId.toString()) {
    const err = new Error('Payment does not belong to this user');
    err.status = 403;
    throw err;
  }

  const expectedAmount = toCents(expectedTotalAmount);
  const receivedAmount = intent.amount_received || intent.amount;
  if (receivedAmount !== expectedAmount) {
    const err = new Error('Payment amount does not match booking amount');
    err.status = 400;
    throw err;
  }

  return intent;
};
