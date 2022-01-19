import {dataFrame} from "../model/fakeDB"

export const getData = (req, res) => {
    res.render("data", {dataFrame})
}

export const getDataDetails = (req, res) => {
    const {id} = req.params
    const detailed = dataFrame.find(src => src.registerCode === id)
    if(!detailed){
        res.redirect("/data")
    }
    res.render("dataDetail", {detailed})
}

export const getDataEdit = (req, res) => {
    const {id} = req.params
    const detailed = dataFrame.find(src => src.registerCode === id)
    res.render("edit", {detailed})
}

export const getDataDelete = (req, res) => {
    const {id} = req.params
    if (!id){
        res.redirect("/data")
    }
    // message는 나중에 세션으로 처리할 것.
    const message = `someone make attempt to delete : ${id}`
    console.log(message)
    res.status(401).redirect("/")
}
