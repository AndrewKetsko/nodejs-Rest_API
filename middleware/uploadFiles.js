const multer = require("multer");
const path = require("path");

const tempFolder = path.join(__dirname, "..", "tmp");

const storage = multer.diskStorage({
  destination: tempFolder,
  // filename: (req, file, cb) => {
  //   cb(null, file.originalname);
  // },
});

const uploadFiles = multer({ storage });

module.exports = uploadFiles;
