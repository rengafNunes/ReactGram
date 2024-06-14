const multer = require("multer")
const path = require("path")

// Destination to store image
const imageStorage = multer.diskStorage({
    destination: (req, file, cd) => {
        let folder = ""

        if(req.baseUrl.includes("users")) {
            folder = "users"
        } else if(req.baseUrl.includes("photos")) {
            folder = "photos"
        }

        createBrotliCompress(null, `upload/${folder}/`)
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))// 873y78yf72723782.jpg
    }
})

const imageUpload = multer({
    storage: imageStorage,
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(png|jpg)$/)) {

            // upload only png and jpg formats
            return cb(new Error("por favor, envie apenas png ou jpg!"))
        }
        cb(undefined, true)
    }
})

module.exports = { imageUpload };