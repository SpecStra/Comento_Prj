import Company from "../model/Company";
import * as fs from "fs";
import * as xlsx from "xlsx";
import User from "../model/User";
import mongoose from "mongoose";
import fse from "fs-extra";
import {zip} from "zip-a-folder";

const tempFolder = "./uploads/temp"

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
    if(!res.locals.loggedIn){
        req.session.userAuthFail = true
        return res.status(200).redirect("/login")
    }
    if(res.locals.userType === "Workshop"){
        const hasData = await Company.findOne({registerCode : req.session.currentUser.registerCode})
        if(!hasData){
            return res.status(200).redirect(`/data/add`)
        }
    }
    const page = req.params.page ? req.params.page : 1
    const pickQuery = req.query ? req.query : null
    const currentUser = req.session.currentUser.username
    const user = await User.findOne({username : currentUser})
    //console.log(user.registerCode)
    const viewRate = 50
    const countOfData = await Company.count({})
    const lastPage = countOfData%viewRate === 0 ? countOfData/viewRate : Math.ceil(countOfData/viewRate)
    try{
        if(!pickQuery.sort && !pickQuery.allSort){
            const regexString = user.userType === "Admin" ? "^,Admin," : user.userType === "Company" ? `,${user.registerCode},` : `,Admin,${user.upperCompany},`
            const regex = new RegExp(regexString, "g")
            // console.log(regex)
            const companies = await Company.find({path : regex}).skip((page-1)*viewRate).limit(viewRate).sort({name : 1, "financeInfo.recodedDate.year" : 1, "financeInfo.recodedDate.quarter" : 1})
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
        return res.redirect("/data")
    }
}

export const postDataPages = async (req, res) => {
    fse.emptyDirSync(tempFolder)
    const downArray = Object.keys( req.body )
    // console.log(downArray)
    if(downArray.length === 0){
        return res.status(400).redirect("/data/pages/1/")
    }
    try {
        for(const src of downArray){
            const queryId = new mongoose.Types.ObjectId( src )
            const foundData = await Company.findOne( {_id: queryId} )
            const fileName = `${ foundData.name } ${ foundData.financeInfo.recodedDate.year }년 ${ foundData.financeInfo.recodedDate.quarter }분기.xlsx`
            const input = await fs.createReadStream( foundData.attach.path )
            const output = await fs.createWriteStream( `${tempFolder}/${fileName}` )
            input.pipe( output )
        }
    } catch (e) {
        console.log(e)
        return res.redirect("/data")
    }
    await zip( `${ tempFolder }`, "./uploads/masterData.zip" )
    return res.download("./uploads/masterData.zip", "masterData.zip")
}

export const getDataDetails = async (req, res) => {
    const {objectID} = req.params
    if(!res.locals.loggedIn){
        req.session.userAuthFail = true
        return res.status(200).redirect("/login")
    }
    try {
        const queryId = new mongoose.Types.ObjectId(objectID)
        const detailed = await Company.findOne({_id : queryId})
        if(detailed === null){
            return res.redirect("/data")
        }
        return res.render("dataDetail", {detailed, pageTitle : `Data Detailed`})
    } catch (e) {
        console.log(e)
        return res.status(400).render("data", {message : e, pageTitle : `Data Detailed`})
    }
}

export const getDataAdd = (req, res) => {
    if(!res.locals.loggedIn){
        req.session.userAuthFail = true
        return res.status(200).redirect("/login")
    }
    return res.render("dataAddNew", {pageTitle : "Data Add"})
}

export const postDataAdd = async (req, res) => {
    if(!res.locals.loggedIn){
        req.session.userAuthFail = true
        return res.status(200).redirect("/login")
    }
    const file = req.file
    const nowDate = new Date
    const {input_year, input_quarter} = req.body
    const check = await Company.findOne({registerCode : req.session.currentUser.registerCode, "financeInfo.recodedDate.year" : Number(input_year), "financeInfo.recodedDate.quarter" : Number(input_quarter)})
    if(check){
        await fs.unlinkSync(file.path)
        return res.status(400).render("dataAddNew", {message : `${input_year}/${input_quarter} quarter Data already exist`, pageTitle : "Data Add"})
    }
    const maker = req.session.currentUser.username
    try{
        const user = await User.findOne({username : maker})
        const obj = await xlsx.readFile(`./uploads/${file.filename}`)
        const {Sheets : {Sheet1}} = obj
        const newCompany = await Company.create({
            name : Sheet1.A2.v,
            registerCode : user.registerCode,
            category : Sheet1.B2.v,
            financeInfo : {
                sales : Number(Sheet1.F2.v),
                operIncome : Number(Sheet1.G2.v),
                netIncome : Number(Sheet1.H2.v),
                recodedDate : {
                    year : Number(input_year),
                    quarter : Number(input_quarter),
                }
            },
            categoryCode : Sheet1.C2.v,
            isPrivate : Boolean(Sheet1.D2.v),
            postcode : Sheet1.E2.v,
            modifier : {
                date : `${nowDate.getFullYear()}년 ${nowDate.getMonth()+1}월 ${nowDate.getDate()}일`,
                user : String(maker)
            },
            path : user.upperCompany === "Admin" ? ",Admin," : `,Admin,${user.upperCompany},`,
            attach : {
                path : req.file ? req.file.path : "",
                name : req.file ? req.file.originalname : ""
            }
        })
        return res.redirect(`/data/${newCompany._id.toString()}`)
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
    } catch (e) {
        // console.log(e)
        return res.status(400).render("dataAddNew", {message : e, pageTitle : "Data Add"})
    }
}

export const getDataEdit = async (req, res) => {
    const {objectID} = req.params
    const queryId = new mongoose.Types.ObjectId(objectID)
    if(!res.locals.loggedIn){
        req.session.userAuthFail = true
        return res.status(200).redirect("/login")
    }
    const {id} = req.params
    try{
        const detailed = await Company.findOne({_id : queryId})
        return res.render("dataAddNew", {detailed, pageTitle : `Edit ${id}`})
    } catch (e) {
        return res.render("edit", {detailed, message : e, pageTitle : `Edit ${id}`})
    }
    //const detailed = dataFrame.find(src => src.registerCode === id)
}

export const postDataEdit = async (req, res) => {
    const {objectID} = req.params
    const queryId = new mongoose.Types.ObjectId(objectID)
    const file = req.file
    const nowDate = new Date
    console.log(req.session.currentUser.username)
    const user = await User.findOne({registerCode : req.session.currentUser.registerCode})
    const prevData = await Company.findOne({_id : queryId})
    try{
        const obj = await xlsx.readFile(`./uploads/${file.filename}`)
        const {Sheets : {Sheet1}} = obj
        await fs.unlinkSync(`${prevData.attach.path}`)
        await Company.findOneAndUpdate({_id : queryId}, {
            name : Sheet1.A2.v,
            registerCode : prevData.registerCode,
            category : Sheet1.B2.v,
            financeInfo : {
                sales : Number(Sheet1.F2.v),
                operIncome : Number(Sheet1.G2.v),
                netIncome : Number(Sheet1.H2.v),
                recodedDate : {
                    year : prevData.financeInfo.recodedDate.year,
                    quarter : prevData.financeInfo.recodedDate.quarter,
                }
            },
            categoryCode : Sheet1.C2.v,
            isPrivate : Boolean(Sheet1.D2.v),
            postcode : Sheet1.E2.v,
            modifier : {
                date : `${nowDate.getFullYear()}년 ${nowDate.getMonth()+1}월 ${nowDate.getDate()}일`,
                user : String(req.session.currentUser.username)
            },
            path : prevData.path,
            attach : {
                path : req.file ? req.file.path : "",
                name : req.file ? req.file.originalname : ""
            }
        })
        return res.status(200).redirect(`/data/${objectID}`)
    } catch (e) {
        const detailed = await Company.findOne({_id : queryId})
        return res.render("edit", {detailed, message : e, pageTitle : `Edit`})
    }
}

export const getDataDelete = async (req, res) => {
    const {objectID} = req.params
    const queryId = new mongoose.Types.ObjectId(objectID)
    if(!res.locals.loggedIn){
        req.session.userAuthFail = true
        return res.status(200).redirect("/login")
    }
    const prevData = await Company.findOne({_id : queryId})
    const prevAttachPath = prevData.attach.path.replace("\\", "/")
    try{
        await Company.findOneAndDelete({_id : queryId})
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

export const getDownloadAllData = async (req, res) => {
    fse.emptyDirSync(tempFolder)
    if(!res.locals.loggedIn){
        req.session.userAuthFail = true
        return res.status(200).redirect("/login")
    }
    const currentUser = req.session.currentUser.username
    const user = await User.findOne({username : currentUser})
    try{
        const regexString = user.userType === "Admin" ? "^,Admin," : user.userType === "Company" ? `,${user.registerCode},` : `,Admin,${user.upperCompany},`
        const regex = new RegExp(regexString, "g")
        const companies = await Company.find({path : regex}).sort({name : 1, "financeInfo.recodedDate.year" : 1, "financeInfo.recodedDate.quarter" : 1})
        for(const src of companies) {
            const queryId = new mongoose.Types.ObjectId( src )
            const foundData = await Company.findOne( {_id: queryId} )
            const fileName = `${ foundData.name } ${ foundData.financeInfo.recodedDate.year }년 ${ foundData.financeInfo.recodedDate.quarter }분기.xlsx`
            const input = await fs.createReadStream( foundData.attach.path )
            const output = await fs.createWriteStream( `${ tempFolder }/${ fileName }` )
            input.pipe( output )
        }
    } catch (e) {
        return res.redirect("/data/pages/1/")
    }
    await zip( `${ tempFolder }`, "./uploads/AllData.zip" )
    return res.download("./uploads/AllData.zip", "AllData.zip")
}