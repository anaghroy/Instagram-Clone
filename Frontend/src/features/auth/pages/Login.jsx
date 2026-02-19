import React, { useState } from "react";
import { Link } from "react-router";
import axios from "axios";
import { User } from "lucide-react";
import image1 from "../../../assets/images/bg-themed.png";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    axios
      .post(
        "http://localhost:3000/api/auth/login",
        {
          username,
          password,
        },
        { withCredentials: true },
      )
      .then((res) => {
        console.log(res.data);
      });
  }

  return (
    <main>
      <div className="form-container">
        <div className="image">
          <img src={image1} alt="bg-themed" />
        </div>
        <div className="details">
          <h1>
            <User />
            Login
          </h1>
          <span>Keep it all together and you'll be fine</span>
          <form onSubmit={handleSubmit}>
            <input
              onInput={(e) => {
                setUsername(e.target.value);
              }}
              type="text"
              name="username"
              placeholder="E-mail or username"
            />
            <input
              onInput={(e) => {
                setPassword(e.target.value);
              }}
              type="password"
              name="password"
              placeholder="Enter your password"
            />
            <button type="submit">Login</button>
          </form>
          <p>
            Don't have an account?{" "}
            <Link className="toggleAuthForm" to="/register">
              Register
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Login;
