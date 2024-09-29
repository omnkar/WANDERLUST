const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");


const listings=require("./routes/listing.js");
const reviews=require("./routes/reviews.js");

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




//middleware for restructuring of listings
app.use("/listings",listings);

//middleware for restructring of reviews
app.use("/listings/:id/reviews",reviews);


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

