import React from 'react';
import Cookies from 'js-cookie';
const Home = () => (
  <div>
    {
      Cookies.get('userName') != 'null' && Cookies.get('userName') != 'undefined' ? (
        <h1> {Cookies.get('userName')}, Welcome to Your Aviation Dashboard! </h1>
      ) : (
        <h1> Welcome to Your Aviation Dashboard! </h1>
      )
    }
    <p>
      This is where you can find information about flight routes, airport details, and plan your trips efficiently.
    </p>
  </div>
);

export default Home;
