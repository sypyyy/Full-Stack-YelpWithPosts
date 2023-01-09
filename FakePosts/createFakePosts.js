const Post = require("../models/Post");
const Comment = require("../models/Comment");

function resolveAfter2Seconds() {
   
 }
async function createFakePosts() {
   const filter = {};
   const all = await Post.find(filter);
   if(all.length == 0) {
      const post1 = new Post({username : "Patrick 111", userId : "", time : "2022-09-30", businessName:"Krusty Krab",
      location : "San Francisco, Bikini Bottom Street", image : "https://images.unsplash.com/photo-1550547660-d9450f859349?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=930&q=80", content : "Best burger Ever!", rating : "4.5", likes : "13",
      comments : []
      })
      const post2 = new Post({username : "Jimmy_McGill_", userId : "", time : "2022-08-24", businessName:"Los Pollos Hermanos",
      location : "New Mexico, Saul Goodman Street", image : "https://images.unsplash.com/photo-1562967916-eb82221dfb92?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8ZnJpZWQlMjBjaGlja2VufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60", content : "Real juicy and crispy mexico style fried chicken! And the manager was nice!", rating : "4", likes : "43",
      comments : []
      })
      const post3 = new Post({username : "fryDAzur", userId : "", time : "2022-09-14", businessName:"Garden of Eatn",
      location : "New York, Garden Street", image : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9vZHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60", content : "Yummy! I highly recommend this dish!", rating : "5", likes : "3",
      comments : []
      })
      const post4 = new Post({username : "@eL130", userId : "", time : "2022-11-23", businessName:"Sun of a Bun",
      location : "Los Angeles, 26th Avenue", image : "", content : "Not so good...", rating : "3", likes : "10",
      comments : []
      })
      await post1.save();
      await post2.save();
      await post3.save();
      await post4.save();
      const comment1 = new Comment({content : "I agree!",
      time : "2022-10-01",
      userId : "fakeId",
      username : "Funny_PineaPPle"});
      const comment2 = new Comment({content : "Hmmmm, I think they were only ok....",
      time : "2022-10-03",
      userId : "fakeId",
      username : "litttleKid023"});
      await comment1.save(async (err,comment) =>{
         await post1.comments.push(comment);
         await post1.save();
      });
     await comment2.save(async (err,comment) =>{
         await post1.comments.push(comment);
         await post1.save();
      });
      
   }
   return new Promise(resolve => {
      setTimeout(() => {
        resolve('resolved');
      }, 2000);
   });

}
/**
 * 
    username : String,
    userId : String,
    time: String,
    businessName: String,
    location : String,
    image : String,
    content : String,
    rating : String,
    likes : String,
  });
 */
module.exports = createFakePosts;