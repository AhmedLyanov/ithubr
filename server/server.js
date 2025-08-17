const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();

// Точная настройка CORS
const allowedOrigins = ['https://ithubr.vercel.app', 'http://localhost:5173'];

app.use(cors({
  origin: function (origin, callback) {
    // Разрешить запросы без origin (например, от мобильных приложений или Postman)
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

const PORT = process.env.PORT || 3001;
const uri = 'mongodb+srv://Razved4ik_06:SectorAdmin006@sectorit.laybrou.mongodb.net/?retryWrites=true&w=majority&appName=SectorIT';

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db('Sector_Discipline');

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
