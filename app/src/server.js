require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const port = 3001; // Choose a port for your server
app.use(cors());
app.use(express.json());

const sql_pw = process.env['sqlpw'];

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: sql_pw,
  database: 'dbmsLocal',
});

db.connect((err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to the database');
  }
});

// API endpoint to fetch flight data
app.get('/api/flight-route-delays', (req, res) => {
  console.log("fetching flight route...");
  const { airlineName, flightNumber } = req.query
  const query = 'SELECT DEPARTURE_DELAY FROM dbmsLocal.flights WHERE FLIGHT_NUMBER = ' + flightNumber + ' AND AIRLINE = ' + '\'' + airlineName + '\'' + ' LIMIT 50'; // Replace with your actual table name
  console.log(query);
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
        res.json(results);
        console.log("found flights...");
    }
  });
  console.log("done fetching flight route...");
});

app.get('/api/flight-route-src-dest', (req, res) => {
  console.log("fetching flight route...");
  const { airlineName, flightNumber } = req.query
  const query = 'SELECT ORIGIN_AIRPORT, DESTINATION_AIRPORT, AVG(DISTANCE) as dist FROM dbmsLocal.flights WHERE FLIGHT_NUMBER = ' + flightNumber + ' AND AIRLINE = ' + '\'' + airlineName + '\'' + 'GROUP BY ORIGIN_AIRPORT, DESTINATION_AIRPORT LIMIT 50'; // Replace with your actual table name
  console.log(query);
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
        res.json(results);
        console.log("found flights...");
    }
  });
  console.log("done fetching flight route...");
});

app.post('/api/add-account', (req, res) => {
  const {name, email, hashedPassword } = req.body;

  const query = `INSERT INTO dbmsLocal.users (name, email, pass) VALUES ("${name}", "${email}", "${hashedPassword}")`;
  const values = [name, email, hashedPassword];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.status(201).json({ message: 'Account added successfully' });
    }
  });
});

app.get('/api/get-password', (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const query = `SELECT pass FROM dbmsLocal.users WHERE email = "${email}"`;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      if (results.length === 0) {
        res.status(404).json({ error: 'User not found' });
      } else {
        const password = results[0].pass;
        res.json({ password });
      }
    }
  });
});

app.get('/api/get-name', (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const query = `SELECT name FROM dbmsLocal.users WHERE email = "${email}"`;
  console.log(query);

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      if (results.length === 0) {
        res.status(404).json({ error: 'User not found' });
      } else {
        const name = results[0].name;
        res.json({ name });
      }
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
