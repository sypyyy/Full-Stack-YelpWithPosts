const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const session = require('cookie-session');
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/User");
const port = 8080;
const registerRoute =  require('./routes/register');
const loginRoute =  require('./routes/login');
const mainPageRoute = require('./routes/main');
const reserveRoute = require('./routes/reserve');
const postRoute = require('./routes/posts') ;
const imageRoute = require('./routes/images') ;
const createFakePosts = require('./FakePosts/createFakePosts') ;
//app.use(express.static(path.join(__dirname,"./views")))
const mongoURL = "mongodb+srv://yelpProj:Syp0809123!@cluster0.p8vxa10.mongodb.net/?retryWrites=true&w=majority"

async function main() {
  mongoose.set('bufferCommands', false);
  //'mongodb://localhost:27017/test'
  await mongoose.connect(mongoURL);
  //const test = mongoose.connect('mongodb://localhost:27017/test');
  await createFakePosts();
  console.log("connected to db")

//define all the routes


  app.use(session({
    secret: 'ajewfjnjfjnansrsj',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, expires: Date.now() + 1000 * 60 * 60 * 24 * 7,}
  }))

  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(new localStrategy(User.authenticate()));
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());

  app.use("/",registerRoute);
  app.use("/",loginRoute);
  app.use("/",mainPageRoute);
  app.use("/",reserveRoute);
  app.use("/",postRoute);
  app.use("/",imageRoute);

 
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
}


main();



