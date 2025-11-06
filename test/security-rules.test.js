const { initializeTestEnvironment, getTestEnv } = require('@firebase/rules-unit-testing');
const { readFileSync } = require('fs');
const path = require('path');

// Import Jest's expect
const { expect } = require('@jest/globals');

// Increase timeout for tests
jest.setTimeout(30000);

describe('Firestore Security Rules', () => {
  let testEnv;
  
  beforeAll(async () => {
    // Initialize the test environment with our Firestore rules
    testEnv = await initializeTestEnvironment({
      projectId: 'hyper-coding-app',
      firestore: {
        rules: readFileSync('firestore.rules', 'utf8'),
        host: 'localhost',
        port: 5001,
      },
    });
  });

  afterAll(async () => {
    // Clean up the test environment
    if (testEnv) {
      await testEnv.cleanup();
    }
  });

  afterEach(async () => {
    // Clear Firestore between tests
    if (testEnv) {
      await testEnv.clearFirestore();
    }
  });

  test('unauthenticated users cannot read snippets', async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    await expect(db.collection('snippets').get()).toDeny();
  });

  test('users can only read their own snippets', async () => {
    // Setup test users
    const alice = testEnv.authenticatedContext('alice', {
      email: 'alice@example.com'
    });
    
    const bob = testEnv.authenticatedContext('bob', {
      email: 'bob@example.com'
    });

    // Alice creates a snippet
    await alice.firestore().collection('snippets').add({
      title: 'Alice\'s Private Snippet',
      ownerId: 'alice',
      visibility: 'private',
      code: 'console.log("private")'
    });

    // Bob tries to read Alice's snippet (should fail)
    await expect(
      bob.firestore().collection('snippets').where('ownerId', '==', 'alice').get()
    ).toDeny();
  });

  test('users can read public snippets', async () => {
    const alice = testEnv.authenticatedContext('alice');
    const bob = testEnv.authenticatedContext('bob');

    // Alice creates a public snippet
    await alice.firestore().collection('snippets').add({
      title: 'Public Snippet',
      ownerId: 'alice',
      visibility: 'public',
      code: 'console.log("public")'
    });

    // Bob should be able to read public snippets
    await expect(
      bob.firestore().collection('snippets')
        .where('visibility', '==', 'public')
        .get()
    ).toAllow();
  });
});
