import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import HistogramChart from '../utils/histogram';

const AirlineDelay = () => {
  const [airlineNames, setAirlineNames] = useState(null);
  const [delayInfo, setDelayInfo] = useState(null);

  useEffect(() => {
    const fetchAirlines = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/get-avgdelay');
        const data = await response.json();

        let delay_probs = [];
        let airlineNames = [];
        for (let i = 0; i < data.length; i++) {
          const curr_prob = data[i].Average_Departure_Delay;
          delay_probs.push(curr_prob);
          airlineNames.push(data[i].Airline);

        }
        setDelayInfo(delay_probs );
        setAirlineNames(airlineNames);
      } catch (error) {
        console.error('Error fetching airport data:', error);
      }
    };

    fetchAirlines();
  }, []);
  console.log(delayInfo);
  console.log(airlineNames);

  return (
    <div>
      <h3>Distribution of delay percentage stats for each airline</h3>
      {delayInfo ? <>
        <p>There are {delayInfo.length} airlines in the dataset.</p> 
        <HistogramChart data={delayInfo}  x_label_data = {airlineNames} 
                    label={'% Delay by Airline'}/>
      </>
      : <p>Loading...</p>}
    </div>
  );
};

export default AirlineDelay;
