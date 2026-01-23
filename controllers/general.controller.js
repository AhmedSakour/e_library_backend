const db = require('../db');

exports.getAllBooks = async (req, res) => {
    try {
        const sql = `
            SELECT 
                B.Id, B.Title, B.Type, B.Price,
                P.PName, P.City AS PubCity,
                A.Fname, A.Lname, A.Country AS AuthCountry
            FROM Book B
            JOIN Publisher P ON B.pubId = P.Id
            JOIN Author A ON B.AuthorId = A.Id
            ORDER BY B.Title ASC;
        `;
        const books = await db.query(sql);
        
        return res.status(200).json({ books: books });
    } catch (error) {
        console.error('Get All Books Error:', error);
        return res.status(500).json({ message: 'An error occurred while fetching the book list.' });
    }
};

exports.searchBooksByTitle = async (req, res) => {
    const { title } = req.query; 

    if (!title) {
        return res.status(400).json({ message: 'Please enter part of the book title to search.' });
    }

    try {
        const searchQuery = `%${title}%`; 
        
        const sql = `
            SELECT 
                B.Id, B.Title, B.Type, B.Price,
                P.PName, P.City,
                A.FName, A.Lname, A.Country
            FROM Book B
            JOIN Publisher P ON B.pubId = P.Id
            JOIN Author A ON B.AuthorId = A.Id
            WHERE B.Title LIKE ?;
        `;
        const books = await db.query(sql, [searchQuery]);

        return res.status(200).json({ results: books });
    } catch (error) {
        console.error('Search Books Error:', error);
        return res.status(500).json({ message: 'An error occurred while searching for books.' });
    }
};

exports.searchAuthorsByName = async (req, res) => {
    const { name } = req.query;

    if (!name) {
        return res.status(400).json({ message: 'Please enter an author name to search.' });
    }

    try {
        const searchQuery = `%${name}%`;

        const authorsSql = `
            SELECT * FROM Author 
            WHERE Fname LIKE ? OR Lname LIKE ?;
        `;
        const authors = await db.query(authorsSql, [searchQuery, searchQuery]);

        if (authors.length === 0) {
            return res.status(404).json({ message: 'No authors found with this name.' });
        }
        
        const authorId = authors[0].Id;
        const booksSql = `
            SELECT 
                B.Id, B.Title, B.Type, B.Price
            FROM Book B
            WHERE B.AuthorId = ?;
        `;
        const books = await db.query(booksSql, [authorId]);

        return res.status(200).json({ 
            authors: authors,
            booksByFirstAuthor: books
        });

    } catch (error) {
        console.error('Search Authors Error:', error);
        return res.status(500).json({ message: 'An error occurred while searching for authors.' });
    }
};

exports.searchPublishersByName = async (req, res) => {
    const { name } = req.query;

    if (!name) {
        return res.status(400).json({ message: 'Please enter a publisher name to search.' });
    }

    try {
        const searchQuery = `%${name}%`;

        const publishersSql = `
            SELECT * FROM Publisher 
            WHERE PName LIKE ?;
        `;
        const publishers = await db.query(publishersSql, [searchQuery]);

        if (publishers.length === 0) {
            return res.status(404).json({ message: 'No publishers found with this name.' });
        }

        const publisherId = publishers[0].Id;
        const booksSql = `
            SELECT 
                B.Id, B.Title, B.Type, B.Price,
                A.Fname, A.Lname
            FROM Book B
            JOIN Author A ON B.AuthorId = A.Id
            WHERE B.pubId = ?;
        `;
        const books = await db.query(booksSql, [publisherId]);

        return res.status(200).json({ 
            publishers: publishers,
            booksByFirstPublisher: books
        });
        
    } catch (error) {
        console.error('Search Publishers Error:', error);
        return res.status(500).json({ message: 'An error occurred while searching for publishers.' });
    }
};

exports.getAllAuthors = async (req, res) => {
    try {
        const sql = `SELECT Id, Fname, Lname, Country FROM Author ORDER BY Fname ASC;`;
        const authors = await db.query(sql);

        return res.status(200).json({ authors: authors });
    } catch (error) {
        console.error('Get All Authors Error:', error);
        return res.status(500).json({ message: 'An error occurred while fetching the author list.' });
    }
};

exports.getAllPublishers = async (req, res) => {
    try {
        const sql = `SELECT Id, PName, City FROM Publisher ORDER BY PName ASC;`;
        const publishers = await db.query(sql);

        return res.status(200).json({ publishers: publishers });
    } catch (error) {
        console.error('Get All Publishers Error:', error);
        return res.status(500).json({ message: 'An error occurred while fetching the publisher list.' });
    }
};
