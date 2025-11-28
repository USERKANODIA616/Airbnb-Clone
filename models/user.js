const mongoose = require("mongoose");
const Schema=mongoose.Schema;
//small warper
const plm = require("passport-local-mongoose");
const passportLocalMongoose = plm.default || plm;

const userSchema=new Schema({
    email:{
        type:String,
        required:true
    },
    // password and user name auto fill in passport-local-mongoose
})

userSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model('User',userSchema);