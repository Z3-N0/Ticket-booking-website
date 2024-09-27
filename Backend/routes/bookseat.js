const express = require('express');
const { v4: uuidv4 } = require('uuid');  // for generating unique booking IDs
const router = express.Router();
const db = require('../db/db');
const { authenticateToken } = require('../middleware/auth');

router.post('/', authenticateToken, async (req, res) => {
  const { route_id, number_of_tickets } = req.body;

  if (!route_id || !number_of_tickets || number_of_tickets <= 0) {
    return res.status(400).json({ message: 'Invalid request data' });
  }

  const bookingId = uuidv4();  

  try {
 
    const [[route]] = await db.query('SELECT seats FROM routes WHERE id = ?', [route_id]);

    const [[{ bookedSeats }]] = await db.query(
      'SELECT COALESCE(SUM(number_of_tickets), 0) as bookedSeats FROM bookings WHERE route_id = ?',
      [route_id]
    );

    const availableSeats = route.seats - bookedSeats;

    if (availableSeats < number_of_tickets) {
      return res.status(400).json({ message: 'Not enough seats available' });
    }

    await db.query(
      'INSERT INTO bookings (id, user_id, route_id, number_of_tickets) VALUES (?, ?, ?, ?)',
      [bookingId, req.user.id, route_id, number_of_tickets]
    );

    res.json({ message: 'Seat booked successfully', bookingId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error booking seat' });
  }
});

module.exports = router;
