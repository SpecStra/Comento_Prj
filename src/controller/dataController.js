import Company from "../model/Company";

const privateValidate = (src) => {
    if(src === "0"){
        return true
    } else if (src === "1"){
        return false
    } else {
        return "err"
    }
}

export const getData = async (req, res) => {
    try {
        const companies = await Company.find({})
        return res.render("data", {dataFrame : companies})
    } catch (e) {
        console.log(e)
        return res.status(400).render("data", {message : e})
    }
}

export const getDataDetails = async (req, res) => {
    const {id} = req.params
    try {
        const detailed = await Company.findOne({registerCode : id})
        if(!detailed){
            res.redirect("/data")
        }
        return res.render("dataDetail", {detailed})
    } catch (e) {
        console.log(e)
        return res.status(400).render("data", {message : e})
    }

}

export const getDataAdd = (req, res) => {
    res.render("dataAdd")
}

export const postDataAdd = async (req, res) => {
    const {name,
        registerCode,
        category,
        sales,
        categoryCode,
        isPrivate,
        postcode,
        last_quarter,
        sec_quarter,
        trd_quarter,
        attach} = req.body
    const nowDate = new Date
    try {
        await Company.create({
            name,
            registerCode,
            category,
            sales : Number(sales),
            categoryCode,
            isPrivate : privateValidate(isPrivate),
            postcode,
            createdAt : `${nowDate.getFullYear()}년 ${nowDate.getMonth()+1}월 ${nowDate.getDate()}일`,
            pastSales : {
                last_quarter : Number(last_quarter),
                sec_quarter : Number(sec_quarter),
                trd_quarter : Number(trd_quarter)
            },
            attach
        })
        res.redirect("/data")
    } catch (e) {
        // console.log(e)
        return res.status(400).render("dataAdd", {message : e})
    }
}

export const getDataEdit = async (req, res) => {
    const {id} = req.params
    try{
        const detailed = await Company.findOne({registerCode : id})
        return res.render("edit", {detailed})
    } catch (e) {
        const detailed = await Company.findOne({registerCode : id})
        return res.render("edit", {detailed, message : e})
    }
    //const detailed = dataFrame.find(src => src.registerCode === id)
}

export const postDataEdit = async (req, res) => {
    const {name,
        registerCode,
        category,
        sales,
        categoryCode,
        isPrivate,
        postcode,
        createdAt,
        last_quarter,
        sec_quarter,
        trd_quarter,
        attach} = req.body
    try{
      await Company.findOneAndUpdate({registerCode}, {
          name,
          registerCode,
          category,
          sales : Number(sales),
          categoryCode,
          isPrivate : privateValidate(isPrivate),
          postcode,
          createdAt,
          pastSales : {
              last_quarter : Number(last_quarter),
              sec_quarter : Number(sec_quarter),
              trd_quarter : Number(trd_quarter)
          },
          attach
      })
      return res.redirect(`/data/${registerCode}`)
    } catch (e) {
        const detailed = await Company.findOne({registerCode})
        return res.render("edit", {detailed, message : e})
    }
}

export const getDataDelete = async (req, res) => {
    const {id} = req.params
    if (!id){
        res.redirect("/data")
    }
    try{
        await Company.findOneAndDelete({registerCode : id})
        return res.redirect("/data")
    } catch (e) {
        return res.status(500).redirect(`/data/${id}`, {message : e})
    }
}