import React from 'react';
import { useContext, useRef } from "react";
import { loginCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
import { CircularProgress } from '@mui/material';
import {Link} from 'react-router-dom';
import "./login.css";

export default function Login() {
  const email = useRef();
  const password = useRef();
  const { user,isFetching, dispatch } = useContext(AuthContext);

  const handleClick = (e) => {
    e.preventDefault();
    loginCall(
      { email: email.current.value, password: password.current.value },
      dispatch
    );
  }
  console.log(user);

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">Social App</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on Social App.
          </span>
        </div>
        <div className="loginRight">
        <div className="loginForm">
          <h1 className="loginTitle">Login</h1>
          <form className="loginBox" onSubmit={handleClick}>
            <input
              placeholder="Email"
              type="email"
              required
              className="loginInput"
              ref={email}
            />
            <input
              placeholder="Password"
              type="password"
              required
              minLength="6"
              className="loginInput"
              ref={password}
            />
            <button className="loginButton" type="submit" disabled={isFetching} >
              {isFetching ? (
                <CircularProgress color="inherit" size="18px"/>
              ) : (
                "Log In"
              )}
            </button>
            <span className="loginForgot">Forgot Password?</span>
          </form>
            <Link to="/register" className="loginRegisterLink">
            <button className="loginRegisterButton" disabled={isFetching}>
              {isFetching ? 
                <CircularProgress color="inherit" size="18px" /> : 
                "Sign Up"
              }
            </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}