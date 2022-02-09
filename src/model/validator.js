export const valiContainer = {
    ValidateCode : {
        message: {
            category : "업종코드는 숫자 6자리여야만 합니다."
        },
        validator : (v) => {
            return /[0-9]{6}/.test(v);
        }
    },
    ValidateUpCode : {
        message: {
            register : "파일의 사업자 등록번호 양식이 일치하지 않습니다. 000-00-00000",
        },
        validator : (v) => {
            return /[0-9]{3}-[0-9]{2}-[0-9]{5}/.test(v);
        }
    },
    ValidatePost : {
        message : "우편번호는 숫자 5자리여야만 합니다.",
        validator : (v) => {
            return /[0-9]{5}/.test(v);
        }
    },
}