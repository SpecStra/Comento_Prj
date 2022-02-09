import User from "../model/User";
import bcrypt from "bcrypt";

export const getHome = (req, res) => {
    //console.log(req.session)
    return res.render("home")
}

export const getLogin = (req, res) => {
    if(res.locals.loggedIn){
        return res.status(200).redirect("/")
    }
    req.session.userAuthFail = false
    return res.render("login", {pageTitle : "Login"})
}

export const postLogin = async (req, res) => {
    const {username, password} = req.body
    const user = await User.findOne({username})
    if(!user){
        return res.status(400).render("login", {message : "That account does not exist"})
    }
    const ok = await bcrypt.compare(password, user.password)
    if(!ok){
        return res.status(400).render("login", {message : "Wrong password"})
    }
    req.session.loggedIn = true
    req.session.currentUser = user
    return res.status(200).redirect("/")
}

export const getJoinGate = (req, res) => {
    return res.render("joinGate", {pageTitle : "Join"})
}

export const getJoin = async (req, res) => {
    return res.render("join", {pageTitle : "Join", currentCompany : null, joinType : "company"})
}

export const postJoin = async (req, res) => {
    const {username, password, passwordRecheck, signCode} = req.body
    const searchedName = await User.findOne({username})
    if(searchedName){
        return res.status(400).render("join", {message : "that name is already exist", pageTitle : "Join"})
    }
    const searchedCode = await User.findOne({registerCode : signCode})
    if(searchedCode){
        return res.status(400).render("join", {message : "that Business registration number is already exist", pageTitle : "Join"})
    }
    if(password !== passwordRecheck){
        return res.status(400).render("join", {message : "passwords are not same", pageTitle : "Join"})
    }
    await User.create({
        username,
        password,
        registerCode : signCode,
        upperCompany : "Admin",
        userType : "Company"
    })
    return res.redirect("/login")
}

export const getJoinWorkshop = async (req, res) => {
    const currentCompany = await User.find({upperCompany : "Admin"})
    const dataLength = Object.keys(currentCompany).length
    const users = []
    for (const i of Array(dataLength).keys()) {
        users.push(currentCompany[i].username)
    }
    return res.render("join", {pageTitle : "Join", currentCompany : users, joinType : "workshop"})
}

export const postJoinWorkshop = async (req, res) => {
    const {username, password, passwordRecheck, signCode, upperChoice} = req.body
    const searchedName = await User.findOne({username})
    if(searchedName){
        return res.status(400).render("join", {message : "that name is already exist", pageTitle : "Join"})
    }
    const searchedCode = await User.findOne({registerCode : signCode})
    if(searchedCode){
        return res.status(400).render("join", {message : "that Business registration number is already exist", pageTitle : "Join"})
    }
    if(password !== passwordRecheck){
        return res.status(400).render("join", {message : "passwords are not same", pageTitle : "Join"})
    }
    const upperUser = await User.findOne({username : upperChoice})
    await User.create({
        username,
        password,
        registerCode : signCode,
        upperCompany : upperUser.registerCode,
        userType : "Workshop"
    })
    return res.redirect("/login")
}

export const getLogout = (req, res) => {
    req.session.destroy()
    return res.status(200).redirect("/")
}