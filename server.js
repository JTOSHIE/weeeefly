require('dotenv').config(); const express = require('express'); const 
axios = require('axios'); const cors = require('cors'); const app = 
express(); app.use(cors()); app.use(express.json()); const PORT = 
process.env.PORT || 3000; const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY; 
const SKYSCANNER_API_URL = 'https://sky-scanner3.p.rapidapi.com'; 
app.get('/', (req, res) => {
  res.send('Welcome to Weeeefly API');
});
app.get('/search-cars', async (req, res) => { try { const { 
    pickUpEntityId } = req.query; const response = await 
    axios.get(`${SKYSCANNER_API_URL}/cars/search`, {
      params: { pickUpEntityId }, headers: { 'x-rapidapi-key': 
        RAPIDAPI_KEY, 'x-rapidapi-host': 'sky-scanner3.p.rapidapi.com'
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : 
    error.message); res.status(500).json({ error: 'An error occurred 
    while searching for car rentals' });
  }
});
app.listen(PORT, () => { console.log(`Server running on port ${PORT}`);
});
