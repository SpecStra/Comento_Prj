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

export const getJoin = (req, res) => {
    res.render("join", {pageTitle : "Join"})
}

export const postJoin = async (req, res) => {
    const {username, password, passwordRecheck, signCode} = req.body
    const searchedUser = await User.findOne({username})
    if(signCode !== process.env.SIGN_CODE){
        return res.status(400).render("join", {message : "Wrong Code", pageTitle : "Join"})
    }
    if(searchedUser){
        return res.status(400).render("join", {message : "that name is already exist", pageTitle : "Join"})
    }
    if(password !== passwordRecheck){
        return res.status(400).render("join", {message : "passwords are not same", pageTitle : "Join"})
    }
    await User.create({
        username,
        password
    })
    return res.redirect("/login")
}

export const getLogout = (req, res) => {
    req.session.destroy()
    return res.status(200).redirect("/")
}