// server.js
require('dotenv').config();
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const bookRoutes = require('./src/presentation/routes/bookRoutes');
const errorHandler = require('./src/presentation/middlewares/errorHandler');

const app = express();

// =====================
// Config
// =====================
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0'; // ฟังทุก interface
const dbPath = path.resolve(__dirname, 'libary.db');

// =====================
// Database
// =====================
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Cannot connect to SQLite database:', err.message);
    } else {
        console.log('✅ Connected to SQLite database');
    }
});

// =====================
// Middleware
// =====================
app.use(cors({
    origin: '*', // อนุญาตทุก origin
    methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
    credentials: true
}));
app.use(express.json());
app.use(express.static('public'));

// =====================
// Routes
// =====================
app.use('/api/books', bookRoutes);

// =====================
// Error handler
// =====================
app.use(errorHandler);

// =====================
// Start Server
// =====================
app.listen(PORT, HOST, () => {
    console.log(`🚀 Server running at http://${HOST}:${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// =====================
// Export DB (ถ้าต้องใช้ใน Controller)
// =====================
module.exports = { db };
