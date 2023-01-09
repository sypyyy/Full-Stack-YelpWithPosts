import React from 'react';

//import './Login.scss';
import { useState,useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import axios from "axios";
import base from "../base";
import { Routes, Route, Outlet, Link } from "react-router-dom";


export default function Login(props) {
  const [email, setEmail] = useState("empty");
  const [user, setUser] = useState("empty");
  const [pass, setPass] = useState("empty");
  const [displayPassErr, setDisplayPass] = useState(false);
  const [displayUserErr, setDisplayUser] = useState(false);
  const [displayErrMsg, setDisplayMsg] = useState(props.showErr);
  const [userExist, setUserExist] = useState(false);
  /*I referenced this piece of code from: https://getbootstrap.com/docs/5.0/components/modal/*/
    // Update the document title using the browser API
  //setDisplayMsg(props.showErr)
  
  return (
        <div>
        <div style={{height : "50px"}}></div>
        <div className="card LoginAndRegister mx-auto text-center">
        
        <div style = {{width : "95%"}} className="mx-auto">
        <h5 className="mt-3 mb-3">Login</h5>
        {displayErrMsg && <div className="LoginErr">Incorrect username or password!</div>}
        <Form noValidate action={base + "/login"} method="post" onSubmit={(e)=>{handleSubmit(e,user,pass)}}>
        <div className="">
        <div></div>
          {/**User*/}
          <div style={{textAlign : "left"}}><label className="form-control-label" htmlFor="userName">Username</label>
          <Form.Control type="text" className="form-control" id="userName" name="username" onChange={(e) =>{checkUser(e,setUser,setDisplayUser);}} 
          isInvalid={(displayUserErr && (user != "valid")) ? "true" : undefined} autoComplete="off"></Form.Control>
          {userExist? <Form.Control.Feedback type="invalid">This username is already taken!</Form.Control.Feedback> :
          <Form.Control.Feedback type="invalid">Username is required</Form.Control.Feedback>}
          </div>
          <div className="my-2"></div>

        {/**Password*/}
        <div style={{textAlign : "left"}}><label className="form-control-label" htmlFor="password">Password</label>
          <Form.Control type="password" className="form-control" id="password" name="password" onChange={(e) =>{checkPass(e,setPass,setDisplayPass);}} 
          isInvalid={(displayPassErr && (pass != "valid")) ? "true" : undefined}></Form.Control>
          <Form.Control.Feedback type="invalid">Password is required</Form.Control.Feedback>
          <Form.Control.Feedback type="valid">Looks good!</Form.Control.Feedback>
          </div>
        </div>
        <div className="my-2"></div>

        <div className="text-center">
            <button type="submit" className = "btn btn-success my-3 mx-2" onClick={() => {setDisplayUser(true); setDisplayPass(true);
            }}>Sign in</button>
            
              <Link className="btn btn-danger my-3 mx-2" to="/search">Cancel</Link>
              <Outlet/>
              <div className="mb-3">
                Don't have an account yet? Sign up right now! <Link to="/register">Sign up</Link>
              <Outlet/>
              </div>
        </div>
        </Form>
        </div>
        </div>
        </div>
    )
}


function handleSubmit(e,user,pass) {
    if((user !== "valid") || (pass !== "valid")) {
        e.preventDefault();
    }
    else {
        //setAsked(false);
        e.submit();
    }

}


  function checkUser(e,setUser,setDisplayUser) {
    setDisplayUser(true);
    
    if(e.target.value === "") {
      setUser("empty");
    }
    else {
      setUser("valid");
    }
  }

  function checkPass(e,setPass,setDisplayPass) {
    setDisplayPass(true);
    
    if(e.target.value === "") {
      setPass("empty");
    }
    else {
      setPass("valid");
    }
  }

