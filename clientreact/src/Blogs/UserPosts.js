import * as React from "react";
import base from "../base.js";
import axios from "axios";
import {useState} from "react";
import ModalForConfirmation from "../ReusableModules/Confirmation";
import SuccessFeedback from "../ReusableModules/SuccessFeedback";



export default function UserPosts(props) {
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
    </tbody>
    </table>
    </div>
    </div>
    </React.Fragment>
    );
 }

