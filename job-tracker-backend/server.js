import express from 'express';
import cors from 'cors';
import pkg from 'pg';

const { Client } = pkg;
const app = express();
const port = 3001;

const db = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, 
  },
});

db.connect()
  .then(() => {
    console.log('Connected to PostgreSQL');
    
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS "job-tracker" (
        id UUID PRIMARY KEY,
        company VARCHAR(100) NOT NULL,
        status VARCHAR(50) NOT NULL,
        date DATE,
        link VARCHAR(255)
      );
    `;
    
    return db.query(createTableQuery);
  })
  .then(() => console.log('Table "job-tracker" is ready'))
  .catch(err => console.error('Database connection error or table creation failed', err.stack));


app.use(cors()); 
app.use(express.json()); 

app.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM "job-tracker"');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/drop-table', async (req, res) => {
  const dropTableQuery = 'DROP TABLE IF EXISTS "job-tracker";';
  try {
    await db.query(dropTableQuery);
    res.status(200).send('Table "job-tracker" dropped.');
  } catch (error) {
    console.error('Error dropping table:', error);
    res.status(500).json({ error: 'Error dropping table' });
  }
});

app.get('/schema', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'job-tracker'
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching schema:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


app.post('/jobs', async (req, res) => {
    const { id, company, status, date, link } = req.body;
    const dateValue = date || null;
    try {
        const result = await db.query(
            'INSERT INTO "job-tracker" (id, company, status, date, link) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [id, company, status, dateValue, link]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding job:', error.message, error.stack);
        res.status(500).json({ error: 'Server error' });
    }
});

app.put('/jobs/:id', async (req, res) => {
    const { id } = req.params;
    const { company, status, date, link } = req.body;
    const dateValue = date || null;
    try {
        const result = await db.query(
            'UPDATE "job-tracker" SET company = $1, status = $2, date = $3, link = $4 WHERE id = $5 RETURNING *',
            [company, status, dateValue, link, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).send({ message: 'Job not found' });
        }
        res.status(200).send(result.rows[0]); 
    } catch (error) {
        res.status(500).send({ message: 'Error updating job', error });
    }
});

app.delete('/jobs/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await db.query('DELETE FROM "job-tracker" WHERE id = $1 RETURNING *', [id]);
      if (result.rowCount > 0) {
        res.status(200).json(result.rows[0]);
      } else {
        res.status(404).json({ message: 'Job not found' });
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
