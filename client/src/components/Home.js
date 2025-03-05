import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

function Home() {
  return (
    <div className="home-container">
      {/* The white card container with text and button */}
      <div className="home-content">
        <h1>Welcome to Vyavach</h1>
        <p>Explore the great outdoors with our seamless user login platform.</p>
        <Link to="/login" className="btn">Login</Link>
        {/* <Link to="/register" className="btn">Register</Link> */}
      </div>
    </div>
  );
}

export default Home;
