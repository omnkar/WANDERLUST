const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const session=require("express-session");
const flash=require("connect-flash");

const listings=require("./routes/listing.js");
const reviews=require("./routes/reviews.js");
const cookie = require("express-session/session/cookie.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const sessionOption={
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+ 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }   
}


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
app.use(flash());
app.use(session(sessionOption));

app.use((req,res,next)=>
{
    res.locals.success=req.flash("success");
    res.locals.failure=req.flash("error");
    next();

})

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

