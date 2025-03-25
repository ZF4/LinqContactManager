const express = require("express");
const app = express();
const cors = require("cors");
const db = require('./db');

const corsOptions = {
    origin: ["http://localhost:5173"],
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

// Check if email exists
app.get("/api/contacts/check-email", async (req, res) => {
    const { email, excludeId } = req.query;
    try {
        let query = 'SELECT id FROM contacts WHERE email = $1';
        let params = [email];
        
        if (excludeId) {
            query += ' AND id != $2';
            params.push(excludeId);
        }
        
        const result = await db.query(query, params);
        res.json({ exists: result.rows.length > 0 });
    } catch (err) {
        console.error('Error checking email:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create a new contact
app.post("/api/contacts", async (req, res) => {
    const { name, email } = req.body;
    try {
        // Check if email already exists
        const emailCheck = await db.query('SELECT id FROM contacts WHERE email = $1', [email]);
        if (emailCheck.rows.length > 0) {
            return res.status(400).json({ error: 'A contact with this email already exists' });
        }

        const result = await db.query(
            'INSERT INTO contacts (name, email) VALUES ($1, $2) RETURNING *',
            [name, email]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error creating contact:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update a contact
app.put("/api/contacts/:id", async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    try {
        // Check if email already exists for a different contact
        const emailCheck = await db.query(
            'SELECT id FROM contacts WHERE email = $1 AND id != $2',
            [email, id]
        );
        if (emailCheck.rows.length > 0) {
            return res.status(400).json({ error: 'A contact with this email already exists' });
        }

        const result = await db.query(
            'UPDATE contacts SET name = $1, email = $2 WHERE id = $3 RETURNING *',
            [name, email, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Contact not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating contact:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a contact
app.delete("/api/contacts/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM contacts WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Contact not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error deleting contact:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(8080, () => {
    console.log("Server started on port 8080");
});