const express = require('express');
const axios = require('axios'); 

// *** קריאת המפתח ממשתנה סביבה ב-Render ***
const RENDER_API_KEY = process.env.RENDER_API_KEY; 
// **********************************************

const app = express();
const PORT = process.env.PORT || 3000; 
const RENDER_API_BASE = 'https://api.render.com/v1';

app.get('/', (req, res) => {
    res.json({ 
        status: "OK", 
        message: "Node API Reader Service is running. Use /services to fetch data.",
        documentation: "API Docs: /services"
    });
});

app.get('/services', async (req, res) => {
    try {
        // לוודא שיש מפתח לפני שמתחילים
        if (!RENDER_API_KEY) {
            return res.status(500).json({ error: 'API Key not configured.' });
        }
        
        // ... שאר לוגיקת ה-Axios נשארת זהה ...
        const response = await axios.get(`${RENDER_API_BASE}/services`, {
            headers: {
                'Authorization': `Bearer ${RENDER_API_KEY}`,
                'Accept': 'application/json'
            }
        });
        
        // ...
        res.json({ services: response.data });

    } catch (error) {
        // ...
        res.status(500).json({ error: 'Failed to retrieve services from Render API', details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Node Server is running on port ${PORT}`);
});