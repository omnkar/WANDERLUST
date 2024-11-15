const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");

const userSchma=new Schema({
    email:{
        type:String,
        required:true
    }
    
})
userSchma.plugin(passportLocalMongoose);
module.exports=mongoose.model("User",userSchma);

