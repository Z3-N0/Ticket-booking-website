
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer'); 
const locationsRoutes = require('./routes/locations'); 
const routeRoutes = require('./routes/routes');
const availabilityRouter = require('./routes/availability');
const bookSeatRouter = require('./routes/bookseat');
const bookingDetailsRouter = require('./routes/bookingdetails');

const db = require('./db/db'); 
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

app.post('/api/register', async (req, res) => {
  const { username, password, role } = req.body;


  if (!username || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';

    await db.query(query, [username, hashedPassword, role]);

    res.status(201).json({ message: 'User registered successfully' });

  } catch (error) {
    console.error("Registration error:", error); 
    return res.status(500).json({ message: 'Server error' });
  }
});


app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM users WHERE username = ?';

  try {
    const [result] = await db.query(query, [username]); 

    if (result.length === 0) {
      console.log("Entered no username section");
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const user = result[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log("Entered wrong password section");
      return res.status(400).json({ message: 'Invalid username or password' });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, role: user.role });
    
  } catch (error) {
    console.error("Database error:", error); 
    return res.status(500).json({ message: 'Server error' });
  }
});


app.use('/api/locations', locationsRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/seats/availability', availabilityRouter); 
app.use('/api/seats/book', bookSeatRouter);           
app.use('/api/bookings', bookingDetailsRouter);  


app.listen(5000, () => {
  console.log('Server running on port 5000');
});
