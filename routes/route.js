const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

router.post('/user',employeeController.CreateUser)
router.get('/user/:Id', employeeController.getUser);
router.put('/user/:Id',employeeController.updateUser);
router.delete('/user/:Id',employeeController.deleteUser);
router.get('/sort_user',employeeController.sortUser);
router.get('/Pagination',employeeController.Pagination);

module.exports = router;