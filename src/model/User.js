import mongoose from "mongoose";
import bcrypt from "bcrypt"
import {valiContainer} from "./validator"

const userSchema = new mongoose.Schema({
    username : {type : String, required : true},
    workshopName : {type : String, trim : true},
    postcode : {type : String, required : true, trim : true, validate : {validator : valiContainer.ValidatePost.validator, message : valiContainer.ValidatePost.message}},
    password : {type : String, required : true},
    registerCode : {type : String, required : true, trim : true, validate : {validator : valiContainer.ValidateUpCode.validator, message : valiContainer.ValidateUpCode.message.register}},
    upperCompany : {type : String, required : true, trim : true},
    userType : {type : String, required : true, trim : true}
})


userSchema.pre("save", async function () {
    this.password = await bcrypt.hash(this.password, 5)
})

const User = mongoose.model("User", userSchema)

export default User