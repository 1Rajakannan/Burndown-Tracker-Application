const request = require('supertest');
const express = require('express');
const validateSprintData = require('../middleware/sprintValidation');

const app = express();
app.use(express.json());
app.use(validateSprintData);

// Mock sprint endpoint
app.post('/api/sprint', (req, res) => {
  res.status(201).json({
    success: true,
    message: 'Sprint data submitted successfully',
    data: req.body
  });
});

describe('POST /api/sprint', () => {
  const validSprintData = {
    totalPoints: 100,
    sprintDuration: 10,
    dailyProgress: [20, 15, 10, 5]
  };

  test('should accept valid sprint data', async () => {
    const response = await request(app)
      .post('/api/sprint')
      .send(validSprintData);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual(validSprintData);
  });

  test('should reject missing required fields', async () => {
    const invalidData = {
      totalPoints: 100
      // missing sprintDuration
    };

    const response = await request(app)
      .post('/api/sprint')
      .send(invalidData);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  test('should reject invalid total points', async () => {
    const invalidData = {
      ...validSprintData,
      totalPoints: -10
    };

    const response = await request(app)
      .post('/api/sprint')
      .send(invalidData);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  test('should reject invalid sprint duration', async () => {
    const invalidData = {
      ...validSprintData,
      sprintDuration: 0
    };

    const response = await request(app)
      .post('/api/sprint')
      .send(invalidData);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  test('should reject invalid daily progress', async () => {
    const invalidData = {
      ...validSprintData,
      dailyProgress: [-5, 10, 15]
    };

    const response = await request(app)
      .post('/api/sprint')
      .send(invalidData);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  test('should reject daily progress exceeding sprint duration', async () => {
    const invalidData = {
      ...validSprintData,
      sprintDuration: 3,
      dailyProgress: [10, 15, 20, 25]
    };

    const response = await request(app)
      .post('/api/sprint')
      .send(invalidData);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});