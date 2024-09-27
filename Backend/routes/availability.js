const express = require('express');
const router = express.Router();
const db = require('../db/db');

router.get('/', async (req, res) => {
  const { source, destination } = req.query;

  const query = `
  SELECT routes.id, 
         routes.from_location, 
         routes.to_location, 
         routes.seats, 
         (routes.seats - IFNULL(SUM(bookings.number_of_tickets), 0)) AS available_seats,
         routes.departure_time, 
         routes.arrival_time
  FROM routes
  LEFT JOIN bookings ON routes.id = bookings.route_id
  WHERE routes.from_location = ? AND routes.to_location = ?
  GROUP BY routes.id
`;


  try {
    const [results] = await db.query(query, [source, destination]);
    res.json(results);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error fetching seat availability' });
  }
});

module.exports = router;
