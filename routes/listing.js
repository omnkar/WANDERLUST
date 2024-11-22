const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");

const Listing=require("../models/listing.js");
const{isLoggedIn}=require("../middleware.js");
const{isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controllers/listings.js");
const multer  = require('multer')
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage })



router
    .route("/")
    .get(wrapAsync(listingController.index)) //index route
    .post(isLoggedIn,upload.single('listing[image]'),wrapAsync(listingController.createListing)); //create route


//new route validateListing,
router.get("/new",isLoggedIn,listingController.renderNewForm)
router 
    .route("/:id")
    .get(wrapAsync(listingController.showListings)) //show route
    .put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing)) //update route

    
    
//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.editListing))

//delete route
router.delete("/:id/delete",isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));

module.exports=router;