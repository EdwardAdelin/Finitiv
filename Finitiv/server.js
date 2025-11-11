const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Connect to SQLite database
const db = new sqlite3.Database('./database.db');

// Create tables
db.serialize(() => {
  // Photos table
  db.run(`CREATE TABLE IF NOT EXISTS photos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    image_url TEXT
  )`);

  // Contacts table
  db.run(`CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    message TEXT,
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Insert dummy photos if not exist
  db.get("SELECT COUNT(*) as count FROM photos", (err, row) => {
    if (row.count === 0) {
      const photos = [
        { title: 'Romantic Sunset Wedding', description: 'A beautiful couple exchanging vows as the sun sets, creating a magical atmosphere.', image_url: 'https://picsum.photos/800/600?random=1' },
        { title: 'Bridal Portrait', description: 'Elegant bridal portrait with soft lighting and natural beauty.', image_url: 'https://picsum.photos/800/600?random=2' },
        { title: 'Wedding Reception', description: 'Joyful moments at the reception with family and friends celebrating.', image_url: 'https://picsum.photos/800/600?random=3' },
        { title: 'First Dance', description: 'The first dance as husband and wife, captured in timeless elegance.', image_url: 'https://picsum.photos/800/600?random=4' },
        { title: 'Bouquet Toss', description: 'Fun and tradition at the bouquet toss ceremony.', image_url: 'https://picsum.photos/800/600?random=5' },
        { title: 'Engagement Session', description: 'Intimate engagement photos in a scenic location.', image_url: 'https://picsum.photos/800/600?random=6' }
      ];

      const stmt = db.prepare("INSERT INTO photos (title, description, image_url) VALUES (?, ?, ?)");
      photos.forEach(photo => {
        stmt.run(photo.title, photo.description, photo.image_url);
      });
      stmt.finalize();
    }
  });

  // Log existing contacts count
  db.get("SELECT COUNT(*) as count FROM contacts", (err, row) => {
    if (!err) {
      console.log(`Database initialized. Existing contacts: ${row.count}`);
    }
  });
});

// API endpoints
app.get('/api/photos', (req, res) => {
  db.all("SELECT * FROM photos", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  console.log('Received contact form submission:', { name, email, message });

  const stmt = db.prepare("INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)");
  stmt.run(name, email, message, function(err) {
    if (err) {
      console.error('Database error:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    console.log('Contact saved with ID:', this.lastID);
    res.json({ message: 'Contact form submitted successfully', id: this.lastID });
  });
  stmt.finalize();
});

app.listen(port, () => {
  console.log(`Finitiv Portfolio server running at http://localhost:${port}`);
});