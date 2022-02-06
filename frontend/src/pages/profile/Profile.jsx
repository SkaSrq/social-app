import React from 'react';
import "./profile.css";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import { useEffect, useState } from "react";
import axios from "axios";
import {useParams} from 'react-router';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

export default function Profile() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [file, setFile] = useState(null);

  const [user, setUser] = useState({});
  const {user: currentUser} = useContext(AuthContext);
  const username = useParams().username;

    useEffect(()=>{
        const fetchUser = async()=>{
            const res = await axios.get(`/users/?username=${username}`);
            setUser(res.data);
        }
        fetchUser();
        
    },[username] );
    console.log("user",user);

    useEffect(()=>{
        if(file){const data = new FormData();
        const fileName = Date.now()+file.name;
        data.append("name",fileName);
        data.append("file",file);
          console.log("file loaded..");
          user.profilePicture = fileName;
          // update databse
            const updateUser = async()=>{
            try {
              await axios.post("/upload",data);
            } catch (error) {
              console.log(error);
            }
            try {
              const newUser = await axios.put("/users/"+user._id,user);
              console.log(newUser.data);
              setUser(newUser.data);
            } catch (error) {
              console.log(error);
            }
          }
          updateUser();
        }
    },[file])
  return (
    <>
      <Topbar />
      <div className="profile">
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <img
                className="profileCoverImg"
                src={user.converPicture? PF+user.converPicture : PF+"person/noCover.png"}
                alt=""
              />
              {/* <img
                className="profileUserImg"
                src={user.profilePicture? PF+user.profilePicture : PF+"person/noAvatar.png"}
                alt=""
              /> */}
              <label htmlFor="file" >
              <img
                className="profileUserImg"
                src={file?URL.createObjectURL(file): (user?.profilePicture ? PF+user.profilePicture:PF+"person/noAvatar.png")}
                alt=""
              />
              <input style={{display: "none"}} type="file" id="file" accept=".png,.jpeg,.jpg" onChange={(e)=>setFile(e.target.files[0])}/>
          </label>
            </div>
            <div className="profileInfo">
                <h4 className="profileInfoName">{user.username}</h4>
                <span className="profileInfoDesc">{user.desc}</span>
            </div>
          </div>
          <div className="profileRightBottom">
            <Feed username = {username}/>
            <Rightbar user={user}/>
          </div>
        </div>
      </div>
    </>
  );
}