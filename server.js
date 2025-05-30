import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  console.error('Error:', error.message);
  res.status(error.status || 500).json({ error: error.message });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});