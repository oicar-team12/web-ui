export const config = {
  mockMode: false, // Set to false to use real backend
  apiBaseUrl: process.env.REACT_APP_API_URL || 'http://localhost:8080', // Your backend URL
  mockDelay: 500, // Simulate network delay for mock mode (ms)
};

// Helper function to determine if we should use mock data
export const shouldUseMock = () => {
  return config.mockMode;
};

// Helper function to simulate API delay in mock mode
export const simulateApiDelay = async () => {
  if (config.mockMode) {
    await new Promise(resolve => setTimeout(resolve, config.mockDelay));
  }
}; 