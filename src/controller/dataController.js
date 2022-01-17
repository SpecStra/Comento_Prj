const dataFrame = [
    {
        name : "서방",
        code : "0055WE",
        category : ["낙농제품 및 식용 빙과류 제조업", "곡물 가공품 제조업"],
        sales : 17000000
    },
    {
        name : "동방",
        code : "0072EA",
        category : ["자동차 차체 및 트레일러 제조업", "자동차용 기타 신품 부품 제조업", "자동차용 엔진 제조업"],
        sales : 27800000
    },
    {
        name : "남방",
        code : "0012SO",
        category : ["섬유, 직물 및 의복 액세서리 소매업", "의복 소매업", "가전제품 소매업"],
        sales : 36000000
    },
    {
        name : "북방",
        code : "0062NO",
        category : ["컴퓨터 및 주변장치, 소프트웨어 및 통신기기 소매업", " 전기용품 및 조명장치 소매업"],
        sales : 29500000
    },
]

export const getData = (req, res) => {
    res.render("data", {dataFrame})
}

export const getDataDetails = (req, res) => {
    res.render("dataDetail")
}