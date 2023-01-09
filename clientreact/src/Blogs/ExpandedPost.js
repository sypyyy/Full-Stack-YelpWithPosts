import * as React from "react";
import Modal from 'react-bootstrap/Modal';
//import './ExpandedPost.scss'
import BackButton from "../ReusableModules/backButton";
import Rating from '@mui/material/Rating';
import LoginModal from "../ReusableModules/LoginPrompt";
import axios from "axios"
import base from "../base";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Confirmation from "../ReusableModules/Confirmation";
import SubmitButton from "../ReusableModules/submitButton";
export default function ExpandedPost(props) {
   const [post, setPost] = React.useState({});
   const [commentInput, setCommentInput] = React.useState("");
   const [commentSpinner, setCommentSpinner] = React.useState(false);
   const [showInvalid, setShowInvalid] = React.useState(false);
   const [commentSectionKey, setCommentSectionKey] = React.useState(false);
   const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
   React.useEffect(()=>{
      for(let thePost of props.posts) {
         if(thePost._id === props.activePostId) {
            setPost(thePost);
         }
      }
   },[props.show])
   
   return (
         
         <div>
         <Confirmation text="Are you sure you want to delete this post?" show={showDeleteConfirm} execution={()=>{
            deleteThisPost(props,post);
         }} toggleSelf={setShowDeleteConfirm}/>
         <Modal className="modal-lg fade"   aria-hidden="true" show={props.show} backdrop="static" keyboard={false}>
         <div className="modal-header">
            <BackButton execution={() => {props.toggleSelf(false); setShowInvalid(false); setCommentSpinner(false)}}/>
            {(props.loggedIn && post.username === props.username) &&
            <div className="btn btn-danger" onClick={()=>{
               setShowDeleteConfirm(true);
            }}>Delete</div>}
         </div>
         <div class="modal-body ">
            <div className="text-center mb-2">      
            {post.image == "" ? <div className=""/> : <img src={post.image} className="postImgExpand"/>}
         </div>
         
         <div className="mb-0 postTitle">{post.businessName}</div>
         {post.location && <div className="mb-0 postAddr">{post.location}</div>}
         <div className=" mb-0">{post.content}</div>
         <Rating name="half-rating"  precision={0.5} readOnly value={Number(post.rating)}/>
         <div className=" mb-0">Posted by: {post.username}</div>
         <div className=" mb-0">{post.time}</div>
         </div>
         <div className="modal-footer">
            {/**Comment*/}
            {!props.loggedIn && <label>Login to comment</label>}
            <InputGroup className="mb-3">
               <Form.Control as="textarea" autoComplete="off" type="text" 
                isInvalid={(showInvalid && !commentInput) ? "true" : undefined} 
                value={commentInput}
                onChange={(e)=>{
                  setCommentInput(e.target.value);
                  setShowInvalid(true);
               }}/>
               <InputGroup.Text>
               <SubmitButton text="Submit" spinner={commentSpinner} 
                  execution={() =>{leaveComment(setCommentSpinner, commentInput, 
                  ()=>{setCommentSectionKey(!commentSectionKey)},post._id, props.loggedIn,setShowInvalid,setCommentInput);}}/>
               </InputGroup.Text>
            </InputGroup>
            
         </div>
         <div className="modal-footer py-0"></div>
         <div className="modal-body">
            <CommentSection key={commentSectionKey} targetPostId={props.activePostId}/>
         </div>
         </Modal>
         </div>


   )

 }

 function findPost(posts,id) {
   for(let thePost of posts) {
      if(thePost._id === id) {
         return thePost;
      }
   }
 }

function CommentSection(props) {
   const [asked, setAsked] = React.useState(false);
   const [comments, setComments] = React.useState([]);
   
   React.useEffect(()=>{
      if(!asked) {
         axios.get(base + `/getComments/${props.targetPostId}`)
            .then((response)=>{
               
               setComments(response.data);
               setAsked(true);
            }).catch((e)=>{});
      }
   },[])
   return <Comments comments = {comments}/>
  
}

function Comments(props) {
   if(props.comments.length === 0) {
      return <div className="text-center">No comments yet.</div>
   }
   let list = [];
   for(const comment of props.comments) {
      list.push(<div>
         <div style={{fontSize:"small", color:"gray"}}>{comment.username}</div>
         <div>
         <div style={{fontSize:"medium"}}>{comment.content}</div>
         <div style={{fontSize:"small", color:"gray"}}>{comment.time}</div>
         <hr/>
         </div>
         
      </div>)
   }
   list = list.reverse();
   return (
      <div>
         {list}
      </div>
   )
}


 function deleteThisPost(props,post) {
   axios.get(base + `/deletePost/${post._id}`)
      .then((response)=>{
         if(response.status === 201) {
            props.refreshPostsRelatedFields();
         }
      }).catch((e)=>{});
 }

 function leaveComment(setCommentSpinner, commentInput, refreshCommentSection,postId,loggedIn, setShowInvalid,setCommentInput) {
   if(loggedIn) {
      setShowInvalid(true)
   }
   if(!commentInput || !loggedIn) {
      return;
   }
   setCommentSpinner(true);
   axios.get(base + `/leaveComment/${postId}`,{
      params : {
         content : commentInput,
      }
   }).then((response) => {
      if(response.status===201) {
         setCommentSpinner(false);
         refreshCommentSection();
         setCommentInput("");
         setShowInvalid(false)
      }
   }).catch((e) =>{
   });
 }



