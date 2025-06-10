require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'golden_wings_custom',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
}).array('images', 5); // Max 5 files per upload

// Database connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Successfully connected to the database');
    connection.release();
    return true;
  } catch (error) {
    console.error('Error connecting to the database:', error);
    return false;
  }
}

// API Routes

// Get all services
app.get('/api/services', async (req, res) => {
  try {
    const [services] = await pool.query('SELECT * FROM services ORDER BY name');
    res.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// Get all garages
app.get('/api/garages', async (req, res) => {
  try {
    const [garages] = await pool.query('SELECT * FROM garages ORDER BY name');
    res.json(garages);
  } catch (error) {
    console.error('Error fetching garages:', error);
    res.status(500).json({ error: 'Failed to fetch garages' });
  }
});

// Get booked dates for a specific garage
app.get('/api/appointments/garage/:garageId/dates', async (req, res) => {
  try {
    const { garageId } = req.params;
    
    // Get all booked dates for the garage
    const [bookedAppointments] = await pool.query(
      'SELECT DISTINCT DATE(appointment_date) as date FROM appointments WHERE garage_id = ? AND status != "cancelled"',
      [garageId]
    );
    
    // Extract just the date strings
    const bookedDates = bookedAppointments.map(appt => appt.date.toISOString().split('T')[0]);
    
    res.json(bookedDates);
  } catch (error) {
    console.error('Error fetching booked dates:', error);
    res.status(500).json({ error: 'Failed to fetch booked dates' });
  }
});

// Get all artworks with their images
app.get('/api/artworks', async (req, res) => {
  try {
    const [artworks] = await pool.query('SELECT * FROM artworks ORDER BY completion_date DESC');
    
    // Get images for each artwork
    for (let artwork of artworks) {
      const [images] = await pool.query('SELECT * FROM artwork_images WHERE artwork_id = ?', [artwork.id]);
      artwork.images = images;
    }
    
    res.json(artworks);
  } catch (error) {
    console.error('Error fetching artworks:', error);
    res.status(500).json({ error: 'Failed to fetch artworks' });
  }
});

// Create a new appointment
app.post('/api/appointments', async (req, res) => {
  try {
    const { garage_id, service_id, appointment_date, client_name, client_email, client_phone, notes } = req.body;
    
    // Basic validation
    if (!garage_id || !service_id || !appointment_date || !client_name || !client_email || !client_phone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Insert appointment
    const [result] = await pool.query(
      'INSERT INTO appointments (garage_id, service_id, appointment_date, client_name, client_email, client_phone, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [garage_id, service_id, new Date(appointment_date), client_name, client_email, client_phone, notes || '']
    );
    
    res.status(201).json({
      id: result.insertId,
      message: 'Appointment created successfully',
      appointment: {
        id: result.insertId,
        garage_id,
        service_id,
        appointment_date,
        client_name,
        client_email,
        client_phone,
        notes: notes || '',
        status: 'pending'
      }
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ error: 'Failed to create appointment' });
  }
});

// Upload artwork images
app.post('/api/artworks/:id/images', (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    
    try {
      const artworkId = req.params.id;
      const files = req.files;
      
      if (!files || files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
      }
      
      // Save file references to database
      const imageInserts = files.map(file => ({
        artwork_id: artworkId,
        image_url: `/uploads/${file.filename}`,
        is_primary: false
      }));
      
      // If this is the first image, set it as primary
      if (imageInserts.length > 0) {
        imageInserts[0].is_primary = true;
      }
      
      // Insert image records
      for (const image of imageInserts) {
        await pool.query(
          'INSERT INTO artwork_images (artwork_id, image_url, is_primary) VALUES (?, ?, ?)',
          [image.artwork_id, image.image_url, image.is_primary]
        );
      }
      
      res.status(201).json({ 
        message: 'Images uploaded successfully',
        files: files.map(f => ({
          filename: f.filename,
          path: `/uploads/${f.filename}`,
          size: f.size
        }))
      });
    } catch (error) {
      console.error('Error uploading images:', error);
      res.status(500).json({ error: 'Failed to upload images' });
    }
  });
});

// Get all garages
app.get('/api/garages', async (req, res) => {
  try {
    // This would normally come from a database
    const garages = [
      { id: 1, name: 'G.W.C Casa' },
      { id: 2, name: 'G.W.C Rabat' },
      { id: 3, name: 'G.W.C Marrakech' }
    ];
    
    res.json(garages);
  } catch (error) {
    console.error('Error fetching garages:', error);
    res.status(500).json({ error: 'Failed to fetch garages' });
  }
});

// Get all services
app.get('/api/services', async (req, res) => {
  try {
    // This would normally come from a database
    const services = [
      { id: 1, name: 'Custom Paint Job', description: 'Full custom paint job with your choice of colors and finishes' },
      { id: 2, name: 'Interior Customization', description: 'Custom interior work including seats, dashboard, and trim' },
      { id: 3, name: 'Performance Upgrade', description: 'Engine and performance modifications' },
      { id: 4, name: 'Body Kit Installation', description: 'Custom body kits and aerodynamic modifications' },
      { id: 5, name: 'Detailing', description: 'Professional interior and exterior detailing' }
    ];
    
    res.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
async function startServer() {
  const dbConnected = await testConnection();
  if (!dbConnected) {
    console.error('Failed to connect to the database. Please check your database configuration.');
    process.exit(1);
  }
  
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

startServer();
