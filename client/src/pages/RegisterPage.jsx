import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage({ setUser }) {
  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    address: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async e => {
    e.preventDefault();
    setErrorMsg('');

    if (form.password !== form.confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    const { confirmPassword, ...userData } = form;

    try {
      const res = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      if (!res.ok) {
        const error = await res.text();
        setErrorMsg(error || 'Registration failed');
        return;
      }

      const user = await res.json();
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      navigate('/home');
    } catch (err) {
      console.error(err);
      setErrorMsg('Network error');
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Register</h2>

      <input name="name" placeholder="Name" onChange={handleChange} required />
      <input name="username" placeholder="Username" onChange={handleChange} required />
      <input name="email" placeholder="Email" type="email" onChange={handleChange} required />
      <input name="address" placeholder="Address" onChange={handleChange} required />
      <input name="phone" placeholder="Phone" onChange={handleChange} required />
      <input name="password" placeholder="Password" type="password" onChange={handleChange} required />
      <input name="confirmPassword" placeholder="Confirm Password" type="password" onChange={handleChange} required />

      <button type="submit">Register</button>
      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
    </form>
  );
}
