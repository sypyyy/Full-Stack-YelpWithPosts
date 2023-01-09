import React from 'react';
//import "./Register.scss";

import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import axios from "axios";
import { Routes, Route, Outlet, Link } from "react-router-dom";
import base from '../base';

export default function Register() {
  const [emailVal, setEmailVal] = useState("");
  const [userVal, setUserVal] = useState("");
  const [passVal, setPassVal] = useState("");
  const [email, setEmail] = useState("empty");
  const [user, setUser] = useState("empty");
  const [pass, setPass] = useState("empty");
  const [displayPassErr, setDisplayPass] = useState(false);
  const [displayUserErr, setDisplayUser] = useState(false);
  const [displayEmailErr, setDisplayEmail] = useState(false);
  const [userExist, setUserExist] = useState(false);
  /*I referenced this piece of code from: https://getbootstrap.com/docs/5.0/components/modal/*/
  {/**MODAL */}
 
  return (
        <div>
        <div style={{height : "50px"}}></div>
        <div className="card LoginAndRegister mx-auto text-center">
        
        <div style = {{width : "95%"}} className="mx-auto">
        <h5 className="mt-3 mb-3">Register</h5>
        <Form noValidate onSubmit={(e)=>{e.preventDefault()}}>
        <div className="">
          {/**Email*/}
          <div style={{textAlign : "left"}}><label className="form-control-label" htmlFor="email">Email</label>
          <Form.Control type="text" className="form-control mb-1" id="email" onChange={(e) =>{checkEmail(e,setEmail,setDisplayEmail,setEmailVal);}} 
          isInvalid={(displayEmailErr && (email != "valid")) ? "true" : undefined}
          isValid={(displayEmailErr && (email == "valid")) ? "true" : undefined}></Form.Control>
          
          {email == "invalid" ? <Form.Control.Feedback type="invalid">
              Email must be a valid email address </Form.Control.Feedback> : <Form.Control.Feedback type="invalid">
              Email is required </Form.Control.Feedback>}
          <Form.Control.Feedback type="valid">Looks good!</Form.Control.Feedback>
          </div>

          {/**User*/}
          <div style={{textAlign : "left"}}><label className="form-control-label" htmlFor="userName">Username</label>
          <Form.Control type="text" className="form-control mb-1" id="userName" onChange={(e) =>{checkUser(e,setUser,setDisplayUser,setUserVal, setUserExist);}} 
          isInvalid={(displayUserErr && (user != "valid")) ? "true" : undefined}
          autoComplete = "off"
          isValid={(displayUserErr && (user == "valid")) ? "true" : undefined}></Form.Control>
          {userExist? <Form.Control.Feedback type="invalid">This username is already taken!</Form.Control.Feedback> :
          <Form.Control.Feedback type="invalid">Username is required</Form.Control.Feedback>}
          <Form.Control.Feedback type="valid">Congrats! This username hasn't been used!</Form.Control.Feedback>
          </div>

        {/**Password*/}
        <div style={{textAlign : "left"}}><label className="form-control-label" htmlFor="password">Password</label>
          <Form.Control type="password" className="form-control mb-1" id="password" onChange={(e) =>{checkPass(e,setPass,setDisplayPass,setPassVal);}} 
          isInvalid={(displayPassErr && (pass != "valid")) ? "true" : undefined}
          isValid={(displayPassErr && (pass == "valid")) ? "true" : undefined}></Form.Control>
          <Form.Control.Feedback type="invalid">Password is required</Form.Control.Feedback>
          <Form.Control.Feedback type="valid">Looks good!</Form.Control.Feedback>
          </div>
        </div>
        
        <div className="text-center">
            <button type="button" class="btn btn-success my-3 mx-1" onClick={() => {setDisplayEmail(true); setDisplayUser(true);setDisplayPass(true);
            if(email === "valid" && user === "valid" && pass === "valid") {
                signUp(emailVal, userVal, passVal);
            }}}>Sign up</button>
            <Link class="btn btn-danger my-3 mx-1" to="/search">Cancel</Link>
        </div>
        </Form>
        </div>
        </div>
        </div>
    )
}


function checkEmail(e,setEmail,setDisplayEmail,setEmailVal) {
    setDisplayEmail(true);
    setEmailVal(e.target.value);
    if(e.target.value === "") {
      setEmail("empty");
    }

    else if(String(e.target.value)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )) {
      setEmail( "valid");
      
    }
    else {
      setEmail("invalid");
    }
  }

  function checkUser(e,setUser,setDisplayUser,setUserVal,setUserExist) {
    setDisplayUser(true);
    axios.get(base + `/checkUserExist/${e.target.value}`)
      .then((response) => {
        if(response.status === 201) {
          setUserExist(true)
          setDisplayUser(true)
          setUser("invalid")
        }
        if(response.status === 204) {
          setUserExist(false)
          setDisplayUser(true)
          setUser("valid")
        }
      }).catch((e) => {});
    setUserVal(e.target.value);
    if(e.target.value === "") {
      setUser("empty");
    }
    else {
      setUser("valid");
    }
  }

  function checkPass(e,setPass,setDisplayPass,setPassVal) {
    setDisplayPass(true);
    setPassVal(e.target.value);
    if(e.target.value === "") {
      setPass("empty");
    }
    else {
      setPass("valid");
    }
  }

  function signUp(email, user, password) {
    axios.post("/register",{
          email : email,
          username : user,
          password : password,
      })
          .then(function (response) {
            window.location="/search";
          })
          .catch(function (error) {
            console.log(error)
          })
  }

