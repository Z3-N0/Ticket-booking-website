const express = require('express');
const router = express.Router();
const db = require('../db/db');
const { verifyAdminApiKey } = require('../middleware/adminAuth');

router.get('/', async (req, res) => {
  try {
    const routes = await db.query('SELECT * FROM routes');
    res.json(routes);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.post('/add', verifyAdminApiKey, async (req, res) => {
  const from_location = req.body.fromLocation;
  const to_location = req.body.toLocation;
  const seats = req.body.seats;
  const departure_time = req.body.departureTime;
  const arrival_time = req.body.arrivalTime;
  try {
    await db.query(
      'INSERT INTO routes (from_location, to_location, seats, departure_time, arrival_time) VALUES (?, ?, ?, ?, ?)',
      [from_location, to_location, seats, departure_time, arrival_time]
    );
    res.json({ message: 'Route added successfully' });
  } catch (err) {
    
    res.status(500).json({ error: 'Database error' });
  }
});

router.put('/edit/:id', verifyAdminApiKey, async (req, res) => {
  const { id } = req.params;
  const from_location = req.body.fromLocation;
  const to_location = req.body.toLocation;
  const seats = req.body.seats;
  const departure_time = req.body.departureTime;
  const arrival_time = req.body.arrivalTime;
  try {
    await db.query(
      'UPDATE routes SET from_location = ?, to_location = ?, seats = ?, departure_time = ?, arrival_time = ? WHERE id = ?',
      [from_location, to_location, seats, departure_time, arrival_time, id]
    );
    res.json({ message: 'Route updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.delete('/delete/:id', verifyAdminApiKey, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM routes WHERE id = ?', [id]);
    res.json({ message: 'Route deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
