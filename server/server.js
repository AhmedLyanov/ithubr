// server/server.js
const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;
const uri = 'mongodb+srv://Razved4ik_06:SectorAdmin006@sectorit.laybrou.mongodb.net/?retryWrites=true&w=majority&appName=SectorIT';


const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db('Sector_Discipline');

    app.get('/api/frameworks', async (req, res) => {
      const frameworks = await db.collection('frameworks').find({}).toArray();
      res.json(frameworks);
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