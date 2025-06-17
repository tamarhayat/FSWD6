const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all users (optional filters via query)
router.get('/', async (req, res) => {
  try {
    let query = 'SELECT * FROM users';
    const params = [];

    if (Object.keys(req.query).length > 0) {
      const conditions = [];
      for (const key in req.query) {
        conditions.push(`${key} = ?`);
        params.push(req.query[key]);
      }
      query += ' WHERE ' + conditions.join(' AND ');
    }

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET user by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create new user
router.post('/', async (req, res) => {
    console.log("BODY RECEIVED:", req.body); // הדפסה חשובה!
    const { name, username, email, address, phone } = req.body;
    if (!name || !username || !email || !address || !phone) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const [result] = await db.query(
        'INSERT INTO users (name, username, email, address, phone) VALUES (?, ?, ?, ?, ?)',
        [name, username, email, address, phone]
        );
        res.status(201).json({ id: result.insertId, name, username, email, address, phone });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT update user
router.put('/:id', async (req, res) => {
  const { name, username, email, address, phone } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE users SET name = ?, username = ?, email = ?, address = ?, phone = ? WHERE id = ?',
      [name, username, email, address, phone, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ id: req.params.id, name, username, email, address, phone });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE user
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
