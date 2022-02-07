import Company from "../model/Company";
import * as fs from "fs";
import * as xlsx from "xlsx";

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

export const getDataPage = async (req, res) => {
    const page = req.params.page ? req.params.page : 1
    const pickQuery = req.query ? req.query : null
    const viewRate = 50
    const countOfData = await Company.count({})
    const lastPage = countOfData%viewRate === 0 ? countOfData/viewRate : Math.ceil(countOfData/viewRate)
    try{
        if(!pickQuery.sort && !pickQuery.allSort){
            const companies = await Company.find({}).skip((page-1)*viewRate).limit(viewRate)
            return res.render("data", {dataFrame : companies, pageTitle : `Data - Page ${page}`, page : Number(page), lastPage})

        } else if(pickQuery.sort && !pickQuery.allSort) {
            const companies = await Company.find({}).skip((page-1)*viewRate).limit(viewRate)
            if(pickQuery.sort === "asc"){
                companies.sort((a,b) => a.sales > b.sales ? 1 : -1)
            } else if (pickQuery.sort === "desc"){
                companies.sort((a,b) => a.sales > b.sales ? -1 : 1)
            }
            const queryString = `?sort=${pickQuery.sort}`
            return res.render("data", {dataFrame : companies, pageTitle : `Data - Page ${page}`, page : Number(page), lastPage, pickQuery, queryString})

        } else if(!pickQuery.sort && pickQuery.allSort){
            const companies = await Company.find({}).skip((page-1)*viewRate).limit(viewRate).sort({sales : `${pickQuery.allSort}`})
            const queryString = `?allSort=${pickQuery.allSort}`
            return res.render("data", {dataFrame : companies, pageTitle : `Data - Page ${page}`, page : Number(page), lastPage, pickQuery, queryString})

        } else if(pickQuery.sort && pickQuery.allSort){
            const companies = await Company.find({}).skip((page-1)*viewRate).limit(viewRate).sort({sales : `${pickQuery.allSort}`})
            if(pickQuery.sort === "asc"){
                companies.sort((a,b) => a.sales > b.sales ? 1 : -1)
            } else if (pickQuery.sort === "desc"){
                companies.sort((a,b) => a.sales > b.sales ? -1 : 1)
            }
            const queryString = `?allSort=${pickQuery.allSort}&sort=${pickQuery.sort}`
            return res.render("data", {dataFrame : companies, pageTitle : `Data - Page ${page}`, page : Number(page), lastPage, pickQuery, queryString})

        }
    } catch (e) {
        return res.redirect("/")
    }
}

export const getDataDetails = async (req, res) => {
    const {id} = req.params
    if(!res.locals.loggedIn){
        req.session.userAuthFail = true
        return res.status(200).redirect("/login")
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
    /* 임시허용
    if(!res.locals.loggedIn){
        req.session.userAuthFail = true
        return res.status(200).redirect("/login")
    }
     */
    return res.render("dataAddNew", {pageTitle : "Data Add"})
}

export const postDataAdd = async (req, res) => {
    const file = req.file
    const nowDate = new Date
    try{
        const obj = await xlsx.readFile(`./uploads/${file.filename}`)
        const newCompany = await Company.create({
            name : obj.Sheets["Sheet 1"].A2.v,
            registerCode : obj.Sheets["Sheet 1"].B2.v,
            category : obj.Sheets["Sheet 1"].C2.v,
            sales : Number(obj.Sheets["Sheet 1"].D2.v),
            categoryCode : obj.Sheets["Sheet 1"].E2.v,
            isPrivate : Boolean(obj.Sheets["Sheet 1"].F2.v),
            postcode : obj.Sheets["Sheet 1"].G2.v,
            createdAt : `${nowDate.getFullYear()}년 ${nowDate.getMonth()+1}월 ${nowDate.getDate()}일`,
            pastSales : {
                last_quarter : 0,
                sec_quarter : 0,
                trd_quarter : 0
            },
            attach : {
                path : req.file ? req.file.path : "",
                name : req.file ? req.file.originalname : ""
            }
        })
        return res.redirect(`/data/${newCompany.registerCode}`)
    /*
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
        const newCompany = await Company.create({
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
        return res.redirect(`/data/${newCompany.registerCode}`)
        */
        return res.redirect(`/data/pages/1/`)
    } catch (e) {
        // console.log(e)
        return res.status(400).render("dataAdd", {message : e, pageTitle : "Data Add"})
    }
}

export const getDataEdit = async (req, res) => {
    if(!res.locals.loggedIn){
        req.session.userAuthFail = true
        return res.status(200).redirect("/login")
    }
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
      // console.log(req.file)
      return res.status(200).redirect(`/data/${registerCode}`)
    } catch (e) {
        const detailed = await Company.findOne({registerCode})
        return res.render("edit", {detailed, message : e, pageTitle : `Edit`})
    }
}

export const getDataDelete = async (req, res) => {
    if(!res.locals.loggedIn){
        req.session.userAuthFail = true
        return res.status(200).redirect("/login")
    }
    const {id} = req.params
    if (!id){
        return res.redirect("/data/pages/1/")
    }
    const prevData = await Company.findOne({registerCode : id})
    const prevAttachPath = prevData.attach.path.replace("\\", "/")
    try{
        await Company.findOneAndDelete({registerCode : id})
        if(prevAttachPath !== ""){
            return res.redirect(`/data/${prevAttachPath}/delete`)
        }
        return res.redirect(`/data/pages/1/`)
    } catch (e) {
        return res.status(500).redirect(`/data/${id}`, {message : e})
    }
}

export const getDataDownload = async (req, res) => {
    if(!res.locals.loggedIn){
        req.session.userAuthFail = true
        return res.status(200).redirect("/login")
    }
    const {file_path} = req.params
    const searched = await Company.findOne({"attach.path" : `uploads\\${file_path}`})
    try{
        return res.download(`./uploads/${file_path}`, `${searched.attach.name}`)
    } catch (e) {
        return res.render(`/data/${searched.registerCode}`, {message : e})
    }
}

export const getAttachDelete = async (req, res) => {
    if(!res.locals.loggedIn){
        req.session.userAuthFail = true
        return res.status(200).redirect("/login")
    }
    const {file_path} = req.params
    try {
        await fs.unlinkSync(`uploads\\${file_path}`)
    } catch (e) {
        return res.status(500).redirect("/data/pages/1/")
    }
    try{
        const updatedData = await Company.findOneAndUpdate({"attach.path" : `uploads\\${file_path}`}, {
            attach : {
                path : "",
                name : ""
            }
        })
        return res.status(200).redirect(`/data/${updatedData.registerCode}`)
    } catch (e) {
        return res.status(500).redirect("/data/pages/1/")
    }
}