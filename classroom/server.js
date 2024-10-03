const express=require("express");
const app=express();
const session=require("express-session");


app.use(session(
    {
        secret:"my super secret string "
    }
))
app.get("/test",(req,res)=>
{
    res.send("test successful");
})
app.listen(3000,()=>
{
    console.log("listning");
})