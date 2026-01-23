const db = require('../db');

exports.addAuthor = async (req, res) => {
    const { Fname, Lname, Country, City, Address } = req.body;

    if (!Fname || !Lname) {
        return res.status(400).json({ message: 'Please provide the author’s first and last name.' });
    }

    try {
        const sql = `
            INSERT INTO Author (Fname, Lname, Country, City, Address)
            VALUES (?, ?, ?, ?, ?)
        `;
        const result = await db.query(sql, [Fname, Lname, Country, City, Address]);

        return res.status(201).json({
            message: 'Author added successfully.',
            authorId: result.insertId 
        });
    } catch (error) {
        console.error('Add Author Error:', error);
        return res.status(500).json({ message: 'A server error occurred while adding the author.' });
    }
};

exports.addPublisher = async (req, res) => {
    const { PName, City } = req.body;

    if (!PName) {
        return res.status(400).json({ message: 'Please provide the publisher name.' });
    }

    try {
        const sql = `INSERT INTO Publisher (PName, City) VALUES (?, ?)`;
        const result = await db.query(sql, [PName, City]);

        return res.status(201).json({
            message: 'Publisher added successfully.',
            publisherId: result.insertId   
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'The publisher name already exists.' });
        }
        console.error('Add Publisher Error:', error);
        return res.status(500).json({ message: 'A server error occurred while adding the publisher.' });
    }
};

exports.addBook = async (req, res) => {
    const { Title, Type, Price, pubId, AuthorId } = req.body;

    if (!Title || !pubId || !AuthorId) {
        return res.status(400).json({ message: 'Please provide the book title, author ID, and publisher ID.' });
    }

    try {
        const sql = `
            INSERT INTO Book (Title, Type, Price, pubId, AuthorId)
            VALUES (?, ?, ?, ?, ?)
        `;
        const result = await db.query(sql, [Title, Type, Price, pubId, AuthorId]);

        return res.status(201).json({
            message: 'Book added successfully.',
            bookId: result.insertId
        });
    } catch (error) {
        console.error('Add Book Error:', error);
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(404).json({ message: 'The specified author or publisher was not found.' });
        }
        return res.status(500).json({ message: 'A server error occurred while adding the book.' });
    }
};
