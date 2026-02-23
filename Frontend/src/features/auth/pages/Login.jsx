import React, { useState } from "react";
import { Link } from "react-router";
import { User } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { handleLogin, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <h1>Loading...</h1>;
  }

  async function handleSubmit (e) {
    e.preventDefault();

   await handleLogin(username, password).then((res) => {
      console.log(res);
      navigate("/");
    });
  }

  return (
    <main>
      <div className="form-container">
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
