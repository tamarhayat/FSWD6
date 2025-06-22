import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ setUser }) {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav >
      <div>
        <button onClick={() => navigate('/home')}> Home</button>
        <button onClick={() => navigate('/info')}>Info</button>
      </div>
      <div>
        {user && <span style={{ marginRight: '10px' }}>Hello {user.name}</span>}
        <button onClick={handleLogout}> Logout</button>
      </div>
    </nav>
  );
};

