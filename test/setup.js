// Setup file for Jest tests
// This file runs before each test file

// Set up any global test environment settings here
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:5001';
process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';

// Add any other global test setup code here
