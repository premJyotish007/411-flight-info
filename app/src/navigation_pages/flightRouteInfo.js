import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ScatterPlot from '../utils/scatterPlot';
import HistogramChart from '../utils/histogram';
import { airlines } from './constants.js';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Cookies from 'js-cookie';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import './flightRouteInfo.css';


const FlightRouteInfo = () => {
    
  const [airlineName, setAirlineName] = useState('UA');
  const [flightNumber, setFlightNumber] = useState('');
  const [displayInfo, setDisplayInfo] = useState({
    source: null
  });

  const [likedButtons, setLikedButtons] = useState({});

  const isFavorite = async (email, iata_code) => {
    const response = await fetch(`http://localhost:3001/api/is-favorite?email=${email}&iata_code=${iata_code}`);
    const data = await response.json();
    return data.isFavorite;
  };

  const add_to_favorites = async (ranking, email, iata_code) => {
    const payload = { ranking: 0, email: email, iata_code: iata_code };
    const response = await fetch('http://localhost:3001/api/add-favorite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
  };

  const remove_from_favorites = async (email, iata_code) => {
    const payload = { email: email, iata_code: iata_code };
    const response = await fetch('http://localhost:3001/api/remove-favorite', {

        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
  };

  
  const handleLikeToggle = async (iata_code) => {
    setLikedButtons((prevLiked) => {
      const newLikedButtons = { ...prevLiked }; // Create a copy to avoid mutating the state directly
      newLikedButtons[iata_code] = !newLikedButtons[iata_code];
      return newLikedButtons;
    });
  
    if (!likedButtons[iata_code]) {
      await add_to_favorites(0, Cookies.get('userEmail'), iata_code);
    } else {
      await remove_from_favorites(Cookies.get('userEmail'), iata_code);
    }
  };
  

  const handleAirlineNameChange = (e) => {
      setAirlineName(e.target.value);
  };  
  const handleFlightNumberChange = (e) => {
      setFlightNumber(e.target.value);
  };
  const handleVisualizeClick = async () => {
    // setDisplayInfo(null); // Reset displayInfo
  
    if (!flightNumber || Number(flightNumber) < 1 || Number(flightNumber) > 9999) {
      // Handle the error (you can display a message, set an error state, etc.)
      console.error("Flight number error: Invalid flight number");
    } else {
      try {
        const src_dest_response = await fetch(`http://localhost:3001/api/flight-route-src-dest?airlineName=${airlineName}&flightNumber=${flightNumber}`);
        const data_src_dest = await src_dest_response.json();

        const source_full_name_res = await fetch (`http://localhost:3001/api/airport-full-name?iata=${data_src_dest[0].ORIGIN_AIRPORT}`);
        const source_full_name = await source_full_name_res.json();
        
        const dest_full_name_res = await fetch (`http://localhost:3001/api/airport-full-name?iata=${data_src_dest[0].DESTINATION_AIRPORT}`);
        const dest_full_name = await dest_full_name_res.json();

        const favorites_along_this_route = await fetch(`http://localhost:3001/api/get-favorites-flight-number?email=${Cookies.get('userEmail')}&flightNumber=${flightNumber}&airline=${airlineName}`);
        const favorites_along_this_route_data = await favorites_along_this_route.json();
        const iataCodes = favorites_along_this_route_data.map(airport => airport.iata_code);
        console.log(iataCodes);
  
        if (data_src_dest.length > 0) {
          let departing_times = [];
          let currLikedButtons = {};
          const src_dest_set = new Set();

          for (let i = 0; i < data_src_dest.length; i++) {
            departing_times.push(data_src_dest[i].ARRIVAL_DELAY);
            currLikedButtons[data_src_dest[i].ORIGIN_AIRPORT] = iataCodes.includes(data_src_dest[i].ORIGIN_AIRPORT);
            currLikedButtons[data_src_dest[i].DESTINATION_AIRPORT] = iataCodes.includes(data_src_dest[i].DESTINATION_AIRPORT);
            src_dest_set.add(JSON.stringify([data_src_dest[i].ORIGIN_AIRPORT, data_src_dest[i].DESTINATION_AIRPORT]));

          }
          console.log(currLikedButtons);
          setLikedButtons(currLikedButtons);
    

  
          setDisplayInfo({
            airlineName,
            flightNumber,
            delay_data: departing_times,
            src_dest_set: src_dest_set,
          });
        } else {
          // Handle the case when no flights are found for the given route number
          console.error("No matching flights found");
          setDisplayInfo(null);
        }
      } catch (error) {
        console.error('Error fetching flight data:', error);
        setDisplayInfo(null);
      }
    }
  };
  
  
  return (
      <div className="flight-route-info-container">
      <h1>Flight Route Info</h1>
      
      <div className='containers'>
        {/* Input for Airline Name */}
        <div className="input-container">

        <TextField
          id="airline-input"
          select
          label="Airline"
          defaultValue="United Air Lines Inc."
          SelectProps={{
            native: true,
          }}
          onChange={(e) => handleAirlineNameChange(e)}
          helperText="IATA code for Airline"
          variant="filled"
        >
          {airlines.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </TextField>


        </div>

        {/* Input for Flight Number */}
        <div className="input-container">

        <TextField 
            id="flight-number-input"
            label="Flight Number"
            variant="filled"
            onChange={(e) => handleFlightNumberChange(e)}
            helperText={!flightNumber ? "Cannot be empty" :
                        Number(flightNumber) < 1 | Number(flightNumber) > 9999 ? "Enter a valid flight number!" :
                        "Flight number for route"}
        />

        </div>
      </div>
     <div className="button-container">
         <Button className="submit-button" onClick={handleVisualizeClick}>Visualize!</Button>
     </div>
     {displayInfo && displayInfo.src_dest_set && (
    <div className="display-box">
      <TableContainer component={Paper} style={{ maxHeight: '300px', overflow: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Departures</TableCell>
              <TableCell>Arrivals</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from(displayInfo.src_dest_set).map((src_dest, index) => {
              const [source, destination] = JSON.parse(src_dest);

              return (
                <TableRow key={index}>
                  <TableCell>
                    <div className="sourceDisplay">
                      <p>{source}</p>
                      {Cookies.get('userEmail') && (
                        <IconButton
                          color={likedButtons[source] ? 'secondary' : 'default'}
                          onClick={() => handleLikeToggle(source)}
                        >
                          <FavoriteIcon />
                        </IconButton>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="destinationDisplay">
                      <p>{destination}</p>
                      {Cookies.get('userEmail') && (
                        <IconButton
                          color={likedButtons[destination] ? 'secondary' : 'default'}
                          onClick={() => handleLikeToggle(destination)}
                        >
                          <FavoriteIcon />
                        </IconButton>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <HistogramChart data={displayInfo.delay_data} y_label={'Arrival Delay (minutes)'} label = {`Arrival Delay Info for ${airlineName}: ${flightNumber}`} x_label={'(Every bar is an individual flight instance)'} />
    </div>
  )}

      {!displayInfo && (
        <div className="display-box">
          <h2> Invalid flight route! </h2>
        </div>
      )
    }
    </div>
  );
};

export default FlightRouteInfo;