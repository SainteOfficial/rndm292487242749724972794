import express from 'express';
import apiRoutes from './routes/api';

const app = express();
app.use(express.json()); // Middleware für JSON-Parsing

app.use('/api', apiRoutes); // API-Routen

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
}); 