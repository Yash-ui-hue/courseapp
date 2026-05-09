const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

// ─── STEP 1: Simulate sending OTP ────────────────────────
router.post('/send-otp', authMiddleware, async (req, res) => {
  const { aadhaar_number } = req.body;

  if (!aadhaar_number || aadhaar_number.length !== 12) {
    return res.status(400).json({ message: 'Valid 12-digit Aadhaar number required' });
  }

  // Generate a fake reference_id like real API would
  const mockReferenceId = Math.floor(1000000 + Math.random() * 9000000);

  console.log(`Mock OTP sent for Aadhaar: ${aadhaar_number}, ref: ${mockReferenceId}`);

  res.json({
    message: 'OTP sent to your Aadhaar-registered mobile number',
    reference_id: mockReferenceId
  });
});

// ─── STEP 2: Simulate verifying OTP ──────────────────────
router.post('/verify-otp', authMiddleware, async (req, res) => {
  const { otp, reference_id } = req.body;
  const userId = req.user.userId;

  if (!otp || !reference_id) {
    return res.status(400).json({ message: 'OTP and reference_id are required' });
  }

  if (otp.length < 4) {
    return res.status(400).json({ message: 'Enter a valid OTP' });
  }

  try {
    const last4 = Math.floor(1000 + Math.random() * 9000);
    const maskedAadhaar = `XXXX-XXXX-${last4}`;

    await pool.query(
      `UPDATE users
       SET kyc_status = 'verified',
           aadhaar_masked = $1,
           kyc_verified_at = NOW()
       WHERE id = $2`,
      [maskedAadhaar, userId]
    );

    console.log(`Mock KYC verified for userId: ${userId}`);

    res.json({
      message: 'Aadhaar verified successfully',
      masked_aadhaar: maskedAadhaar
    });

  } catch (err) {
    console.error('DB error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;