const request = require('supertest');
const express = require('express');
const cors = require('cors');

// Create a new Express application instance for testing
const app = express();

// Add middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add the health endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

describe('API Endpoints', () => {
  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual({
        status: 'OK',
        message: 'Server is running'
      });
    });

    it('should handle CORS headers', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect('Access-Control-Allow-Origin', '*');
    });
  });
});