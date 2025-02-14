import { APIError, handleAPIError, formatErrorMessage, fetchWithErrorHandling } from '../services/apiErrors';

describe('APIError', () => {
  test('creates APIError instance with all properties', () => {
    const message = 'Test error';
    const status = 404;
    const data = { detail: 'Not found' };
    const error = new APIError(message, status, data);

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(APIError);
    expect(error.name).toBe('APIError');
    expect(error.message).toBe(message);
    expect(error.status).toBe(status);
    expect(error.data).toBe(data);
  });

  test('creates APIError instance with default null data', () => {
    const error = new APIError('Test error', 500);
    expect(error.data).toBeNull();
  });
});

describe('handleAPIError', () => {
  test('passes through successful response', async () => {
    const mockResponse = {
      ok: true,
      status: 200,
    };

    const result = await handleAPIError(mockResponse);
    expect(result).toBe(mockResponse);
  });

  test('throws APIError for unsuccessful response with JSON error data', async () => {
    const errorData = { message: 'Invalid input' };
    const mockResponse = {
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      json: jest.fn().mockResolvedValue(errorData),
    };

    await expect(handleAPIError(mockResponse)).rejects.toThrow(APIError);
    await expect(handleAPIError(mockResponse)).rejects.toMatchObject({
      message: errorData.message,
      status: 400,
      data: errorData,
    });
  });

  test('throws APIError with statusText when JSON parsing fails', async () => {
    const mockResponse = {
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: jest.fn().mockRejectedValue(new Error('Invalid JSON')),
    };

    await expect(handleAPIError(mockResponse)).rejects.toThrow(APIError);
    await expect(handleAPIError(mockResponse)).rejects.toMatchObject({
      message: 'Internal Server Error',
      status: 500,
      data: null,
    });
  });

  test('throws APIError with default message when no error details available', async () => {
    const mockResponse = {
      ok: false,
      status: 503,
      statusText: '',
      json: jest.fn().mockRejectedValue(new Error('Invalid JSON')),
    };

    await expect(handleAPIError(mockResponse)).rejects.toThrow(APIError);
    await expect(handleAPIError(mockResponse)).rejects.toMatchObject({
      message: 'API request failed',
      status: 503,
      data: null,
    });
  });
});

describe('formatErrorMessage', () => {
  test('formats APIError with status and message', () => {
    const error = new APIError('Not found', 404);
    expect(formatErrorMessage(error)).toBe('Error 404: Not found');
  });

  test('returns message for non-APIError', () => {
    const error = new Error('Generic error');
    expect(formatErrorMessage(error)).toBe('Generic error');
  });

  test('returns default message for error without message', () => {
    const error = new Error();
    expect(formatErrorMessage(error)).toBe('An unexpected error occurred');
  });
});

describe('fetchWithErrorHandling', () => {
  const mockUrl = 'https://api.example.com/data';

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('successfully fetches and parses JSON response', async () => {
    const mockData = { id: 1, name: 'Test' };
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue(mockData),
    };
    global.fetch.mockResolvedValue(mockResponse);

    const result = await fetchWithErrorHandling(mockUrl);
    expect(result).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledWith(mockUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });

  test('merges custom headers with default headers', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({}),
    };
    global.fetch.mockResolvedValue(mockResponse);

    await fetchWithErrorHandling(mockUrl, {
      headers: {
        'Authorization': 'Bearer token',
      },
    });

    expect(global.fetch).toHaveBeenCalledWith(mockUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer token',
      },
    });
  });

  test('throws APIError for failed API response', async () => {
    const errorData = { message: 'Invalid request' };
    const mockResponse = {
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      json: jest.fn().mockResolvedValue(errorData),
    };
    global.fetch.mockResolvedValue(mockResponse);

    await expect(fetchWithErrorHandling(mockUrl)).rejects.toThrow(APIError);
    await expect(fetchWithErrorHandling(mockUrl)).rejects.toMatchObject({
      message: errorData.message,
      status: 400,
      data: errorData,
    });
  });

  test('throws APIError for network errors', async () => {
    const networkError = new Error('Network failure');
    global.fetch.mockRejectedValue(networkError);

    await expect(fetchWithErrorHandling(mockUrl)).rejects.toThrow(APIError);
    await expect(fetchWithErrorHandling(mockUrl)).rejects.toMatchObject({
      message: 'Network error',
      status: 0,
      data: networkError,
    });
  });
});