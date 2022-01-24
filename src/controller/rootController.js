export const getHome = (req, res) => {
    res.render("home")
}

export const getLogin = (req, res) => {
    res.render("login")
}

export const postLogin = async (req, res) => {
    const data = req.body
    console.log(data)
    res.redirect("/login")
}

export const getJoin = (req, res) => {
    res.render("join")
}

export const postJoin = (req, res) => {
    const data = req.body
    console.log(data)
    res.redirect("/join")
}