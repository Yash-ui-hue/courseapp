const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ─── CREATE ORDER ─────────────────────────────────────────
router.post('/create-order', authMiddleware, async (req, res) => {
  const { amount, currency = 'INR' } = req.body;
  const userId = req.user.userId;

  if (!amount) {
    return res.status(400).json({ message: 'Amount is required' });
  }

  try {
    // amount must be in paise (1 INR = 100 paise)
    const order = await razorpay.orders.create({
      amount:   amount * 100,
      currency,
      receipt:  `receipt_${Date.now()}`,
    });

    // Save order to DB with status pending
    await pool.query(
      `INSERT INTO orders (user_id, razorpay_order_id, amount, status)
       VALUES ($1, $2, $3, 'pending')`,
      [userId, order.id, amount]
    );

    console.log('Order created:', order.id);

    res.json({
      order_id:  order.id,
      amount:    order.amount,
      currency:  order.currency,
      key_id:    process.env.RAZORPAY_KEY_ID,
    });

  } 
     catch (err) {
  console.error('Order creation error full:', err);
  console.error('Error description:', err.error);
  res.status(500).json({ message: 'Failed to create order' });
        }
//   catch (err) {
//     console.error('Order creation error:', err.message);
//     res.status(500).json({ message: 'Failed to create order' });
//   }
});

// ─── VERIFY PAYMENT ───────────────────────────────────────
router.post('/verify', authMiddleware, async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ message: 'Missing payment details' });
  }

  try {
    // HMAC-SHA256 signature verification — critical fraud prevention step
    const body      = razorpay_order_id + '|' + razorpay_payment_id;
    const expected  = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expected !== razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification failed — invalid signature' });
    }

    // Signature matched — mark order as paid in DB
    await pool.query(
      `UPDATE orders SET status = 'paid'
       WHERE razorpay_order_id = $1`,
      [razorpay_order_id]
    );

    console.log('Payment verified:', razorpay_payment_id);

    res.json({ message: 'Payment successful', payment_id: razorpay_payment_id });

  } catch (err) {
    console.error('Verification error:', err.message);
    res.status(500).json({ message: 'Server error during verification' });
  }
});

// ─── WEBHOOK (async confirmation) ─────────────────────────
router.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const signature = req.headers['x-razorpay-signature'];

  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(req.body)
    .digest('hex');

  if (expected !== signature) {
    return res.status(400).json({ message: 'Invalid webhook signature' });
  }

  const event = JSON.parse(req.body);
  console.log('Webhook event:', event.event);

  res.json({ received: true });
});

module.exports = router;