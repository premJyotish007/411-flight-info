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
  host: '34.31.210.171',
  user: 'root',
  password: 'password@123',
  database: 'flights',
});

db.connect((err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to the database');
  }
});


app.get('/api/flights-source-destination', (req, res) => {
    console.log("fetching flight route from source to destination...");
    const { source, destination, min_time, max_time } = req.query
    const query = `select distinct flight_route from flights.red_flights
    where ORIGIN_AIRPORT = '${source}' and DESTINATION_AIRPORT = '${destination}' group by flight_route
    having AVG(DEPARTURE_TIME - DEPARTURE_DELAY) BETWEEN ${min_time} AND ${max_time}`
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

app.get('/api/airports', (req, res) => {
    console.log("fetching flight route...");
    const query = 'select * from flights.airports'
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

  app.get('/api/airport-full-name', (req, res) => {
    console.log("fetching flight route...");
    const { iata } = req.query
    const query = `select AIRPORT, CITY from flights.airports where IATA_CODE = '${iata}'`
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
  const query = 'SELECT ORIGIN_AIRPORT, DESTINATION_AIRPORT, ARRIVAL_DELAY FROM flights.red_flights WHERE flight_number = ' + flightNumber + ' AND airline = ' + '\'' + airlineName + '\''; // Replace with your actual table name
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

  const query = `INSERT INTO flights.userLogin (username, email, password) VALUES ("${name}", "${email}", "${hashedPassword}")`;
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

app.delete('/api/delete-account', (req, res) => {
  const email = req.body.email; // Use req.query to get query parameters
  console.log(email);

  const query = `DELETE FROM flights.userLogin WHERE email = "${email}"`;
  const values = [email];

  console.log(query);

  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.status(200).json({ message: 'Account deleted successfully' });
    }
  });
});


app.get('/api/get-password', (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const query = `SELECT password FROM flights.userLogin WHERE email = "${email}"`;
  db.query(query, (err, results) => {
    if (err) {
      console.log(results)
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      if (results.length === 0) {
  res.status(404).json({ error: 'User not found' });
      } else {
const password = results[0].password;
                              console.log(results)
res.json({ password });
      }
    }
  });
});

app.get('/api/get-airline-flight-numbers', (req, res) => {
  const { iata } = req.query;

  if (!iata) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const query = `SELECT DISTINCT(flight_number) FROM flights.red_flights WHERE airline = "${iata}"`;
  console.log(query)
  db.query(query, (err, results) => {
    if (err) {
      console.log(results)
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      if (results.length === 0) {
  res.status(404).json({ error: 'User not found' });
      } else {
        res.json(results);
      }
    }
  });
});

app.get('/api/get-airline-iata', (req, res) => {
  const { iata } = req.query;

  if (!iata) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const query = `SELECT Airline FROM flights.airlines WHERE IATA_CODE = "${iata}"`;
  db.query(query, (err, results) => {
    if (err) {
      console.log(results)
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      if (results.length === 0) {
  res.status(404).json({ error: 'User not found' });
      } else {
const airline = results[0].Airline;
res.json({ airline });
      }
    }
  });
});


app.get('/api/get-name', (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const query = `SELECT username FROM flights.userLogin WHERE email = "${email}"`;
  console.log(query);

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      if (results.length === 0) {
        res.status(404).json({ error: 'User not found' });
      } else {
        const name = results[0].username;
        res.json({ name });
      }
    }
  });
});


app.post('/api/add-favorite', (req, res) => {
  const { ranking, email, iata_code } = req.body;

  if (!email || !iata_code) {
    console.log('here')
    return res.status(400).json({ error: 'Ranking, email, and IATA code are required' });
  }

  const query = `INSERT INTO flights.favorites (ranking, email, iata_code) VALUES (${ranking}, '${email}', '${iata_code}')`;
  console.log(query);
  const values = [ranking, email, iata_code];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.status(201).json({ message: 'Favorite added successfully' });
    }
  });
  console.log("done adding favorite...");
});

app.delete('/api/remove-favorite', (req, res) => {
  const { email, iata_code } = req.body;

  if (!email || !iata_code) {
    return res.status(400).json({ error: 'Email and IATA code are required' });
  }

  const query = `DELETE FROM flights.favorites WHERE email = '${email}' AND iata_code = '${iata_code}'`;
  console.log(query);
  const values = [email, iata_code];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.status(200).json({ message: 'Favorite removed successfully' });
    }
  });
});

app.get('/api/is-favorite', (req, res) => {
  const { email, iata_code } = req.query;

  if (!email || !iata_code) {
    return res.status(400).json({ error: 'Email and IATA code are required' });
  }

  const query = `SELECT * FROM flights.favorites WHERE email = '${email}' AND iata_code = '${iata_code}'`;
  console.log(query);
  const values = [email, iata_code];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else if (results.length === 0) {
      res.json({ isFavorite: false });
    } else {
      res.json({ isFavorite: true });
    }
  });

});

app.get('/api/get-favorites', (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const query = `SELECT ranking, flights.favorites.iata_code, AIRPORT, timestamp, CITY FROM flights.favorites 
  join flights.airports on flights.airports.IATA_CODE = flights.favorites.iata_code
   WHERE email = '${email}' ORDER BY ranking`;
  console.log(query);
  const values = [email];

  db.query(query, values, (err, results) => {
    if (err) {
      console.log(results)
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json(results);
    }
  });
});

app.get('/api/get-favorites-flight-number', (req, res) => {
  const {email, airline, flightNumber} = req.query;

  const query =
  `SELECT flights.favorites.iata_code
  FROM flights.favorites
  JOIN flights.airports ON flights.airports.IATA_CODE = flights.favorites.iata_code
  WHERE email = '${email}'
  
  INTERSECT
  
  (SELECT ORIGIN_AIRPORT
  FROM flights.red_flights
  WHERE flight_number = ${flightNumber} AND airline = '${airline}'
  UNION
  SELECT DESTINATION_AIRPORT
  FROM flights.red_flights
  WHERE flight_number = ${flightNumber} AND airline = '${airline}');
  `;
  console.log(query);
  const values = [email, airline, flightNumber];

  db.query(query, values, (err, results) => {
    if (err) {
      console.log(results)
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json(results);
    }
  });
  
});

app.post('/updateAccounts', (req, res) => {
  const email = req.body.email; // Assuming you're using body-parser middleware
  const objectList = req.body.objectList;

  // Prepare the SQL statement to call the stored procedure
  const sql = `CALL update_accounts_table('${email}', '${objectList}')`;
  console.log(sql)

  // Execute the stored procedure with parameters
  db.query(sql, [email, objectList], (err, results) => {
    if (err) {
      console.error('Error calling stored procedure:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    // Process the results if needed
    console.log('Stored procedure called successfully:', results);
    res.status(200).json({ success: true });
  });

  console.log('Update accounts...');
});

app.get('/get-flight-stats', (req, res) => {
  console.log('obtaining flights stats...');
  const { src, dest } = req.query;

  // Prepare the SQL statement to call the stored procedure
  const sql = `CALL GetFlightStatistics('${src}', '${dest}')`;
  console.log(sql)

  // Execute the stored procedure with parameters
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error calling stored procedure:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      
      return;
    }

    // Process the results if needed
    console.log('Stored procedure called successfully:', results);
    res.status(200).json({ results });
  });

  console.log('obtained flights stats...');
});









// API endpoint to calculate probability of delays on route by airline
app.get('/api/flight-route-delays', (req, res) => {
  console.log("calculating delays flight route...");
  const { source, destination } = req.query
  const query = 
  `select r1.airline, count(r1.airline) as 'num_flights_canc', num_flights_airline, (count(r1.airline)/num_flights_airline) as prob_of_cancel
  -- select *
  from (red_flights r1 join cancel c1 on r1.Unique_flight = c1.Unique_flight) join (
    select r2.airline, count(r2.airline) as 'num_flights_airline'
    from red_flights r2 join cancel c2 on r2.Unique_flight = c2.Unique_flight
    where (r2.DESTINATION_AIRPORT like '${source}' and r2.ORIGIN_AIRPORT like '${destination}')
    group by r2.airline
    ) as sub_query on r1.airline = sub_query.airline
    where (r1.DESTINATION_AIRPORT like '${source}' and r1.ORIGIN_AIRPORT like '${destination}') and ((c1.CANCELLED like 1) or (c1.DIVERTED like 1) or (c1.AIR_SYSTEM_DELAY > 0) or (c1.SECURITY_DELAY > 0) or (c1.AIRLINE_DELAY > 0) or (c1.LATE_AIRCRAFT_DELAY > 0) or (c1.WEATHER_DELAY > 0))
    group by r1.airline
    order by prob_of_cancel ASC;`;
    
    console.log(query);
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        res.json(results);
        console.log("found delays on routes...");
      }
    });
    console.log("done fetching delays on flight route...");
  });
  
  // API endpoint to calculate number of affected flights at a given airport
  app.get('/api/flight-route-delays-source', (req, res) => {
    console.log("calculating # of delays flight at airport...");
    const query = 
    `select r.ORIGIN_AIRPORT, count(r.ORIGIN_AIRPORT) as 'number of flights affected per origin airport'
    from red_flights r join cancel c on r.Unique_flight = c.Unique_flight
    where (CHAR_LENGTH(r.ORIGIN_AIRPORT) = 3) and ((c.CANCELLED like 1) or (c.DIVERTED like 1) or (c.AIR_SYSTEM_DELAY > 0) or 
    (c.SECURITY_DELAY > 0) or (c.AIRLINE_DELAY > 0) or (c.LATE_AIRCRAFT_DELAY > 0) or (c.WEATHER_DELAY > 0))
    group by r.ORIGIN_AIRPORT;`;
    
    console.log(query);
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        res.json(results);
        console.log("found # of delays at airport...");
      }
    });
    console.log("done fetching # of delays on flight route...");
  });
  
  
  // API endpoint to calculate bext day to fly a route
  app.get('/api/flight-route-best-day', (req, res) => {
    console.log("calculating # of delays flight at airport...");
    const { source, destination } = req.query
    const query = 
    `SELECT r.DAY_OF_WEEK, COUNT(r.DAY_OF_WEEK) AS 'Aff_fl_day', Tot_fl_day, (COUNT(r.DAY_OF_WEEK)/Tot_fl_day) AS prob_flight_affected
    FROM (flights.red_flights r JOIN flights.cancel c ON r.Unique_flight = c.Unique_flight) 
    JOIN (
      SELECT DAY_OF_WEEK, Count(DAY_OF_WEEK) as 'Tot_fl_day'
      FROM red_flights
      WHERE DESTINATION_AIRPORT LIKE '${destination}'and ORIGIN_AIRPORT like '${source}'
      GROUP by DAY_OF_WEEK
      ) AS sub_query ON sub_query.DAY_OF_WEEK = r.DAY_OF_WEEK
      WHERE (r.DESTINATION_AIRPORT LIKE '${destination}' AND r.ORIGIN_AIRPORT LIKE '${source}') AND 
      ((c.CANCELLED like 1) OR (c.DIVERTED like 1) OR (c.AIR_SYSTEM_DELAY > 0) OR 
      (c.SECURITY_DELAY > 0) OR (c.AIRLINE_DELAY > 0) OR (c.LATE_AIRCRAFT_DELAY > 0) OR (c.WEATHER_DELAY > 0))
      GROUP BY r.DAY_OF_WEEK
      ORDER BY r.DAY_OF_WEEK ASC;`;
      
      console.log(query);
      db.query(query, (err, results) => {
        if (err) {
          console.error('Error executing query:', err);
          res.status(500).json({ error: 'Internal server error' });
        } else {
          res.json(results);
          console.log("found # of delays at airport...");
        }
      });
      console.log("done fetching day to fly on flight route...");
    });
    
    query_Str = 'Select flight.airline AS Airline,ROUND(AVG(flight.DEPARTURE_DELAY + flight.ARRIVAL_DELAY),2) AS Average_Departure_Delay FROM flights.red_flights flight WHERE flight.DEPARTURE_DELAY IS NOT NULL GROUP BY flight.airline;'
    
    //deepit code
    app.get("/api/get-avgdelay", (req, res) => {
      console.log("fetching average airline delay...");
      //const { airlineName, flightNumber } = req.query
      const query = query_Str; // Replace with your actual table name
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
      console.log("done fetching average delay...");
    });


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});