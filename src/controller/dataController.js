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
        return res.render("data", {dataFrame : companies, pageTitle : "Data"})
    } catch (e) {
        console.log(e)
        return res.status(400).render("data", {message : e, pageTitle : "Data"})
    }
}

export const getDataDetails = async (req, res) => {
    const {id} = req.params
    if(!res.locals.loggedIn){
        return res.status(401).render("login", {message : "authority required : need user authority", pageTitle : "Login"})
    }
    try {
        const detailed = await Company.findOne({registerCode : id})
        if(!detailed){
            res.redirect("/data")
        }
        return res.render("dataDetail", {detailed, pageTitle : `${id}`})
    } catch (e) {
        console.log(e)
        return res.status(400).render("data", {message : e, pageTitle : "Data"})
    }

}

export const getDataAdd = (req, res) => {
    if(!res.locals.loggedIn){
        return res.status(401).render("login", {message : "authority required : need user authority", pageTitle : "Login"})
    }
    return res.render("dataAdd", {pageTitle : "Data Add"})
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
            attach : {
                path : req.file ? req.file.path : "",
                name : req.file ? req.file.originalname : ""
            }
        })
        res.redirect("/data")
    } catch (e) {
        // console.log(e)
        return res.status(400).render("dataAdd", {message : e, pageTitle : "Data Add"})
    }
}

export const getDataEdit = async (req, res) => {
    const {id} = req.params
    try{
        const detailed = await Company.findOne({registerCode : id})
        return res.render("edit", {detailed, pageTitle : `Edit ${id}`})
    } catch (e) {
        const detailed = await Company.findOne({registerCode : id})
        return res.render("edit", {detailed, message : e, pageTitle : `Edit ${id}`})
    }
    //const detailed = dataFrame.find(src => src.registerCode === id)
}

export const postDataEdit = async (req, res) => {
    const {id} = req.params
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
        } = req.body
    const prevData = await Company.findOne({registerCode})
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
          attach : {
              path : req.file ? req.file.path : prevData.attach.path,
              name : req.file ? req.file.originalname : prevData.attach.name
          }
      })
      console.log(req.file)
      return res.status(200).redirect(`/data/${registerCode}`)
    } catch (e) {
        const detailed = await Company.findOne({registerCode})
        return res.render("edit", {detailed, message : e, pageTitle : `Edit`})
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

export const getDataDownload = async (req, res) => {
    const {file_path} = req.params
    const searched = await Company.findOne({"attach.path" : `uploads\\${file_path}`})
    try{
        return res.download(`./uploads/${file_path}`, `${searched.attach.name}`)
    } catch (e) {
        return res.render(`/data/${searched.registerCode}`, {message : e})
    }
}