import request from 'supertest';
import app from '../../server.js'; // Ensure this imports Express app
import mongoose from 'mongoose';
import User from '../../models/User.js';
import { upsertStreanUser } from '../../lib/stream.js';

jest.mock('../../lib/stream.js', () => ({
  upsertStreanUser: jest.fn(() => Promise.resolve()),
}));

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Auth Controller Tests', () => {
  afterEach(async () => {
    await User.deleteMany({});
  });

  // Your test cases here
});
