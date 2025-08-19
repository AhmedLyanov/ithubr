require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || 'Sector_Discipline';


const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:5173'];

app.use(cors({
  origin: function (origin, callback) {
 
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const client = new MongoClient(MONGODB_URI);

async function run() {
  try {
    await client.connect();
    const db = client.db(DB_NAME);

    app.get('/api/frameworks', async (req, res) => {
      try {
        const frameworks = await db.collection('frameworks').find({}).toArray();
        res.json(frameworks);
      } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    app.listen(PORT, () => {
      console.log(`🚀 Сервер запущен: http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Ошибка MongoDB:', err);
    await client.close();
    process.exit(1);
  }
}

run();

process.on('SIGINT', async () => {
  await client.close();
  process.exit();
});
