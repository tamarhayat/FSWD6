const express = require('express');
const router = express.Router();
const db = require('../db');

// POST /login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('Username and password are required');
  }

  try {
    // 1. Find user by username
    const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);

    if (users.length === 0) {
      return res.status(401).send('User not found');
    }

    const user = users[0];

    // 2. Get password from user_credentials
    const [creds] = await db.query('SELECT * FROM user_credentials WHERE user_id = ?', [user.id]);

    if (creds.length === 0 || creds[0].password !== password) {
      return res.status(401).send('Incorrect password');
    }

    // 3. Success — return user (excluding password)
    res.json({
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      address: user.address,
      phone: user.phone,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// POST /register
router.post('/register', async (req, res) => {
  const { name, username, email, address, phone, password } = req.body;

  if (!name || !username || !email || !address || !phone || !password) {
    return res.status(400).send('All fields are required');
  }

  try {
    const [existing] = await db.query(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, email]
    );
    if (existing.length > 0) {
      return res.status(400).send('Username or email already in use');
    }

    const [userResult] = await db.query(
      'INSERT INTO users (name, username, email, address, phone) VALUES (?, ?, ?, ?, ?)',
      [name, username, email, address, phone]
    );
    const userId = userResult.insertId;

    await db.query(
      'INSERT INTO user_credentials (user_id, password) VALUES (?, ?)',
      [userId, password]
    );

    res.status(201).json({
      id: userId,
      name,
      username,
      email,
      address,
      phone,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


module.exports = router;
