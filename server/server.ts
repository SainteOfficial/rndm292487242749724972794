import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Supabase-Client mit sensiblen Informationen
const supabase = createClient(
  process.env.SUPABASE_URL!,          // URL aus .env
  process.env.SUPABASE_SERVICE_KEY!   // Service Key aus .env
);

app.use(express.json());

// Beispiel-API-Endpunkt
app.get('/api/secure-data', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('secure_table')
      .select('*');
      
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
});

app.listen(port, () => {
  console.log(`Server läuft auf Port ${port}`);
}); 