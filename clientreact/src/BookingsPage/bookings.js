import * as React from "react";
//import './bookings.scss';
import base from "../base.js";
import axios from "axios";
import {useState} from "react";
import ModalForConfirmation from "../ReusableModules/Confirmation";
import SuccessFeedback from "../ReusableModules/SuccessFeedback";


export default function BookingTable(props) {
    const [NoReservation, setNoReservation] = useState(true);
    const [reservations, saveReservations] = useState([]);
    const [asked, setAsked] = useState(false);
    const [spinner, setSpinner] = useState(true);
    if(!asked) {
      axios.get(base + "/getBookings")
        .then((response) => {
            let reservations = response.data.reservations;
            saveReservations(reservations);
            setNoReservation(reservations.length === 0);
            setSpinner(false);
        }).catch((e) => {});
        setAsked(true);
    }

    if(spinner) {
      return <div style = {{height : "50px"}} className="text-center"><div class="spinner-border text-dark" role="status">
    </div></div>
    }
      
    

    return(
      <React.Fragment>
      {NoReservation ? <NoResult/>
      : 
      <div className="text-center">
        <h5 className="bookingTitle">List of your reservations</h5>
      <div className="mx-auto BookingTable table-responsive-md">
      <table className="table mb-0 ">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Business Name</th>
          <th scope="col">Date</th>
          <th scope="col">Time</th>
          <th scope="col">Email</th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody>
      <Reservations  reservations = {reservations} refreshKey={props.refreshKey} refresh = {props.refresh}/>
    </tbody>
    </table>
    </div>
    </div>
    }
    </React.Fragment>
    );
 }

  function NoResult() {
    return <div className="text-center"><span style={{color:"red"}} className="NoReservations mx-auto">You don't have any reservations yet!</span></div>
  }
  
  function Reservations(props) {
    let list = [];
    let reservations = props.reservations;
    ///////
    //reservations = JSON.parse(reservations);
    let count = 1;
    for(let reservation of reservations) {
      list.push(
        <Reservation reservation = {reservation} count = {count} refreshKey={props.refreshKey} refresh = {props.refresh}/>
        )
        count++;
    }
    return list;
  }
 
  function Reservation(props) {
    const [showFeedback, setShowFeedback] = useState(false);
    const [showConfirmAgain, setShowConfirmTo] = useState(false);
    const reservation = props.reservation;
    return(
      <tr className="reservationRow">
        <td>{props.count}</td>
        <td>{reservation.businessName}</td>
        <td>{reservation.date}</td>
        <td>{reservation.hour}:{reservation.min}</td>
        <td style={{wordBreak : "keep-all"}}>{reservation.email} </td>
        <td><svg className="deleteIcon" 
            onClick={() =>
                    {
                      setShowConfirmTo(true);
                    }}
        xmlns="http://www.w3.org/2000/svg" width="16px" height="19px" viewBox="0 0 20 22" version="1.1">
        <g>
          <path d="M 0 6.1875 L 0 4.683594 C 0.03125 4.140625 0.253906 3.683594 0.667969 3.308594 C 1.085938 2.9375 1.578125 2.75 2.144531 2.75 L 4.285156 2.75 L 4.285156 2.0625 C 4.285156 1.492188 4.492188 1.003906 4.910156 0.601562 C 5.328125 0.203125 5.832031 0 6.429688 0 L 13.570312 0 C 14.164062 0 14.671875 0.203125 15.089844 0.601562 C 15.503906 1.003906 15.714844 1.492188 15.714844 2.0625 L 15.714844 2.75 L 17.855469 2.75 C 18.421875 2.75 18.914062 2.9375 19.328125 3.308594 C 19.746094 3.683594 19.96875 4.140625 20 4.683594 L 20 6.1875 C 20 6.5625 19.855469 6.882812 19.574219 7.15625 C 19.292969 7.425781 18.957031 7.5625 18.570312 7.5625 L 18.570312 19.25 C 18.570312 20.023438 18.296875 20.675781 17.746094 21.207031 C 17.195312 21.734375 16.515625 22 15.714844 22 L 4.285156 22 C 3.480469 22 2.804688 21.734375 2.253906 21.207031 C 1.703125 20.675781 1.429688 20.023438 1.429688 19.25 L 1.429688 7.5625 C 1.042969 7.5625 0.707031 7.425781 0.425781 7.15625 C 0.140625 6.882812 0 6.5625 0 6.1875 Z M 1.429688 6.1875 L 18.570312 6.1875 L 18.570312 4.8125 C 18.570312 4.613281 18.503906 4.449219 18.371094 4.320312 C 18.234375 4.191406 18.0625 4.125 17.855469 4.125 L 2.144531 4.125 C 1.933594 4.125 1.761719 4.191406 1.628906 4.320312 C 1.496094 4.449219 1.429688 4.613281 1.429688 4.8125 Z M 2.855469 19.25 C 2.855469 19.621094 3 19.945312 3.28125 20.21875 C 3.5625 20.488281 3.898438 20.625 4.285156 20.625 L 15.714844 20.625 C 16.101562 20.625 16.433594 20.488281 16.71875 20.21875 C 17 19.945312 17.140625 19.621094 17.140625 19.25 L 17.140625 7.5625 L 2.855469 7.5625 Z M 4.285156 18.5625 L 4.285156 9.625 C 4.285156 9.425781 4.351562 9.261719 4.488281 9.132812 C 4.621094 9.003906 4.792969 8.9375 5 8.9375 L 6.429688 8.9375 C 6.636719 8.9375 6.808594 9.003906 6.941406 9.132812 C 7.074219 9.261719 7.140625 9.425781 7.140625 9.625 L 7.140625 18.5625 C 7.140625 18.761719 7.074219 18.929688 6.941406 19.058594 C 6.808594 19.1875 6.636719 19.25 6.429688 19.25 L 5 19.25 C 4.792969 19.25 4.621094 19.1875 4.488281 19.058594 C 4.351562 18.929688 4.285156 18.761719 4.285156 18.5625 Z M 5 18.5625 L 6.429688 18.5625 L 6.429688 9.625 L 5 9.625 Z M 5.714844 2.75 L 14.285156 2.75 L 14.285156 2.0625 C 14.285156 1.863281 14.21875 1.699219 14.082031 1.570312 C 13.949219 1.441406 13.777344 1.375 13.570312 1.375 L 6.429688 1.375 C 6.21875 1.375 6.046875 1.441406 5.914062 1.570312 C 5.78125 1.699219 5.714844 1.863281 5.714844 2.0625 Z M 8.570312 18.5625 L 8.570312 9.625 C 8.570312 9.425781 8.636719 9.261719 8.773438 9.132812 C 8.90625 9.003906 9.078125 8.9375 9.285156 8.9375 L 10.714844 8.9375 C 10.921875 8.9375 11.09375 9.003906 11.226562 9.132812 C 11.359375 9.261719 11.429688 9.425781 11.429688 9.625 L 11.429688 18.5625 C 11.429688 18.761719 11.359375 18.929688 11.226562 19.058594 C 11.09375 19.1875 10.921875 19.25 10.714844 19.25 L 9.285156 19.25 C 9.078125 19.25 8.90625 19.1875 8.773438 19.058594 C 8.636719 18.929688 8.570312 18.761719 8.570312 18.5625 Z M 9.285156 18.5625 L 10.714844 18.5625 L 10.714844 9.625 L 9.285156 9.625 Z M 12.855469 18.5625 L 12.855469 9.625 C 12.855469 9.425781 12.921875 9.261719 13.058594 9.132812 C 13.191406 9.003906 13.363281 8.9375 13.570312 8.9375 L 15 8.9375 C 15.207031 8.9375 15.378906 9.003906 15.511719 9.132812 C 15.644531 9.261719 15.714844 9.425781 15.714844 9.625 L 15.714844 18.5625 C 15.714844 18.761719 15.644531 18.929688 15.511719 19.058594 C 15.378906 19.1875 15.207031 19.25 15 19.25 L 13.570312 19.25 C 13.363281 19.25 13.191406 19.1875 13.058594 19.058594 C 12.921875 18.929688 12.855469 18.761719 12.855469 18.5625 Z M 13.570312 18.5625 L 15 18.5625 L 15 9.625 L 13.570312 9.625 Z M 13.570312 18.5625 "/>
        </g>
      </svg>
      {/**Modals */}
      <SuccessFeedback text="Cancellation successful!" show = {showFeedback} toggleSelf = {setShowFeedback} execution = {() => {props.refresh(!props.refreshKey);}}/>
      <ModalForConfirmation show = {showConfirmAgain} text = {"Are you sure you want to cancel this reservation?"}
            toggleSelf = {setShowConfirmTo}
             execution = {() => {
              axios.get(base + "/cancelReserve", {
                params : {
                  id : props.reservation._id,
                }
              }).then((response) => {
                if(response.data) {
                  setShowFeedback(true);
                  
                } 
              }).catch((e) => {});
            }}/>
      </td>
    </tr>
    );
  }