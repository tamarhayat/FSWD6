import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import InfoPage from './pages/InfoPage';
import TodosPage from './pages/TodosPage';
import PostsPage from './pages/PostsPage';

export default function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage setUser={setUser} />} />
        <Route path="/register" element={<RegisterPage setUser={setUser} />} />
        <Route path="/home" element={user ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/info" element={user ? <InfoPage /> : <Navigate to="/login" />} />
        <Route path="/todos" element={user ? <TodosPage /> : <Navigate to="/login" />} />
        <Route path="/posts" element={user ? <PostsPage /> : <Navigate to="/login" />} />
        <Route path="/*" element={<HomePage />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}
