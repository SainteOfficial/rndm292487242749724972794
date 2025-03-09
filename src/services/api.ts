export async function getSecureData() {
  try {
    const response = await fetch('/api/secure-data');
    if (!response.ok) {
      throw new Error('Netzwerk-Antwort war nicht ok');
    }
    return response.json();
  } catch (error) {
    console.error('Fehler beim Abrufen der sicheren Daten:', error);
    throw error;
  }
} 