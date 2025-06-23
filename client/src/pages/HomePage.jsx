import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage(){
  const navigate = useNavigate();

  return (
    <div>
      <h2>Home Page</h2>
      <button onClick={() => navigate('/todos')}>Todos</button>
      <button onClick={() => navigate('/posts')}>Posts</button>
    </div>
  );
};

