import express from 'express';
import { supabase } from '../lib/supabaseClient';

const router = express.Router();

// Beispiel: Fahrzeuge abrufen
router.get('/cars', async (req, res) => {
  const { data, error } = await supabase
    .from('cars')
    .select('*');

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Beispiel: Fahrzeug hinzufügen
router.post('/cars', async (req, res) => {
  const { brand, model, year, price } = req.body;
  const { data, error } = await supabase
    .from('cars')
    .insert([{ brand, model, year, price }]);

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

// Beispiel: Fahrzeug löschen
router.delete('/cars/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase
    .from('cars')
    .delete()
    .eq('id', id);

  if (error) return res.status(400).json({ error: error.message });
  res.status(204).send();
});

export default router; 