import mongoose from "mongoose";
import bcrypt from "bcrypt"

/*
const valiContainer = {
    validateName : {
        message : "",
        validator : (v) => {
            return /[]/.test(v)
        }
    },
    validatePW : {
        message : "",
        validator : (v) => {
            return /[]/.test(v)
        }
    }
}
 */

const userSchema = new mongoose.Schema({
    username : {type : String, required : true},
    password : {type : String, required : true}
})


userSchema.pre("save", async function () {
    this.password = await bcrypt.hash(this.password, 5)
})

const User = mongoose.model("User", userSchema)

export default User