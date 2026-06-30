import apiRequest from './api';

// Chat API calls
export const chatAPI = {
  // Send a message to the chatbot
  sendMessage: async (message) => {
    return apiRequest('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ prompt: message }),
    });
  },
};

export default chatAPI;
