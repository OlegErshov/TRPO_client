import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const headerStyle = {
    backgroundColor: '#282c34',
    padding: '15px',
  };

  const navStyle = {
    listStyleType: 'none',
    display: 'flex',
    justifyContent: 'space-around',
    padding: 0,
  };

  const linkStyle = {
    textDecoration: 'none',
    color: 'white',
    padding: '10px 15px',
    borderRadius: '5px',
    transition: 'background-color 0.3s ease',
  };

  const linkHoverStyle = {
    backgroundColor: '#61dafb',
  };

  return (
    <header style={headerStyle}>
      <nav>
        <ul style={navStyle}>
          <li><Link to="/login" style={linkStyle} onMouseOver={(e) => e.target.style.backgroundColor = linkHoverStyle.backgroundColor} onMouseOut={(e) => e.target.style.backgroundColor = ''}>Login</Link></li>
          <li><Link to="/register" style={linkStyle} onMouseOver={(e) => e.target.style.backgroundColor = linkHoverStyle.backgroundColor} onMouseOut={(e) => e.target.style.backgroundColor = ''}>Register</Link></li>
          <li><Link to="/generate" style={linkStyle} onMouseOver={(e) => e.target.style.backgroundColor = linkHoverStyle.backgroundColor} onMouseOut={(e) => e.target.style.backgroundColor = ''}>Generate QR</Link></li>
          <li><Link to="/stats" style={linkStyle} onMouseOver={(e) => e.target.style.backgroundColor = linkHoverStyle.backgroundColor} onMouseOut={(e) => e.target.style.backgroundColor = ''}>Stats</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
