// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../components/task.css'
const Home = () => {
  return (
    <div>
      <h1>Welcome to the User Registration Portal</h1>
      <div>
        <Link to="/register">
          <button>Register</button>
        </Link>
        <Link to="/signin">
          <button>Sign In</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;