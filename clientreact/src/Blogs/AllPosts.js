import * as React from "react";
import base from "../base.js";
import axios from "axios";
import {useState} from "react";
//import "./AllPosts.scss"
import ModalForConfirmation from "../ReusableModules/Confirmation";
import SuccessFeedback from "../ReusableModules/SuccessFeedback";

import ExpandedPost from "./ExpandedPost.js";
import ImgNoRerender from "./ImgNoRerender"

export default function PostSection(props) {
    const [posts, savePosts] = useState([]);
    const [asked, setAsked] = useState(false);
    const [spinner, setSpinner] = useState(true);
    const [showExpandedPost, setShowExpandedPost] = useState(false)
    const [activePostId, setActivePostId] = useState("")

    React.useEffect(() => {
      if(!asked) {
         axios.get(base + "/allPosts")
           .then((response) => {
               let posts = response.data;
            
               savePosts(posts.reverse());
               setSpinner(false);
           }).catch((e) => {});
           setAsked(true);
       }
    })


    
      
      if(spinner) {
      return <div style = {{height : "50px"}} className="text-center"><div class="spinner-border text-dark" role="status">
      </div></div>
      }

      return(
      
      <div className="PostsWrapper mx-auto">
         <Posts posts = {posts} setActivePostId={setActivePostId} setShowExpandedPost={setShowExpandedPost}/>
         <div style={{height : "20px"}}></div>
         <ExpandedPost activePostId = {activePostId} posts = {posts} show={showExpandedPost} toggleSelf={()=>{setShowExpandedPost(false)}} loggedIn={props.loggedIn} username={props.username}
         refreshPostsRelatedFields={props.refreshPostsRelatedFields}/>
      </div>
   );
    
 }



 function Posts(props) {
   let list_1 = [];
   let list_2 = [];
   let cur_list = [];
   let count = 0;
   for(let post of props.posts) {
      count++;
      if(count % 2 == 1) {
         cur_list = list_1;
      }
      else {
         cur_list = list_2;
      }
      cur_list.push(
         <div className="postCard">
         <div className="card mb-2 postItem" onClick={(e)=>{
            props.setActivePostId(post._id);
            props.setShowExpandedPost(true);
            
         }} >
            {post.image == "" ? <div className="postImg postImgEmpty"/> : <ImgNoRerender src={post.image}/>}
            <div className="card-body">
               <div className="card-text mb-0 postTitle postPreview">{post.businessName}</div>
               {post.location && <div className="card-text mb-0 postPreview postAddr">{post.location}</div>}
               <div className="card-text mb-0 postPreview">{post.content}</div>
               <div className="card-text mb-0 postPreview">Posted by: {post.username}</div>
               <div className="card-text mb-0 postPreview"><span className="star">{post.rating}/5</span> </div>
               
            </div>
         </div>
         </div>
      )
   }

   

   return (
      <div>
         <div className = "leftCol">
            {list_1}
         </div>

         <div className = "rightCol" style={{width: "50%", display:"inline-block", verticalAlign : "top"}}>
            {list_2}
         </div>
      </div>
   );
 }
 









 