const express = require("express");
const app = express.Router();
const path = require('path')
const axios = require('axios');
//const { KeyObject } = require("crypto");
const cors = require('cors');
const {isLoggedIn} = require("../middleware/checkLogin")



app.use(express.static(path.join(__dirname,"./clientreact/build")))
app.use(express.static(path.join(__dirname,"../base")))


app.get('/lightMapStyle', (req, res) => {
  res.sendFile(path.join(__dirname,"../base/light-map-style.json"));
})
app.get('/darkMapStyle', (req, res) => {
  res.sendFile(path.join(__dirname,"../base/dark-map-style.json"));
})

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,"../clientreact/build/index.html"));
})



app.get('/search', (req, res) => {
    res.sendFile(path.join(__dirname,"../clientreact/build/index.html"));
})

app.get('/bookings',isLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname,"../clientreact/build/index.html"));
})
app.get('/loginFail', (req, res) => {
  res.sendFile(path.join(__dirname,"../clientreact/build/index.html"));
})
app.get('/login', (req, res) => {
  
  res.sendFile(path.join(__dirname,"../clientreact/build/index.html"));
})
app.get('/posts', (req, res) => {
  res.sendFile(path.join(__dirname,"../clientreact/build/index.html"));
})
app.get("/autoComplete", (req, res) => {
    axios.get("https://api.yelp.com/v3/autocomplete",{
        params: {
          text : req.query.text
        },
        headers: {
            'Authorization' :"Bearer noZxPPYFwrE64uJDfuqzJjcqfWIAMS_Ve1qyqXhxscTuEIwrUQbmF1ZSoGjvsF-NdJg9O73ckc-2-nZ-YLAOjTYwnIYuZRrwAO7oJN_yHJ_uR7esgvJ0YEU0QRQpY3Yx"
        }
      })
          .then(function (response) {
            res.send(response.data);
          })
          .catch(function (error) {
         
            // (error);
          })
          .then(function () {
          });
})
app.get('/SearchResults', (req, res) => {
     
    let keyword = req.query.keyword;
    let distance = req.query.distance;
    let category = req.query.category;
    if(req.query.directSearch == "false") {
      
        let GeoUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${req.query.location}&key=AIzaSyAakOkX978ZyZRyGFox_SLcqI35gtbaXZY`;
        axios.get(GeoUrl)
          .then(function (response) {
            
            if(response.data.results.length == 0) {
                res.send("Invalid Location")
            }
            else {
                let lat = response.data.results[0].geometry.location.lat;
                let lng = response.data.results[0].geometry.location.lng;
                requestYelpResults(res, lat, lng, keyword, category, distance);
            }
            

          })
          .catch(function (error) {
            // (error);
          })
          .then(function () {
          });  
    }

    else {
        lat = req.query.lat;
        lng = req.query.lng;
        requestYelpResults(res, lat, lng, keyword, category, distance);
    }
})

app.get('/Detail', (req, res) => {
  let id = req.query.id;
  axios.get(`https://api.yelp.com/v3/businesses/${id}`,{
        headers: {
            'Authorization':"Bearer noZxPPYFwrE64uJDfuqzJjcqfWIAMS_Ve1qyqXhxscTuEIwrUQbmF1ZSoGjvsF-NdJg9O73ckc-2-nZ-YLAOjTYwnIYuZRrwAO7oJN_yHJ_uR7esgvJ0YEU0QRQpY3Yx"
        }
      })
          .then(function (response) {
            res.send(response.data);
          })
          .catch(function (error) {
            // (error);
          })
          .then(function () {
          });
})

app.get('/DetailIOS', (req, res) => {
  let id = req.query.id;
  axios.get(`https://api.yelp.com/v3/businesses/${id}`,{
        headers: {
            'Authorization':"Bearer noZxPPYFwrE64uJDfuqzJjcqfWIAMS_Ve1qyqXhxscTuEIwrUQbmF1ZSoGjvsF-NdJg9O73ckc-2-nZ-YLAOjTYwnIYuZRrwAO7oJN_yHJ_uR7esgvJ0YEU0QRQpY3Yx"
        }
      })
          .then(function (response) {
            let details = response.data
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
            let imgIdx = 0;
            for(let photo of details.photos) {
              if(photo) {
                imgIdx += 1;
                list["img" + imgIdx] = photo
              }
            }
            list.name = details.name

            res.send(JSON.stringify(list));

          })
          .catch(function (error) {
            // (error);
          })
          .then(function () {
          });
})













app.get('/Review', (req,res) => {
  let id = req.query.id;
  axios.get(`https://api.yelp.com/v3/businesses/${id}/reviews`,{
        headers: {
            'Authorization':"Bearer noZxPPYFwrE64uJDfuqzJjcqfWIAMS_Ve1qyqXhxscTuEIwrUQbmF1ZSoGjvsF-NdJg9O73ckc-2-nZ-YLAOjTYwnIYuZRrwAO7oJN_yHJ_uR7esgvJ0YEU0QRQpY3Yx"
        }
      })
          .then(function (response) {
            res.send(response.data);
          })
          .catch(function (error) {
            // (error);
          })
          .then(function () {
          });
})






module.exports = app;

function requestYelpResults(res, lat, lng, keyword, category, distance) {
    
    let radius = Number(distance) * 1609.344;
    radius = Math.floor(radius);
    if(category === "Default") {
        category = "All";
    }
    else if(category === "Entertainment") {
        category = "arts";
    }
    else if(category === "Food") {
        category = "food";
    }
    else if(category === "Health") {
        category = "health";
    }

    else if(category === "Hotels") {
        category = "hotelstravel";
    }

    else if(category === "Professional") {
        category = "professional";
    }

    axios.get("https://api.yelp.com/v3/businesses/search",{
        params: {
          term : keyword,
          latitude : lat,
          longitude : lng,
          categories : category,
          radius : radius
        },
        headers: {
            'Authorization' :"Bearer noZxPPYFwrE64uJDfuqzJjcqfWIAMS_Ve1qyqXhxscTuEIwrUQbmF1ZSoGjvsF-NdJg9O73ckc-2-nZ-YLAOjTYwnIYuZRrwAO7oJN_yHJ_uR7esgvJ0YEU0QRQpY3Yx"
        }
      })
          .then(function (response) {
            res.send({result : response.data, lat : lat, lng : lng});
          })
          .catch(function (error) {
            // (error);
          })
          .then(function () {
          });
}


