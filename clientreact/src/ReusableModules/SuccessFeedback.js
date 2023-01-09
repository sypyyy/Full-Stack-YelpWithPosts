import * as React from "react";

import Modal from 'react-bootstrap/Modal';

export default function SuccessFeedback(props) {
    return (
        <Modal class="modal fade"   aria-hidden="true" show={props.show} backdrop="static" keyboard={false}>
          
              
            <div className="modal-header">
                <h1 className="modal-title fs-5">Operation Successful!</h1>
                <button type="button" className="btn-close" onClick={() =>{props.toggleSelf(false); if(props.execution) {props.execution()}}} aria-label="Close"></button>
            </div>
            <div class="modal-body">
                {props.text}
            </div>
            <div class="modal-footer">
                <button  className="btn btn-success"  onClick={() =>{props.toggleSelf(false); if(props.execution) {props.execution()}}}>OK</button>
            </div>
         
      </Modal>
    )
}