// App.js

import React, { useState, useEffect } from 'react';
import { ProSidebar, Menu, MenuItem } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import Cookies from 'js-cookie'; // Import the library
import './App.css';
import Home from './navigation_pages/home.js';
import FlightRouteInfo from './navigation_pages/flightRouteInfo.js';
import AccountInfo from './navigation_pages/accountInfo';
import SourceDestination from './navigation_pages/sourceDestination';
import AirlineDelay from './navigation_pages/airlineDelay';
import Avatar from '@mui/material/Avatar';

function App() {
  const [selectedMenuItem, setSelectedMenuItem] = useState('Home');
  const [accountInfo, setAccountInfo] = useState({ name: Cookies.get('userName') }); // Read the cookie

  const handleMenuItemClick = (menuItem) => {
    setSelectedMenuItem(menuItem);
  };

  const updateAccountInfo = (info) => {
    setAccountInfo(info);

    // Update the cookie when the account information changes
    Cookies.set('userName', info.name);
  };

  const menuContent = {
    'Home': <Home />,
    'Account Info': <AccountInfo updateAccountInfo={updateAccountInfo} />,
    'Flight Route Information': <FlightRouteInfo />,
    'Find Flights': <SourceDestination />,
    'Airline Delay Stats': <AirlineDelay />
  };

  Cookies.set('userName', accountInfo.name);

  return (
    <div className="App">
      <div className="Container">
        <div className='NavigationMenu'>
          <ProSidebar style={{ height: '100vh'}} className='SideBar'>
            <Menu>
              {Object.keys(menuContent).map((menuItem) => (
                <MenuItem key={menuItem} onClick={() => handleMenuItemClick(menuItem)}>
                  {menuItem === 'Account Info' && accountInfo.name != "null" && Cookies.get('userName') != 'undefined' ? Cookies.get('userName')  : menuItem} 
                </MenuItem>
              ))}
            </Menu>
          </ProSidebar>
        </div>

        <div className="MainContent">
          {menuContent[selectedMenuItem]}
        </div>
      </div>
    </div>
  );
}

export default App;
