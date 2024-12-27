import axios from 'axios';

const api = axios.create({
  baseURL: 'https://qr-generator-dk9l.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const loginUser = async (username, password) => {
  const response = await api.post('/login/', { username, password });
  return response.data;
};

export const registerUser = async (username, password, role) => {
  const response = await api.post('/register/', { username, password, role });
  return response.data;
};

export const generateQRCode = async (link, username, token) => {
  const response = await api.post('/generate/', { link, username }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getUserStats = async (token) => {
  const response = await api.get('/user_stats/', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
