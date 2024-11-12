const routes = require("express").Router();

const routedate = require("../controller/usercontroller.js");

routes.post("/signup",routedate.signup);
routes.post("/login", routedate.login);

routes.post("/forgotpassword", routedate.forgotpassword);
routes.post("/resetpassword", routedate.resetpassword);


module.exports = routes;

