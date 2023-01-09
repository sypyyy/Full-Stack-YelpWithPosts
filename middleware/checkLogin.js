base = require("../base/base")
module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        return res.redirect(base+"/login");
    }
    else {
        next();
    }
}