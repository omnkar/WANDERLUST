const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const Listing=require("./models/listing.js");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const Review=require("./models/review.js");
const listings=require("./routes/listing.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const mongo_url="mongodb://127.0.0.1:27017/wanderlust";

main()
.then((res)=>
{
    console.log("successful connection");
})
.catch(err => console.log(err));
async function main() {
  await mongoose.connect(mongo_url);

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}


app.get("/",(req,res)=>
{
    res.send("hei i am rooot");
});


const validateReview=(req,res,next)=>
    {
        let {error}=reviewSchema.validate(req.body);
        if(error)
        {
            let errMsg=error.details.map((el)=>el.message).join(",");
            throw new ExpressError(400,errMsg);
        }
        else{
            next();
        }
    }

//middleware for restructuring of listings
app.use("/listings",listings);

//reviews route
app.post("/listings/:id/reviews",validateReview,wrapAsync(async(req,res)=>
    {
       let listing= await Listing.findById(req.params.id);
       let newReview=new Review(req.body.review);

       listing.reviews.push(newReview);
       await newReview.save();
       await listing.save();
    res.redirect(`/listings/${req.params.id}`);
}))
//delete review route
app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>
{
    let{id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}))
//handling wrong route error
app.all("*",(req,res,next)=>
{
    next(new ExpressError(404,"Page Not Found!"));
})
app.use((err,req,res,next)=>
{
    let{status=500,message="somthing went wrong"}=err;
    res.status(status).render("error.ejs",{err});
})
app.listen(8080,()=>
{
    console.log("server listening");
})

