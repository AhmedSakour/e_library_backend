
const express = require('express');
const router = express.Router();
const generalController = require('../controllers/general.controller');



router.get('/books', generalController.getAllBooks);

router.get('/search/books', generalController.searchBooksByTitle);

router.get('/search/authors', generalController.searchAuthorsByName);

router.get('/search/publishers', generalController.searchPublishersByName);
router.get('/authors', generalController.getAllAuthors);
router.get('/publishers', generalController.getAllPublishers);



module.exports = router;