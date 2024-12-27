import React, { useState } from 'react';
import { generateQRCode } from '../api';

const GenerateQR = () => {
  const [link, setLink] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  const handleGenerate = async (e) => {
    e.preventDefault();
    try {
      const data = await generateQRCode(link, 'user', token);
      setQrCodeUrl(data['QR-Code-URL']);
    } catch (err) {
      setError('Error generating QR code');
    }
  };

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
        {qrCodeUrl && (
          <div className="qr-code-wrapper">
            <img src={qrCodeUrl} alt="QR Code" className="qr-code" />
          </div>
        )}
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
          width: 200px;
          height: 200px;
          margin-top: 10px;
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
