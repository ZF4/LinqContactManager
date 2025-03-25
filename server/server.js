const express = require("express");
const app = express();
const cors = require("cors");
const db = require('./db');

const corsOptions = {
    origin: ["http://localhost:5174"],
};

app.use(cors(corsOptions));
app.use(express.json());

// Get all contacts
app.get("/api/contacts", async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM contacts ORDER BY name');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching contacts:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`Port ${PORT} is busy, trying to close existing connections...`);
        // Try to close the server gracefully
        server.close(() => {
            console.log('Server closed. Please restart the server.');
        });
    } else {
        console.error('Server error:', err);
    }
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Closing server...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});