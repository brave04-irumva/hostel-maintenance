const multer = require("multer");
const path = require("path");

// Configure where to store images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Ensure this folder exists in your server root!
  },
  filename: function (req, file, cb) {
    // Generate unique filename: fieldname-date.ext
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});

// File Filter (Only Images)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload an image."), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Limit to 5MB
});

module.exports = upload;