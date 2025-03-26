const express = require("express");
const { postRegistration, handleLogin, postSellProduct, getProduct,showProduct } = require("../controller/CRUD");
const router = express.Router();

// Import Multer configuration
const multer = require("multer");
const path = require("path");

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads') // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname)
  }
});

// File filter to only accept images
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Registration route
router.route("/register")
    .post(postRegistration);

// Login route
router.route("/login")
    .post(handleLogin);

// Product routes
router.route("/product")
    .post(upload.single("photo"), postSellProduct)

router.route("/getproduct")
    .get(getProduct)


router.route("/showproducts")
    .get(showProduct)


    
module.exports = router;
