const express = require('express');
const router = express.Router();
const db = require('../db/db');
const { verifyAdminApiKey } = require('../middleware/adminAuth');

router.get('/', async (req, res) => {
  try {
    const locations = await db.query('SELECT * FROM locations');
    res.json(locations);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.post('/add', verifyAdminApiKey, async (req, res) => {
  const { name } = req.body;
  try {
    await db.query('INSERT INTO locations (name) VALUES (?)', [name]);
    res.json({ message: 'Location added successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.put('/edit/:id', verifyAdminApiKey, async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    await db.query('UPDATE locations SET name = ? WHERE id = ?', [name, id]);
    res.json({ message: 'Location updated successfully' });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Database error' });
  }
});

router.delete('/delete/:id', verifyAdminApiKey, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM locations WHERE id = ?', [id]);
    res.json({ message: 'Location deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
