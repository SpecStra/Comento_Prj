const dataFrame = [
    {
        name : "서방",
        code : "0055WE",
        category : ["chemical", "energy"],
        sales : 17000000
    },
    {
        name : "동방",
        code : "0072EA",
        category : ["paper", "struck"],
        sales : 27800000
    },
    {
        name : "남방",
        code : "0012SO",
        category : ["computer", "coin"],
        sales : 36000000
    },
    {
        name : "북방",
        code : "0062NO",
        category : ["robot", "car"],
        sales : 29500000
    },
]

export const getData = (req, res) => {
    res.render("data", {dataFrame})
}

export const getDataDetails = (req, res) => {
    res.render("dataDetail")
}