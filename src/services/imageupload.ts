import multer from 'multer'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Define the destination directory for storing uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname) // Keep the original file name
  }
});

const upload = multer({ storage: storage });

export default upload 