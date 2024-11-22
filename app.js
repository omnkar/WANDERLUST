if(process.env.NODE_ENV!="production")
{
    require('dotenv').config();
}

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const session=require("express-session");
const MongoStrore=require("connect-mongo");
const flash=require("connect-flash");

const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/reviews.js");
const cookie = require("express-session/session/cookie.js");
const userRouter=require("./routes/user.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const dbUrl=process.env.ATLASDB_URL;
const store=MongoStrore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*3600
});

store.on("error",()=>
{
    console.log("Error in mongo session store",err);
})
const sessionOption={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+ 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }   
}




main()
.then((res)=>
{
    console.log("successful connection");
})
.catch(err => console.log(err));
async function main() {
  await mongoose.connect(dbUrl);

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}



app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>
{
    res.locals.success=req.flash("success");
    res.locals.failure=req.flash("error");
    res.locals.currUser=req.user;
    next();

})

app.get("/demouser",async(req,res)=>
{
    let fakeUser=new User({
        email:"student@gmail.com",
        username:"delta-student"
    });
    let registerUser=await User.register(fakeUser,"helloWorld");
    res.send(registerUser);
})
//middleware for restructuring of listings
app.use("/listings",listingRouter);

//middleware for restructring of reviews
app.use("/listings/:id/reviews",reviewRouter);

app.use("/",userRouter);


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
