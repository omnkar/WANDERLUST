const express=require("express");
const passport=require("passport")
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const { saveRedirectUrl } = require("../middleware.js");
const router=express.Router();
const userController=require("../controllers/user.js")


router
    .route("/signup")
    .get(userController.renderSignup) //sign up page renndering
    .post(wrapAsync(userController.postSignup)) //storing data of signup


router
    .route("/login")
    .get(userController.renderLogin)
    .post(
    saveRedirectUrl,
    passport.authenticate("local",{
        failureRedirect:'/login',
        failureFlash:true}),
        userController.postLogin
    )
//login page rendering


router.get("/logout",userController.logout)
module.exports=router;