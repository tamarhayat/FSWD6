const express = require('express');
const router = express.Router();
const db = require('../db.js');

// GET /todos
router.get('/', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM todos');
  res.json(rows);
});

// GET todo by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM todos WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Todo not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /todos
router.post('/', async (req, res) => {
  const { userId, title, completed = false } = req.body;
  const [result] = await db.query('INSERT INTO todos (userId, title, completed) VALUES (?, ?, ?)', [userId, title, completed]);
  res.status(201).json({ id: result.insertId, userId, title, completed });
});

// PUT /todos/:id
router.put('/:id', async (req, res) => {
  const { title, completed } = req.body;

  if (title === undefined || completed === undefined) {
    return res.status(400).send('Both title and completed are required for full update');
  }

  try {
    const [result] = await db.query(
      'UPDATE todos SET title = ?, completed = ? WHERE id = ?',
      [title, completed, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).send('Todo not found');
    }

    res.send('Todo updated');
  } catch (err) {
    res.status(500).send('Error updating todo');
  }
});


// DELETE /todos/:id
router.delete('/:id', async (req, res) => {
  await db.query('DELETE FROM todos WHERE id = ?', [req.params.id]);
  res.send('Todo deleted');
});

module.exports = router;
