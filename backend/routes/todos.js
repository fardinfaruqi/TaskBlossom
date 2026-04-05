const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// GET all todos for authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.userId;

    // Check if user exists in MySQL, create if missing
    const [userExists] = await pool.execute('SELECT id FROM users WHERE id = ?', [userId]);
    if (userExists.length === 0) {
      // Create user with firebase_uid
      await pool.execute(
        'INSERT INTO users (firebase_uid, email, name) VALUES (?, ?, ?)',
        [req.user.uid, req.user.email, req.user.displayName || '']
      );
    }

    const [todos] = await pool.execute('SELECT * FROM todos WHERE user_id = ? ORDER BY created_at DESC', [userId]);
    res.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

// POST: Create a new todo
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, priority, due_date } = req.body;
    const userId = req.userId;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const formattedDueDate = due_date ? new Date(due_date).toISOString().split('T')[0] : null;

    const [result] = await pool.execute(
      'INSERT INTO todos (user_id, title, description, priority, due_date) VALUES (?, ?, ?, ?, ?)',
      [userId, title, description || null, priority || 'medium', formattedDueDate]
    );

    res.status(201).json({
      id: result.insertId,
      user_id: userId,
      title,
      description: description || null,
      completed: false,
      priority: priority || 'medium',
      due_date: formattedDueDate,
    });
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

// PUT: Update a todo
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed, priority, due_date } = req.body;
    const userId = req.userId;

    // Verify ownership and get current todo
    const [todo] = await pool.execute('SELECT * FROM todos WHERE id = ? AND user_id = ?', [id, userId]);
    if (todo.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    const currentTodo = todo[0];

    // Merge provided fields with existing data, ensuring no undefined values
    const updatedTitle = title !== undefined ? title : currentTodo.title;
    const updatedDescription = description !== undefined ? description : currentTodo.description;
    const updatedCompleted = completed !== undefined ? completed : currentTodo.completed;
    const updatedPriority = priority !== undefined ? priority : currentTodo.priority;
    const formattedDueDate = due_date !== undefined ? (due_date ? new Date(due_date).toISOString().split('T')[0] : null) : currentTodo.due_date;

    await pool.execute(
      'UPDATE todos SET title = ?, description = ?, completed = ?, priority = ?, due_date = ? WHERE id = ?',
      [updatedTitle, updatedDescription, updatedCompleted, updatedPriority, formattedDueDate, id]
    );

    res.json({
      id: parseInt(id),
      user_id: userId,
      title: updatedTitle,
      description: updatedDescription,
      completed: updatedCompleted,
      priority: updatedPriority,
      due_date: formattedDueDate,
    });
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

// DELETE: Delete a todo
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    // Verify ownership
    const [todo] = await pool.execute('SELECT * FROM todos WHERE id = ? AND user_id = ?', [id, userId]);
    if (todo.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    await pool.execute('DELETE FROM todos WHERE id = ?', [id]);
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

module.exports = router;
