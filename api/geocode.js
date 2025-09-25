export default async function handler(req, res) {
    const query = req.query.q;
    if (!query || query.length < 3){
        return res.status(400).json({error:'Query too short'});
    }    

    const API_KEY = process.env.WEATHER_API_KEY;
    const apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`;

    try{
        const response = await fetch(apiUrl);
        if (!response.ok){
            throw new Error('No results found');
        }
        const data = await response.json();

        const suggestions = data.map(location => ({
            fullName: location.state
                ? `${location.name}, ${location.state} (${location.country})`
                : `${location.name} (${location.country})`,
            name: location.name,
            state: location.state || '',
            country: location.country,
            lat: location.lat,
            lon: location.lon
        }));
        res.status(200).json(suggestions);
    } catch (error){
        res.status(500).json({ error: error.message })
    }
}