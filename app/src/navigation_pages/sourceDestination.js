import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Flight from '@mui/icons-material/Flight';
import './sourceDestination.css';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import FlightIcon from '@mui/icons-material/Flight';
import { airlines } from './constants.js';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import HistogramChart from '../utils/histogram';

const SourceDestination = () => {
  const [airportMapData, setAirportMapData] = useState({});
  const [airports, setAirports] = useState([]);

  const [sourceAirport, setSourceAirport] = useState('');
  const [destAirport, setDestinationAirport] = useState('');
  
    const handleSourceAirportChange = (e) => {
        setSourceAirport(e.target.value);
    };  
    const handleDestinationAirportChange = (e) => {
        setDestinationAirport(e.target.value);
    };
    const [displayInfo, setDisplayInfo] = useState(null);
    const [delayInfo , setDelayInfo] = useState([]);

  const airportMap = {};

  const airlineName = ["AA", "UA"];
  const content = ["sample content", "sample content 2"];
  
  function valuetext(value) {
    // Map the slider values to time format (12-hour clock with AM/PM)
    const hours = Math.floor(value / 60);
    const minutes = value % 60;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  
    return `${String(formattedHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${ampm}`;
  }

  function militaryTime (time) {
    let hours = parseInt(time.substring(0,2))
    let minutes = parseInt(time.substring(3,5))
    let ampm = time.substring(6,8)

    let hour_string = ""
    if (hours === 12) {
      hours = 0
    } 
    if (ampm === 'AM') {
      hour_string = String(hours).padStart(2, '0');
    } else {
      hour_string = String(hours + 12)
    }
    return hour_string + String(minutes).padStart(2, '0')
  }


  const [timeRangeValue, setValue] = React.useState([0, 1439]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    handleFlightIconClick();
  };


  useEffect(() => {
    const fetchAirports = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/airports');
        const data = await response.json();
        setAirportMapData(data);

        // Extract airport codes from the fetched data
        const airportCodes = Object.keys(data);
        setAirports(airportCodes);
      } catch (error) {
        console.error('Error fetching airport data:', error);
      }
    };

    fetchAirports();
  }, []); // Empty dependency array to run the effect only once on mount

  for (let i = 0; i < airportMapData.length; i++) {
    airports[i] = airportMapData[i].IATA_CODE;
    airportMap[airportMapData[i].IATA_CODE] = airportMapData[i].AIRPORT;

  }

  const airlineDict = {};
  airlines.forEach(airline => {
      const iataCode = airline.value;
      const fullName = airline.label;
      airlineDict[iataCode] = fullName;
  });

  console.log(airlineDict);



  const handleFlightIconClick = async () => {
    try {
        let military_time_min = militaryTime(valuetext(timeRangeValue[0]))
        let military_time_max = militaryTime(valuetext(timeRangeValue[1]))
        const response =
          await fetch(`http://localhost:3001/api/flights-source-destination?source=${sourceAirport}&destination=${destAirport}&min_time=${military_time_min}&max_time=${military_time_max}`);
        const response_data = await response.json();
        const response_best_day = await fetch(`http://localhost:3001/api/flight-route-best-day?source=${sourceAirport}&destination=${destAirport}`);
        
        const response_stored_proc = await fetch(`http://localhost:3001/get-flight-stats?src=${sourceAirport}&dest=${destAirport}`);
        const response_stored_proc_data = await response_stored_proc.json();
        console.log(response_stored_proc_data.results);
        const response_best_day_data = await response_best_day.json();
        console.log(response_best_day_data);
        if (response_stored_proc_data.results[0].length > 0) {
            let delay_probs = [];
            for (let i = 0; i < response_stored_proc_data.results[0].length; i++) {
              const curr_prob = response_stored_proc_data.results[0][i].prob_flight_affected;
              delay_probs.push(curr_prob);
            }
            setDelayInfo(delay_probs );
        }
        if (response_data.length > 0) {
            // let routes_array = [];
            let accordionData = {};
            for (let i = 0; i < response_data.length; i++) {
              let airline = response_data[i].flight_route.substring(1,3)
              if (!(airline in accordionData)) {
                accordionData[airline] = []
              }
              accordionData[airline].push(response_data[i].flight_route);
            }
            let airlineDelay = {};
            for (let i = 0; i < response_stored_proc_data.results[1].length; i++) {
              let airline = response_stored_proc_data.results[1][i].airline

              if (!(airline in airlineDelay)) {
                airlineDelay[airline] = response_stored_proc_data.results[1][i].prob_of_cancel
              }

            }
            setDisplayInfo({
                sourceAirport,
                destAirport,
                routes: accordionData,
                delays: airlineDelay
            });
          } else {
            setDisplayInfo({
              routes: [],
              delays: []
            });
            setDelayInfo([]);
            
          }
          console.log(displayInfo.routes)
          console.log(displayInfo.delays)
        console.log(delayInfo)

    } catch (error) {
        console.error('Error fetching flight data:', error);
    }
  };
  return (
    <div>
      <h1>Where are you flying today?</h1>
      <div className = "sliderDeptTime">
        <h3>Preferred departing time - </h3>
        <Box sx={{ width: 300 }}>
          <Slider
            aria-label="Time"
            value={timeRangeValue}
            onChange={handleChange}
            valueLabelDisplay="on"
            valueLabelFormat={valuetext}
            getAriaValueText={valuetext}
            marks={[
              { value: 0, label: '12 AM' },
              { value: 360, label: '6 AM' },
              { value: 720, label: '12 PM' },
              { value: 1080, label: '6 PM' },
              { value: 1439, label: '11:59 PM' },
            ]}
            step={60}
            min={0}
            max={1439}
          />
        </Box>
      </div>
      <div className="container">
        <div className="autocomplete">
          <Autocomplete
            options={airports}
            getOptionLabel={(option) => `${option} - ${airportMap[option] || ''}`}
            onChange={(event, value) => setSourceAirport(value)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Source airport code"
                variant="outlined"
              />
            )}
          />
        </div>
        <div className="autocomplete">
          <Autocomplete
            options={airports}
            getOptionLabel={(option) => `${option} - ${airportMap[option] || ''}`}
            onChange={(event, value) => setDestinationAirport(value)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Destination airport code"
                variant="outlined"
              />
            )}
          />
        
        
        </div >

        
        <div style={{ marginTop: '40px', cursor: 'pointer', textAlign: 'left' }}
          onClick={handleFlightIconClick}>
          <Flight style={{ fontSize: '32px', marginRight: '8px' }} />
        </div>
      </div>
      
      { displayInfo && displayInfo.routes &&  (
          <div className="accordions">
            {Object.keys(displayInfo.routes).map((accordionKey) => {
              const accordion = displayInfo.routes[accordionKey];
              const full_name = airlineDict[accordionKey]; 
              console.log(full_name, accordionKey);

              return (
                <Accordion key={accordion} className="airport-accordion">
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    className="airport-accordion-summary"
                  >
                    <Typography>{full_name} - Chances of delays + cancellations: {displayInfo.delays[accordionKey] ? displayInfo.delays[accordionKey] * 100 : 0}% </Typography>
                  </AccordionSummary>
                  <AccordionDetails className="airport-accordion-details">
                    <Typography>
                    <List>
                      {accordion.map((item, index) => (
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar>
                              <FlightIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={item}
                          />
                        </ListItem>
                      ))}
                    </List>
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              );
            })}
            {
              delayInfo && delayInfo.length > 0 && (
                <div>
                  <HistogramChart data={delayInfo}  x_label_data = {['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']}
                  label={'Flight delay probability by day of week (Doesn\'t account for departing time filters)'}/>
                  </div>
              )
            }
          </div>
        )}
        {
          displayInfo && displayInfo.routes.length === 0 && (
            
            <div className="no-results">
              {
                // (!displayInfo.sourceAirport || !displayInfo.destAirport) ? (
                //   <h3>Please enter a source and destination airport!</h3>
                // ) :
                (
                  <h3>No Flights Found!</h3>
                )

              }
            </div>
          )
        }
    </div>
  );
};

export default SourceDestination;
