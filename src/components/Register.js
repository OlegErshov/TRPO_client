import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(username, password, role);
      navigate('/login');
    } catch (err) {
      setError('Username already exists');
    }
  };

  return (
    <div className="register-container">
      <div className="form-wrapper">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input-field"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
          />
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value)} 
            className="input-field"
          >
            <option value="user">User</option>
            <option value="VIP">VIP</option>
          </select>
          <button type="submit" className="button">Register</button>
        </form>
        {error && <p className="error">{error}</p>}
      </div>

      <style jsx>{`
        .register-container {
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
        }

        h2 {
          text-align: center;
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

        .error {
          color: red;
          text-align: center;
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
};

export default Register;
