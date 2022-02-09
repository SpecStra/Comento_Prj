import multer from "multer";

export const localWare = (req, res, next) => {
    // console.log("req SESSION : ",req.session)
    // console.log("res SESSION : ",res.locals)
    res.locals.userAuthFail = !!req.session.userAuthFail;
    if(req.session.loggedIn){
        res.locals.loggedIn = req.session.loggedIn
        res.locals.currentUser = req.session.currentUser.username
        res.locals.userType = req.session.currentUser.userType
        res.locals.userRegiCode = req.session.currentUser.registerCode
    } else {
        res.locals.loggedIn = false
    }
    next()
}

export const uploadWare = multer({
    dest : "uploads/", limits : 5000,
})