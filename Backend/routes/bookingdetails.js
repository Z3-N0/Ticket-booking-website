const express = require('express');
const router = express.Router();
const db = require('../db/db');
const { authenticateToken } = require('../middleware/auth');

router.get('/:bookingId', authenticateToken, async (req, res) => {
  const { bookingId } = req.params;

  const query = `
    SELECT bookings.id, routes.from_location, routes.to_location, bookings.number_of_tickets, 
           users.username, bookings.booking_time
    FROM bookings
    JOIN routes ON bookings.route_id = routes.id
    JOIN users ON bookings.user_id = users.id
    WHERE bookings.id = ? AND bookings.user_id = ?
  `;

  try {
    const [results] = await db.query(query, [bookingId, req.user.id]);

    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching booking details' });
  }
});

module.exports = router;
