import * as React from "react";
import { Routes, Route, Outlet, Link,useNavigate} from "react-router-dom";
//import './_NavBar.scss';
import SearchForm from "../searchForm/searchForm.js"
import LoginForm from "../LoginAndRegister/Login";
import RegisterForm from "../LoginAndRegister/Register";
import base from "../base";
import axios from "axios";
import NavBar from "./NavBar"
import BookingTable from "../BookingsPage/bookings";
import UserPosts from "../Blogs/UserPosts";
import AllPosts from "../Blogs/AllPosts";




export const Rou = Routing;






function Routing() {
  const [showGoodbye, setGoodbye] = React.useState(false);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [asked, setAsked] = React.useState(false);
  const [username, setUsername] = React.useState(" ");
  const [theme, setTheme] = React.useState("light");
  const [postsRelatedRefreshKey, setPostsRelatedRefreshKey] = React.useState(false);
  const spacer = 70;
  if(!asked) {
    axios.get(base + "/isLoggedIn")
      .then((response) => {
          setLoggedIn(response.data.loggedIn);
          if(response.data.loggedIn) {
            setUsername(response.data.username);
          }
      })
      .catch((e) => {

      });
      setAsked(true);
  }
  const operations = {setLoggedIn : setLoggedIn, setGoodbye : setGoodbye, setTheme : setTheme, refreshPostsRelatedFields : _refreshPostsRelatedFields }
  const attributes = {loggedIn : loggedIn, showGoodbye : showGoodbye, username : username, spacer : spacer, theme : theme, postsRelatedRefreshKey : postsRelatedRefreshKey};
  return (
    <div className="wholeBody">
      <Routes>
        <Route path="/search" element={<Search operations={operations} attributes = {attributes}/>} />
        <Route path="/bookings" element={<Bookings operations={operations} attributes = {attributes}/>} />
        <Route path="/register" element={<Register operations={operations} attributes = {attributes}/>} />
        <Route path="/login" element={<Login showErr = {false} key={true} operations={operations} attributes = {attributes}/>} />
        <Route path="/loginFail" element={<Login showErr ={true} key={false}  operations={operations} attributes = {attributes}/>} />
        <Route path="/posts" element={<Posts showErr ={true} key={false}  operations={operations} attributes = {attributes}/>} />
        <Route path="/" element={<Search operations={operations} attributes = {attributes}/>}/>
        <Route path="*" element={<NoMatch operations={operations} attributes = {attributes}/>}/>
      </Routes>
      <div className="bgHero"/>
    </div>
  );


  function _refreshPostsRelatedFields() {
    setPostsRelatedRefreshKey(!postsRelatedRefreshKey);
  }

}


function Register() {
  return <RegisterForm/>;
}

function Search(props) {
  const[key, refresh] = React.useState(true);
  const CurNavBar = NavBar(0,props);
  return (
    <div>
      {CurNavBar}
      
      <div>
        <div style={{height : props.attributes.spacer + "px"}}></div>
        <SearchForm key = {key} refreshKey = {key} refresh={refresh} loggedIn={props.attributes.loggedIn} 
        theme={props.attributes.theme}/>
      </div>
    </div>
  );
}

function Posts(props) {
  const [Toggle, refresh] = React.useState(false);
  const CurNavBar = NavBar(1,props);
  return (
    <div>
      {CurNavBar}
      <div>
      <div style={{height : props.attributes.spacer + "px"}}></div>
       <AllPosts key={props.attributes.postsRelatedRefreshKey} loggedIn={props.attributes.loggedIn} username={props.attributes.username}
       refreshPostsRelatedFields={props.operations.refreshPostsRelatedFields}/>
      </div>
    </div>
  );
}





function Bookings(props) {
  const [Toggle, refresh] = React.useState(false);
  const CurNavBar = NavBar(2,props);
  return (
    <div>
      {CurNavBar}
      <div>
      <div style={{height : props.attributes.spacer + "px"}}></div>
        <BookingTable key={Toggle} refreshKey={Toggle} refresh = {refresh}/>
        
      </div>
    </div>
  );
}


function NoMatch(props) {
  return (
    <div>
      <div style={{height : props.attributes.spacer + "px"}}></div>
      <h2>Oooops! Nothing to see here!</h2>
      <p>
        <Link to="/search">Go to the search page</Link>
        <br/>
        <Link to="/bookings">Go to the booking page</Link>
      </p>
    </div>
  );
}

function Login(props) {
  const CurNavBar = NavBar(3,props);
  return (
    <div>
      {CurNavBar}
      <div style={{height : props.attributes.spacer + "px"}}></div>
      <LoginForm showErr = {props.showErr}/>
    </div>
  );
}


















