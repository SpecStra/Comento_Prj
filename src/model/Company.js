import mongoose from "mongoose";
import {valiContainer} from "./validator"

const companySchema = new mongoose.Schema({
    name : {type : String, required : true, trim : true,},
    registerCode : {type : String, required : true, trim : true, validate : {validator : valiContainer.ValidateUpCode.validator, message : valiContainer.ValidateUpCode.message.register}},
    category : {type : String, required : true, trim : true},
    financeInfo : {
        sales : {type : Number, required : true},
        operIncome : {type : Number, required : true},
        netIncome : {type : Number, required : true},
        recodedDate : {
            year : {type : Number, required : true},
            quarter : {type : Number, required : true}
        }
    },
    categoryCode : {type : String, required : true, trim : true, validate : {validator : valiContainer.ValidateCode.validator, message : valiContainer.ValidateCode.message.category}},
    isPrivate : {type : Boolean, required : true},
    postcode : {type : String, required : true, trim : true, validate : {validator : valiContainer.ValidatePost.validator, message : valiContainer.ValidatePost.message}},
    modifier : {
        date : {type : String, required : true},
        user : {type : String, required : true},
    },
    path : {type : String, required : true, trim : true},
    attach : {
        path : {type : String},
        name : {type : String}
    },
})

const Company = mongoose.model("Company", companySchema)

export default Company