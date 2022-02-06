import React, { useState } from "react"
import { useRef } from "react";
import "./register.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Add } from "@mui/icons-material";

export default function Register() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const confirmPassword = useRef();
  const navigate = useNavigate();

  // handle image loading
  const [file, setFile] = useState(null);

  const handleClick = async (e) => {
    e.preventDefault();
    if (confirmPassword.current.value === password.current.value) {
      const user = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value
      };
      if(file){
        const data = new FormData();
        const fileName = Date.now()+file.name;
        data.append("name",fileName);
        data.append("file",file);
        user.profilePicture = fileName;
  
        try {
          await axios.post("/upload",data);
        } catch (error) {
          console.log(error);
        }
    }
      try {
        await axios.post("/auth/register", user);
        navigate("/login");
      } catch (err) {
        console.log(err);
      }
    } else {
      confirmPassword.current.setCustomValidity("Passwords don't match!");
    }
  };

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">Social App</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on Social App.
          </span>
        </div>
        <div className="registerRight">
        <div className="registerForm">
          {/* <h1 className="loginTitle">Register</h1> */}
          <form className="loginBox" onSubmit={handleClick}>
          <label htmlFor="file" className="uploadImgContainer">
          <img
                className="profileUploadImg"
                src={file?URL.createObjectURL(file): PF+"person/noAvatar.png"}
                alt=""
              />
              <input style={{display: "none"}} type="file" id="file" accept=".png,.jpeg,.jpg" onChange={(e)=>setFile(e.target.files[0])}/>
          </label>
            <input
              placeholder="Username"
              required
              ref={username}
              className="registerInput"
            />
            <input
              placeholder="Email"
              required
              ref={email}
              className="registerInput"
              type="email"
            />
            <input
              placeholder="Password"
              required
              ref={password}
              className="registerInput"
              type="password"
              minLength="6"
            />
            <input
              placeholder="Confirm Password"
              required
              ref={confirmPassword}
              className="registerInput"
              type="password"
            />
            <button className="registerButton" type="submit">
              Sign Up
            </button>            
          </form>
          <Link to="/login" className="loginRegisterLink">
          <button className="loginRegisterButton">Log In</button>
          </Link>
          </div>
        </div>
      </div>
    </div>
  );
}