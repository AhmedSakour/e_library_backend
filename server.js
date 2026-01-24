const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const generalRoutes = require('./routes/general.routes');
const db = require('./db'); 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_PORT:", process.env.DB_PORT);

async function testDbConnection() {
    try {
        const result = await db.query('SELECT 1 + 1 AS solution');
        console.log('Successfully connected to the database!');
        console.log('Test result:', result[0].solution);
    } catch (error) {
        console.error(' Database connection failed:', error.message);
    }
}

testDbConnection(); 

app.use(express.json()); 

app.get('/', (req, res) => {
    res.send('E-Library Backend Server is Running!');
});

app.use((req, res, next) => {
    console.log(`Request received for: ${req.method} ${req.url}`);
    next(); 
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/general', generalRoutes);

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
    console.log(`http://192.168.1.37:${PORT}`); 
});
