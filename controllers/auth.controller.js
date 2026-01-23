const db = require('../db');          
const argon2 = require('argon2'); 
const jwt = require('jsonwebtoken');  

const JWT_SECRET = process.env.JWT_SECRET; 

exports.signup = async (req, res) => {
    const Username = req.body.Username ? req.body.Username.trim() : null;
    const password = req.body.password ? req.body.password.trim() : null;
    const FName = req.body.FName ? req.body.FName.trim() : null;
    const LName = req.body.LName ? req.body.LName.trim() : null;

    if (!Username || !password || !FName || !LName) {
        return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    try {
        const hashedPassword = await argon2.hash(password); 

        const sql = "INSERT INTO `User` (Username, password, FName, LName, isAdmin) VALUES (?, ?, ?, ?, FALSE)";

        await db.query(sql, [Username, hashedPassword, FName, LName]);

        return res.status(201).json({ 
            message: 'User created successfully. You can now log in.',
        });

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Username already exists.' });
        }
        console.error('Signup Error:', error);
        return res.status(500).json({ message: 'A server error occurred while creating the user.' });
    }
};

exports.login = async (req, res) => {
    
    const Username = req.body.Username ? req.body.Username.trim() : null;
    const password = req.body.password ? req.body.password.trim() : null;

    if (!Username || !password) {
        return res.status(400).json({ message: 'Please provide username and password.' });
    }

    try {
        const sql = 'SELECT lid, Username, password, isAdmin, FName FROM `User` WHERE Username = ?';
        const rows = await db.query(sql, [Username]);

        if (!rows || rows.length === 0) {
            return res.status(401).json({ message: 'Invalid username or password.' });
        }
        
        const user = rows[0];

        if (!user.password) {
            console.error(`User ${user.Username} found but password field is NULL/Empty.`);
            return res.status(401).json({ message: 'Invalid username or password.' });
        }
     
        const isMatch = await argon2.verify(user.password, password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username or password.' });
        }

        const token = jwt.sign(
            { lid: user.lid, isAdmin: Boolean(user.isAdmin) },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        return res.status(200).json({
            message: 'Login successful.',
            token: token,
            isAdmin: user.isAdmin,
            user: { lid: user.lid, Username: user.Username, FName: user.FName }
        });

    } catch (error) {
        console.error('Login Error (Argon2 Catch):', error.message || error);
        return res.status(500).json({ message: 'A server error occurred.' });
    }
};
