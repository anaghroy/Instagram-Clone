import React, { useState } from "react";
import { Link } from "react-router";
import axios from "axios";
import { User } from "lucide-react";
import image2 from "../../../assets/images/bg-auth.png";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    
  }

  return (
    <main>
      <div className="form-container">
        <div className="details">
          <h1>
            <User />
            Register
          </h1>
          <span>Keep it all together and you'll be fine</span>
          <form onSubmit={handleSubmit}>
            <input
              onInput={(e) => {
                setUsername(e.target.value);
              }}
              type="text"
              name="username"
              placeholder="Enter your username"
            />
            <input
              onInput={(e) => {
                setEmail(e.target.value);
              }}
              type="email"
              name="email"
              placeholder="Enter your email"
            />
            <input
              onInput={(e) => {
                setPassword(e.target.value);
              }}
              type="password"
              name="password"
              placeholder="Enter your password"
            />
            <button>Register</button>
          </form>
          <p>
            Already have an account?{" "}
            <Link className="toggleAuthForm" to="/login">
              Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Register;
