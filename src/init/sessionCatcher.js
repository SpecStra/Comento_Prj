import multer from "multer";

export const localWare = (req, res, next) => {
    // console.log("req SESSION : ",req.session)
    // console.log("res SESSION : ",res.locals)
    res.locals.userAuthFail = !!req.session.userAuthFail;
    if(req.session.loggedIn){
        res.locals.loggedIn = req.session.loggedIn
        res.locals.currentUser = req.session.currentUser.username
    } else {
        res.locals.loggedIn = false
    }
    next()
}

export const uploadWare = multer({
    dest : "uploads/", limits : 5000,
})