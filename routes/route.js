const express = require('express');
const router = express.Router();
const multer  = require('multer')
const fs = require('fs');
const path = require('path');

const employeeController = require('../controllers/employeeController');
const userController = require('../controllers/userController');
router.post('/user',employeeController.CreateUser)
router.get('/user/:Id', employeeController.getUser);
router.put('/user/:Id',employeeController.updateUser);
router.delete('/user/:Id',employeeController.deleteUser);
router.get('/sort_user',employeeController.sortUser);
router.get('/Pagination',employeeController.Pagination);

//for single uploads
// // Storage configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/'); // Destination folder for uploaded files
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     const fileExtension = path.extname(file.originalname);
//     cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
//   },
// });

// // File filter configuration (optional)
// const fileFilter = (req, file, cb) => {
//   // Check file types if you want to restrict the upload to specific formats
//   const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'));
//   }
// };

// // Create the multer instance with the configuration
// const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter,
// });
// router.post('/create-user',upload.single('file'),userController.CreateUser)
//********************************************************************************************************************************** */
//For multiple uploads:-
// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
  },
});

// File filter configuration (optional)
const fileFilter = (req, file, cb) => {
  // Check file types if you want to restrict the upload to specific formats
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'));
  }
};

// Create the multer instance with the configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024, // 1 MB limit per file
    files: 5, // Maximum 5 files allowed in a single request
  },
});
router.post('/create-user',upload.array('files',5),userController.CreateUser)

router.get('/get/user', userController.getUser);

module.exports = router;