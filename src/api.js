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
  try {
    const response = await api.post('/generate', 
      { 
        link, 
        username 
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        responseType: 'blob', // Указываем, что ожидаем получить изображение как Blob
      }
    );

    // Логирование для отладки
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    if (response.status !== 200) {
      throw new Error('Failed to generate QR code');
    }

    // Извлекаем дополнительные заголовки, если нужно
    const qrCodeId = response.headers['qr-code-id'];
    const qrCodeUrl = response.headers['qr-code-url'];
    console.log('QR Code ID:', qrCodeId);
    console.log('QR Code URL:', qrCodeUrl);

    // Возвращаем изображение (Blob)
    return response.data;  // response.data будет Blob
  } catch (err) {
    console.error('Error during QR generation:', err);
    throw new Error('Error generating QR code');
  }
};





export const getUserStats = async (token) => {
  const response = await api.get('/user_stats/', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
