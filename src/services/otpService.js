// Simple in-memory OTP store.
// In production you would replace this with a persistent store and real SMS provider.

const crypto = require('crypto');

const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes

// Map<phoneNumber, { code: string, expiresAt: number }>
const otpStore = new Map();

function generateOtp() {
  // 6-digit numeric OTP
  return ('' + Math.floor(100000 + Math.random() * 900000));
}

function setOtp(phoneNumber) {
  const code = generateOtp();
  const expiresAt = Date.now() + OTP_TTL_MS;

  otpStore.set(phoneNumber, { code, expiresAt });

  // Simulate sending via SMS provider
  console.log(`OTP for ${phoneNumber}: ${code}`);

  return code;
}

function verifyOtp(phoneNumber, code) {
  const record = otpStore.get(phoneNumber);
  if (!record) return false;

  const { code: storedCode, expiresAt } = record;
  const now = Date.now();

  if (now > expiresAt) {
    otpStore.delete(phoneNumber);
    return false;
  }

  if (storedCode !== code) {
    return false;
  }

  // OTP can be used only once
  otpStore.delete(phoneNumber);
  return true;
}

module.exports = {
  setOtp,
  verifyOtp
};

