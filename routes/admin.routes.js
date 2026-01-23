

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const authMiddleware = require('../middleware/auth.middleware');


router.use(authMiddleware.verifyToken);
router.use(authMiddleware.verifyAdmin);




router.post('/authors', adminController.addAuthor); 


router.post('/publishers', adminController.addPublisher); 


router.post('/books', adminController.addBook); 

module.exports = router;