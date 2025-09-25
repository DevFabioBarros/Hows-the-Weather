export default async function handler(req, res) {
    const city = req.query.city;
    const lat = req.query.lat;
    const lon = req.query.lon;

    if (!city && (!lat || !lon)) {
        return res.status(400).json({ error: 'City or coordinates are required' });
    }

    const API_KEY = process.env.WEATHER_API_KEY;
    let apiUrl;
    if (lat && lon){
        apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    } else{
        apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    }

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Location not found');
        }
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
