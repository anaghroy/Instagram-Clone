import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { User } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const Register = () => {
  const { loading, handleRegister } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  async function handleSubmit(e) {
    e.preventDefault();
    await handleRegister(username, email, password);
    navigate("/");
  }
  if (loading) {
    <main>
      <h1>Loading...</h1>
    </main>;
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
