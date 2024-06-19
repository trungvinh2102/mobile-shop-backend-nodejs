const multer = require("multer")
const config = require("config");

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, config.get("app.tmp"))
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now();
      cb(null, uniqueSuffix + "-" + file.originalname)
    }
  }),
})

module.exports = upload;