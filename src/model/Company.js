import mongoose from "mongoose";

const valiContainer = {
    ValidateCode : {
        message: {
            register : "사업장 등록번호는 숫자 6자리여야만 합니다.",
            category : "업종코드는 숫자 6자리여야만 합니다."
        },
        validator : (v) => {
            return /[0-9]{6}/.test(v);
        }
    },
    ValidatePost : {
        message : "우편번호는 숫자 5자리여야만 합니다.",
        validator : (v) => {
            return /[0-9]{5}/.test(v);
        }
    },
    ValidatePrivate : {
        message : "사업자 형태 구분 입력 시 개인은 0, 법인은 1로 입력해주세요.",
        validator : (v) => {
            return /[0|1]/.test(v);
        }
    },
}

const companySchema = new mongoose.Schema({
    name : {type : String, required : true, trim : true,},
    registerCode : {type : String, required : true, trim : true, validate : {validator : valiContainer.ValidateCode.validator, message : valiContainer.ValidateCode.message.register}},
    category : {type : String, required : true, trim : true},
    sales : {type : Number, required : true},
    categoryCode : {type : String, required : true, trim : true, validate : {validator : valiContainer.ValidateCode.validator, message : valiContainer.ValidateCode.message.category}},
    isPrivate : {type : Boolean, required : true},
    postcode : {type : String, required : true, trim : true, validate : {validator : valiContainer.ValidatePost.validator, message : valiContainer.ValidatePost.message}},
    createdAt : {type : String, required : true},
    pastSales : {
        last_quarter : {type : Number},
        sec_quarter : {type : Number},
        trd_quarter : {type : Number},
    },
    attach : {
        path : {type : String},
        name : {type : String}
    },
})

const Company =mongoose.model("Company", companySchema)

export default Company