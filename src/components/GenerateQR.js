import React, { useState, useEffect } from 'react';
import { generateQRCode } from '../api';
import { jwtDecode } from "jwt-decode";

const GenerateQR = () => {
  const [link, setLink] = useState('');
  const [qrCodeImage, setQrCodeImage] = useState(null);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  const handleGenerate = async (e) => {
    e.preventDefault();
    setQrCodeImage(null); // Reset QR code before generating a new on
    setError(''); // Reset any previous error
  
    try {
      let username = 'user'; // Default value if no token is found

    // Если токен есть, декодируем его и получаем значение 'sub'
      if (token) {
        const decodedToken = jwtDecode(token);
        username = decodedToken.sub; // Извлекаем 'sub' из payload токена
      }

      const qrCodeBlob = await generateQRCode(link, username, token); // Получаем Blob с изображением

      // Создаем объект URL для отображения изображения
      const qrCodeImageUrl = URL.createObjectURL(qrCodeBlob);
      console.log('Generated QR code URL:', qrCodeImageUrl); // Добавьте лог
      setQrCodeImage(qrCodeImageUrl); // Устанавливаем ссылку для изображения
    } catch (err) {
      setError('Error generating QR code');
    }
  };

  // Очистка URL, когда компонент размонтируется или QR-код изменится
  useEffect(() => {
    return () => {
      if (qrCodeImage) {
        URL.revokeObjectURL(qrCodeImage); // Очистка объекта URL
      }
    };
  }, [qrCodeImage]);

  return (
    <div className="generate-qr-container">
      <div className="form-wrapper">
        <h2>Generate QR Code</h2>
        <form onSubmit={handleGenerate}>
          <input
            type="text"
            placeholder="Enter link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="input-field"
          />
          <button type="submit" className="button">Generate</button>
        </form>
        
        {/* Display QR code if it exists */}
        {qrCodeImage && (
          <div className="qr-code-wrapper">
            <img src={qrCodeImage} alt="QR Code" className="qr-code" />
          </div>
        )}
        
        {/* Display error message if any */}
        {error && <p className="error">{error}</p>}
      </div>

      <style jsx>{`
        .generate-qr-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background-color: #f4f4f4;
        }

        .form-wrapper {
          background-color: white;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 400px;
          text-align: center;
        }

        h2 {
          margin-bottom: 20px;
        }

        .input-field {
          width: 100%;
          padding: 10px;
          margin: 10px 0;
          border-radius: 5px;
          border: 1px solid #ccc;
          box-sizing: border-box;
        }

        .button {
          width: 100%;
          padding: 10px;
          background-color: #282c34;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
          transition: background-color 0.3s ease;
        }

        .button:hover {
          background-color: #61dafb;
        }

        .qr-code-wrapper {
          margin-top: 20px;
        }

        .qr-code {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 0 auto;
        }

        .error {
          color: red;
          text-align: center;
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
};

export default GenerateQR;
