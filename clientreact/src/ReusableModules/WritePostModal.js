import * as React from "react";
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import SubmitButton from "../ReusableModules/submitButton";
import axios from "axios";
import base from "../base"
import SuccessFeedback from "./SuccessFeedback";



export default function WritePost(props) {
   const [name, setName] = React.useState(props.name);
   const [location, setLocation] = React.useState(props.location);
   const [rating,setRating] = React.useState(2.5);
   const [content, setContent] = React.useState("");
   const [imageFile, setImageFile] = React.useState(null);

   const [spinner,setSpinner] = React.useState(false);
   
   const [nameInvalid,setNameInvalid] = React.useState(false);
   const [locationInvalid,setLocationInvalid] = React.useState(false);
   const [contentInvalid,setContentInvalid] = React.useState(false);
   const [showSuccess, setShowSuccess] = React.useState(false);
   
    return (
      
<div>
<Modal class="modal fade" aria-hidden="true" show={props.show} backdrop="static" keyboard={false}>           
<div className="modal-header">
    <h1 className="modal-title fs-5">Create a post</h1>
    <button type="button" className="btn-close" onClick={() =>{props.toggleSelf(false); if(props.execution) {props.execution()}}} aria-label="Close"></button>
</div>
<div class="modal-body">
   <Form noValidate onSubmit={(e)=>{e.preventDefault()}}>
      
      <label className="form-control-label" htmlFor="write_post_business_name" >Business name</label>
      <Form.Control isInvalid={nameInvalid ? "true" : undefined} type="text" className="form-control" id="write_post_business_name" autoComplete="off" 
      value={name} onChange={(e) => {setName(e.target.value)}}></Form.Control>
      <label className="form-control-label" htmlFor="write_post_location">Location</label>
      <Form.Control isInvalid={locationInvalid ? "true" : undefined}  type="text" className="form-control" id="write_post_location" autoComplete="off" 
      value={location} onChange={(e) => {setLocation(e.target.value)}}></Form.Control>
      <div className="ratingStars">
      <label className="form-control-label" htmlFor="write_post_rating">Rating</label>
      <Rating name="half-rating"  precision={0.5} onChange={(event, newValue) => {setRating(newValue);}} value={rating}/>
      </div>
      <label className="form-control-label" htmlFor="write_post_content">Content</label>
      <Form.Control isInvalid={contentInvalid ? "true" : undefined}  type="text" className="form-control mb-1" id="write_post_content" autoComplete="off" 
       onChange={(e) => {setContent(e.target.value)}}
       rows={3} as="textarea" ></Form.Control>
       <label className="form-control-label" htmlFor="write_post_images" >Upload images (Optional)</label>
      <Form.Control type="file" className="form-control" id="write_post_business_name" autoComplete="off"
      onChange={(e) => {setImageFile(e.target.files[0])}}
      accept="image/png, image/jpeg" name="image"></Form.Control>
   </Form>
   <div className="text-center mt-3"><SubmitButton text="Submit" spinner = {spinner} execution={()=>{validateAndSubmit();}}/></div>
</div>
<div class="modal-footer">
    <button  className="btn btn-dark"  onClick={() =>{props.toggleSelf(false); if(props.execution) {props.execution()}}}>Cancel</button>
</div>

</Modal>
<SuccessFeedback text = {`Your post have been uploaded! check it out in "All Posts"!`} show = {showSuccess} toggleSelf={setShowSuccess}
execution={()=>{props.refreshPostsRelatedFields();}}/>
</div>
)


    function validateAndSubmit() {
      setSpinner(true);
      if(validate()) {
         let form = new FormData();
         form.append("image", imageFile);
         form.append("content", content);
         form.append("rating", rating);
         form.append("name", name);
         form.append("location", location);
         axios.post(base + "/writePost",form)
            .then(() => {
               
               props.toggleSelf(false)
               setSpinner(false);
               setShowSuccess(true);
            }).catch((e) => {
               console.log(e);
            })
      };

    }

    function validate() {
      let result = true;
      if(!name) {
         setNameInvalid(true);
         result = false;
      } else {
         setNameInvalid(false);
      }
      if(!location) {
         setLocationInvalid(true);
         result = false
      } else {
         setLocationInvalid(false);
      }
      if(!content) {
         setContentInvalid(true);
         result = false;
      } else {
         setContentInvalid(false);
      }
      return result;
    }
}

/**
 * <Modal id="ReserveForm" show={props.show} backdrop="static" keyboard={false} >
       
      <Modal.Header className="">
        <h4 class="modal-title" id="staticBackdropLabel">Reservation form</h4>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-2 text-center"><span className="mx-auto" style = {{fontWeight : "500", fontSize: "18px"}}>{props.name}</span></div>
        <Form noValidate onSubmit={(e)=>{e.preventDefault()}}>
        <div className="">
      
          <div style={{textAlign : "left"}}><label className="form-control-label" htmlFor="email">Email</label>
          {(display && (email != "valid"))? <Form.Control type="text" className="form-control" id="email" onChange={(e) =>{checkEmail(e,setEmail);}} isInvalid="true"></Form.Control>
          : <Form.Control type="text" className="form-control" id="email" onChange={(e) =>{checkEmail(e,setEmail)}}></Form.Control>}
          {email == "invalid" ? <Form.Control.Feedback type="invalid">
              Email must be a valid email address </Form.Control.Feedback> : <Form.Control.Feedback type="invalid">
              Email is required </Form.Control.Feedback>}
          </div>
        </div>

        <div className="">
     
          <div style={{textAlign : "left"}}><label className="form-control-label" htmlFor="date">Date</label>
          {(display && (date != "valid"))?<Form.Control type="date" className="form-control" id="date" isInvalid onClick={disablePastDate} onChange={(e) => {checkDate(e,setDate,setDateIsToday,hour,minute,setTimeValid)}}></Form.Control>
          : <Form.Control type="date" className="form-control" id="date" onClick={disablePastDate} onChange={(e) => {checkDate(e,setDate,setDateIsToday,hour,minute,setTimeValid)}}></Form.Control>}
          <Form.Control.Feedback type="invalid">Date is required </Form.Control.Feedback>
        </div>
        </div>
        <div style={{textAlign : "left"}} className="mb-3">
        <div ><label className="form-control-label" htmlFor="hour">Time</label></div>
     
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
 */