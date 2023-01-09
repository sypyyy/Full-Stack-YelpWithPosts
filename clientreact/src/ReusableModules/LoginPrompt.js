import * as React from "react";
import {useNavigate} from "react-router-dom";
import Modal from 'react-bootstrap/Modal';


export default function LoginModal(props) {
   const navigate = useNavigate();
   return (
       <Modal className="modal fade" show = {props.show} aria-hidden="true" backdrop="static" keyboard={false}>
          
               <div className="modal-header">
                   <h1 className="modal-title fs-5">Login required</h1>
                   <button type="button" className="btn-close" onClick={() => {props.toggleSelf(false)}} aria-label="Close"></button>
               </div>
               <div className="modal-body">
                  {props.text}
               </div>
               
               <div className="modal-footer">
                   <button  className="btn btn-success" data-bs-dismiss="modal" onClick={() =>{navigate("/login"); props.toggleSelf(false)}}>Login</button>
                   <button  className="btn btn-primary" data-bs-dismiss="modal" onClick={() =>{navigate("/register"); props.toggleSelf(false)}}>Register</button>
               </div>
       </Modal>
   )
 }