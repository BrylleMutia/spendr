import React from "react";
import { Link } from "react-router-dom";

const AuthHome = () => {
  return (
    <div>
      <button>
        <Link to="/register">Register</Link>
      </button>
      <button>
        <Link to="/login">Login</Link>
      </button>
    </div>
  );
};

export default AuthHome;
