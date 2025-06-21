import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch("/web/session/authenticate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // needed to receive/set the session cookie
      body: JSON.stringify({
        jsonrpc: "2.0",
        params: {
          db: "gym_project", // change if needed
          login: email,
          password: password,
        },
      }),
    });

    const data = await res.json();

    if (data.result && data.result.uid) {
      navigate("/member/dashboard"); 
      console.log("Login success!", data.result);
    } else {
      setErrorMsg("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gym-dark text-white px-4">
      <form onSubmit={handleLogin} className="bg-gym-gray p-8 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">Login to Your Account</h2>

        {errorMsg && <p className="text-red-500 mb-4 text-center">{errorMsg}</p>}

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-3 mb-4 rounded bg-gym-dark text-white border border-gym-gray placeholder-gray-400 focus:outline-none focus:border-gym-orange"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-3 mb-6 rounded bg-gym-dark text-white border border-gym-gray placeholder-gray-400 focus:outline-none focus:border-gym-orange"
        />
        <button
          type="submit"
          className="w-full bg-gym-orange hover:bg-gym-red text-white font-semibold py-3 rounded"
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
