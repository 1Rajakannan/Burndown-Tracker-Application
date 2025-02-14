/**
 * Custom error class for API-related errors
 */
export class APIError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Handles API response errors and throws appropriate APIError
 * @param {Response} response - Fetch API Response object
 * @throws {APIError}
 */
export async function handleAPIError(response) {
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      errorData = null;
    }

    throw new APIError(
      errorData?.message || response.statusText || 'API request failed',
      response.status,
      errorData
    );
  }
  return response;
}

/**
 * Formats error messages for display
 * @param {Error} error - Error object
 * @returns {string} Formatted error message
 */
export function formatErrorMessage(error) {
  if (error instanceof APIError) {
    return `Error ${error.status}: ${error.message}`;
  }
  return error.message || 'An unexpected error occurred';
}

/**
 * Creates a fetch request with error handling
 * @param {string} url - API endpoint URL
 * @param {Object} options - Fetch options
 * @returns {Promise} Response data
 */
export async function fetchWithErrorHandling(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    await handleAPIError(response);
    return await response.json();
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError('Network error', 0, error);
  }
}