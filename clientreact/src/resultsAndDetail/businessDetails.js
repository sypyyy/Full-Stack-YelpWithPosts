import * as React from "react";

//import './detail.scss';
import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import axios from "axios";
import base from "../base.js"
import { Outlet, Link,useNavigate} from "react-router-dom";
import ModalForConfirmation from "../ReusableModules/Confirmation";
import ModalForSuccessFeedback from "../ReusableModules/SuccessFeedback";

let FinalDate = "";
let FinalEmail = "";

export default function BusinessDetails(props) {
  let details = props.details;
  const [Reserved, changeIfReservedTo] = React.useState(props.reservationInfo ? props.reservationInfo.reserved : false);
  const [keyForRefresh, refresh] = React.useState(true);
  const [showModal, setModal] = useState(false);
  const [showConfirmAgain, setShowConfirmTo] = useState(false);
  const [showSuccessModal, setShowSuccessTo] = useState(false);
  
  return (
      <div className="content " style={{flexGrow : 1}}>
          <div className="mt-5"></div>
          <DetailChart details = {props.details}/>
          <div className="text-center mb-4">
              {/**Cancel Button */}
            {Reserved ? 
            <button className="btn btn-danger mx-auto mb-4" onClick={() =>{
              setShowConfirmTo(true);
              }}>Cancel reservation</button>
            :
            
            <button type="button" onClick={()=>{setModal(true)}} className="btn btn-primary mx-auto mb-4">Reserve Now</button>

            }
            <ModalForConfirmation show = {showConfirmAgain} text = {"Are you sure you want to cancel this reservation?"}
            toggleSelf = {setShowConfirmTo}
             execution = {() => {
              axios.get(base + "/cancelReserve", {
                params : {
                  id : props.reservationInfo.reservationId,
                }
              }).then((response) => {
                if(response.data) {
                  setShowSuccessTo(true);
                  changeIfReservedTo(false);
                }
              }).catch((e)=>{})
            }}/>
            <ModalForSuccessFeedback text = {"Cancellation successful"} show = {showSuccessModal} toggleSelf = {setShowSuccessTo}/>
            <br/>
            {/**reserve */}
            {props.loggedIn ? <ReserveForm key={keyForRefresh} show = {showModal} setShow={setModal} keyForRefresh={keyForRefresh} name = {details.name} refresh = {refresh} switchButton={changeIfReservedTo} businessId = {details.id}/>
              :
            <ReserveLoginPrompt show = {showModal} setShow={setModal}/>
            }
            
            <div className="share mb-3" >
              <span className="me-2" style={{'display' :'inline-block'}}>Share on:</span>
              <a href={`https://twitter.com/intent/tweet?text=Check ${details.name.replace('|', ' ')} on Yelp.%0D%0A${details.url}`} target="_blank">
                <img className="icon" src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Twitter-logo.svg/1024px-Twitter-logo.svg.png?20220821125553"></img>
              </a>
              <a href={`https://www.facebook.com/dialog/share?app_id=1483150402158048&display=popup&href=${details.url}`} target="_blank">
                <img className="icon icon-2 ms-2" src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Facebook_F_icon.svg/640px-Facebook_F_icon.svg.png"></img>
              </a>
            </div>
            <ImageCarousel details = {details}/>
          </div>
          </div>
    )
}

function ReserveLoginPrompt(props) {
  const navigate = useNavigate();
  return (
      <Modal class="modal fade"   aria-hidden="true" show={props.show} backdrop="static" keyboard={false}>
          
              
                <div className="modal-header">
                    <h1 className="modal-title fs-5">Login required</h1>
                    <button type="button" className="btn-close" onClick={() =>{props.setShow(false)}} aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    Sorry But you need to login first to make a reservation!
                </div>
                <div class="modal-footer">
                    <button  className="btn btn-success"  onClick={() =>{props.setShow(false); navigate("/login")}}>Login</button>
                    <button  className="btn btn-primary" onClick={() =>{props.setShow(false); navigate("/register")}}>Register</button>
                </div>
         
      </Modal>
  );
}

function DetailChart(props) {
  let details = props.details;
  let list = {};
  let location = details.location;
  if(location && location.display_address) {
    let display_addr = location.display_address;
    let address = "";
    for(let addr of display_addr) {
      address += (addr + " ");
    }
    address = address.trim();
    if(address) {
      list.address = address;
    } else if(location.address1 && location.city && location.state && location.zip_code) {
      address = "";
      address += (location.address1 + " ");
      address += (location.address2 ? location.address2 + " " : "");
      address += (location.address3 ? location.address3 + " " : "");
      address += (location.city + " ");
      address += (location.state + " ");
      address += (location.zip_code);
      list.address = address;
    }
  }
  if(details.categories) {
    let categories = "";
    for(let category of details.categories) {
      if(category.title) {
        categories += (category.title + " | ");
      }
      else if(category.alias) {
        categories += (category.alias + " | ");
      }
    }
    categories = categories.slice(0, -3);
    if(categories) {
      list.categories = categories;
    }
  }
  if(details.display_phone) {
    list.phone = details.display_phone;
  } else if(details.phone) {
    list.phone = details.phone;
  }

  if(details.price) {
    list.price = details.price;
  }
  if(details.is_closed != null && details.is_closed != undefined && details.is_closed) {
    list.open  = false;
  } else if(details.hours) {
    for(let hours of details.hours) {
      if(hours.is_open_now != null && hours.is_open_now != undefined) {
        list.open = hours.is_open_now;
      }
    }
  }
  if(details.url) {
    list.url = details.url;
  }


  let chartList = [];
  if(list.address) {
    chartList.push(
    <div className="item text-center ">
      <b className="itemTitle">Address</b>
      <div className="itemContent">{list.address}</div>
    </div>)
  }
  if(list.categories) {
    chartList.push(
    <div class="item text-center ">
      <b className="itemTitle">Category</b>
      <div className="itemContent">{list.categories}</div>
    </div>)
  }

  if(list.phone) {
    chartList.push(
    <div class="item text-center ">
      <b className="itemTitle">Phone</b>
      <div className="itemContent">{list.phone}</div>
    </div>)
  }
  if(list.price) {
    chartList.push(
    <div class="item text-center ">
      <b className="itemTitle">Price range</b>
      <div className="itemContent">{list.price}</div>
    </div>)
  }
  if(list.open !=null && list.open != undefined) {
    chartList.push(
    <div class="item text-center ">
      <b className="itemTitle">Status</b>
      <div className="itemContent" style ={list.open? {color : 'green'} : {color : 'red'}}>  {list.open ? "Open Now" : "Closed"}</div>
    </div>)
  }
  if(list.url) {
    chartList.push(
    <div class="item text-center">
      <b className="itemTitle">Visit yelp for more</b>
      <div className="itemContent"><a href={list.url} target="_blank">Business link</a></div>
    </div >)
  }
    return(
    <div>
    <div class="example-container">
    <div class="myrow">
    {chartList}
    </div>
  </div>
  </div>
  )
}

function ImageCarousel(props) {
  const [rotate, startRotate] = React.useState(true);
  let list = [];
  let count = 0;
  for(let photo of props.details.photos) {
    if(photo) {
      count+= 1;
      list.push(<div className={count == 1? "carousel-item active" : "  carousel-item"} data-bs-interval="2000">
      <img src={photo} className= "d-block imgs mx-auto" alt="business_image"/>
    </div>)
    }
  }

  //I referenced this piece of code from: https://getbootstrap.com/docs/5.0/components/carousel/
  
  return <div id="carouselImg" class="carousel carousel-dark slide" data-bs-ride="carousel"  data-bs-interval="2000"><InnerImg list = {list} startRotate = {startRotate}/></div>;
  
  
}




function InnerImg(props) {
  return(
    <React.Fragment>
    <div class="carousel-inner text-center">
      {props.list}
    </div>
    <button   class="carousel-control-prev" type="button" data-bs-target="#carouselImg" data-bs-slide="prev">
       <span  onMouseDown =  {() => { props.startRotate(true); }} class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span   class="visually-hidden">Previous</span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#carouselImg" data-bs-slide="next">
      <span onMouseDown = {() => { props.startRotate(true);}} class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Next</span>
    </button>
    </React.Fragment>
  );
}
//RESERVE FORM
function  ReserveForm(props) {
  const [email, setEmail] = useState("empty");
  const [date, setDate] = useState("empty");
  const [hour, setHour] = useState("empty");
  const [minute, setMinute] = useState("empty");
  const [timeValid, setTimeValid] = useState(false);
  const [display, setDisplay] = useState(false);
  const [dateIsToday, setDateIsToday] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [successReserve, setSuccessReserve] = useState(false);
  /*I referenced this piece of code from: https://getbootstrap.com/docs/5.0/components/modal/*/
  {/**MODAL */}
 
  return (
    successReserve ? <ModalForSuccessFeedback text = {"Reservation created! You can check your reservations on My Bookings now!"} show = {props.show} toggleSelf = {props.setShow}
    execution = {() => {props.setShow(false); props.refresh(!props.keyForRefresh)}}/>
    :
    <Modal id="ReserveForm" show={props.show} backdrop="static" keyboard={false} >
      <Modal.Header className="">
        <h4 class="modal-title" id="staticBackdropLabel">Reservation form</h4>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-2 text-center"><span className="mx-auto" style = {{fontWeight : "500", fontSize: "18px"}}>{props.name}</span></div>
        <Form noValidate onSubmit={(e)=>{e.preventDefault()}}>
        <div className="">
          {/**Email*/}
          <div style={{textAlign : "left"}}><label className="form-control-label" htmlFor="email">Email</label>
          {(display && (email != "valid"))? <Form.Control type="text" className="form-control" id="email" onChange={(e) =>{checkEmail(e,setEmail);}} isInvalid="true"></Form.Control>
          : <Form.Control type="text" className="form-control" id="email" onChange={(e) =>{checkEmail(e,setEmail)}}></Form.Control>}
          {email == "invalid" ? <Form.Control.Feedback type="invalid">
              Email must be a valid email address </Form.Control.Feedback> : <Form.Control.Feedback type="invalid">
              Email is required </Form.Control.Feedback>}
          </div>
        </div>

        <div className="">
          {/**Date*/}
          <div style={{textAlign : "left"}}><label className="form-control-label" htmlFor="date">Date</label>
          {(display && (date != "valid"))?<Form.Control type="date" className="form-control" id="date" isInvalid onClick={disablePastDate} onChange={(e) => {checkDate(e,setDate,setDateIsToday,hour,minute,setTimeValid)}}></Form.Control>
          : <Form.Control type="date" className="form-control" id="date" onClick={disablePastDate} onChange={(e) => {checkDate(e,setDate,setDateIsToday,hour,minute,setTimeValid)}}></Form.Control>}
          <Form.Control.Feedback type="invalid">Date is required </Form.Control.Feedback>
        </div>
        </div>
        <div style={{textAlign : "left"}} className="mb-3">
        <div ><label className="form-control-label" htmlFor="hour">Time</label></div>
           {/**Time*/}
          {(display && ((hour !== "empty" && minute!== "empty" && (!timeValid)) || (hour === "empty"))) ? <Form.Select  isInvalid  className="form-select w-25"style={{marginRight: "0px !important", display:"inline-block"}} id="hour" onChange={(e) => {checkTime(e,setTimeValid,setHour,minute,hour,dateIsToday,"hour")}}>
          <HourOptions/>
          </Form.Select> : 
           <Form.Select className="form-select w-25" style={{marginRight: "0px !important", display:"inline-block"}} id="hour" onChange={(e) => {checkTime(e,setTimeValid,setHour,minute,hour,dateIsToday,"hour")}}>
           <HourOptions/>
           </Form.Select>}
          <span> : </span>
          {(display && ((hour !== "empty" && minute!== "empty" && (!timeValid)) || (minute === "empty")))? <Form.Select isInvalid className="form-select w-25" style={{marginRight: "0px !important", display:"inline-block"}} id="minute"onChange={(e) => {checkTime(e,setTimeValid,setMinute,minute,hour,dateIsToday, "minute")}} >
          <option style={{display:"none"}} selected></option>
          <option >00</option>
          <option> 15</option>
          <option >30</option>
          <option >45</option>
          </Form.Select> :
           <Form.Select className="form-select w-25" style={{marginRight: "0px !important", display:"inline-block"}} id="minute"onChange={(e) => {checkTime(e,setTimeValid,setMinute,minute,hour,dateIsToday, "minute")}} >
           <option style={{display:"none"}} selected></option>
           <option >00</option>
           <option> 15</option>
           <option >30</option>
           <option >45</option>
           </Form.Select>}
          <img className = "clockImg" src="https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji/color/svg/1F554.svg"/>
          {(hour !== "empty" && minute!== "empty" && (!timeValid)) ? <Form.Control.Feedback type="invalid">You cannot choose a time in the past</Form.Control.Feedback>
          : <Form.Control.Feedback type="invalid">Time is required</Form.Control.Feedback> }
        </div>
        {/**Submit */}
        {spinner ? <div class="spinner-border text-dark" role="status">
        <span class="visually-hidden"></span>
        </div> : 
        <div className="text-center"><button type="button" class="btn btn-danger" onClick={() =>{setDisplay(true);SubmitIfValid(email,date,hour,minute,timeValid,FinalDate,FinalEmail,props.name,props.switchButton,props.businessId,setSpinner,setSuccessReserve)}}>Submit</button>
        </div>
        }
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <button type="button" class="btn btn-dark" data-bs-dismiss="modal" onClick={() => {props.setShow(false); props.refresh(!props.keyForRefresh);}}>Close</button>
      </Modal.Footer>
</Modal>
  )
}

function HourOptions() {
  return(
    <React.Fragment>
    <option selected style={{display : "none"}} ></option>
    <option>10</option>
    <option>11</option>
    <option>12</option>
    <option>13</option>
    <option>14</option>
    <option>15</option>
    <option>16</option>
    <option>17</option>
    </React.Fragment>
  )
}

function checkTime(e,setTimeValid,set,minute,hour,dateIsToday,hourOrMinute) {
  set(e.target.value)
  if(!dateIsToday) {
    setTimeValid(true);
  }
  else {
    if(hourOrMinute === "hour") {
      hour = e.target.value;
    }
    else {
      minute = e.target.value;
    }
    checkTimeValid(hour,minute,setTimeValid);
  }
}
function checkEmail(e,setEmail) {
  FinalEmail = e.target.value;
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

function disablePastDate(e) {
  let Today = new Date();
    let month = Today.getMonth() + 1;
    let day = Today.getDate();
    let year = Today.getFullYear();
    if(month < 10)
        month = '0' + month.toString();
    if(day < 10)
        day = '0' + day.toString();
    var maxDate = year + '-' + month + '-' + day;
  e.target.min = maxDate;
}



function checkTimeValid(hour,minute,setTimeValid) {
  if(hour!=="empty" && minute!="empty"){
    let setTime = new Date();
    setTime.setHours(hour);
    setTime.setMinutes(minute);
    setTime.setSeconds(0);
    
    let now = new Date();
    if(setTime <= now) {
      setTimeValid(false);
    }
    else {
      setTimeValid(true);
    }
  }
  
}


function checkDate(e,setDate,setDateIsToday,hour,minute,setTimeValid){
  FinalDate = e.target.value;
  if(e.target.value === "") {
    setDate("empty");
  }
  else{
    setDate("valid");
    let Today = new Date();
    let year = Today.getFullYear();
    let month = Today.getMonth() + 1;
    let day = Today.getDate();
    let ChosenDate = e.target.value.split("-");
    if(ChosenDate[0] == year && ChosenDate[1] == month && ChosenDate[2] == day) {
      setDateIsToday(true);
      checkTimeValid(hour,minute,setTimeValid);
    }
    else {
      setDateIsToday(false);
      setTimeValid(true);
    }
  }
}

function SubmitIfValid(email,date,hour,minute,timeValid,FinalDate,FinalEmail,name,switchButton,Id,setSpinner,setSuccessReserve){
  if(email === "valid" && date ==="valid" && hour !=="empty" && minute !=="empty" && timeValid) {
    setSpinner(true);
    axios.get(base+"/reserve",{
      params: {
        businessName: name,
        businessId : Id,
        email : FinalEmail,
        date : FinalDate,
        hour : hour,
        min : minute,
      }
    })
    .then((response) => {
      if(response.data) {
        switchButton(true);
        setSuccessReserve(true);
      } 
      
    })
    
  }
}
