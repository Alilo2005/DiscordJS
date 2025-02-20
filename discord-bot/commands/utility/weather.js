const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('weather')
        .setDescription('Gets the current weather for a specified location')
        .addStringOption(option =>
            option.setName('location')
                .setDescription('Choose a location')
                .setRequired(true)
                .addChoices(
                    { name: 'Algiers', value: 'algiers' },
                    { name: 'Médéa', value: 'medea' }
                )),
    async execute(interaction) {
        const location = interaction.options.getString('location');

        // Define coordinates for Algiers and Médéa
        const locations = {
            algiers: { name: 'Algiers, Algeria', latitude: 36.75, longitude: 3.04 },
            medea: { name: 'Médéa, Algeria', latitude: 36.2675, longitude: 2.75 }
        };

        const selectedLocation = locations[location];

        if (!selectedLocation) {
            await interaction.reply('⚠️ Invalid location selected.');
            return;
        }

        const { name, latitude, longitude } = selectedLocation;

        // Fetch weather data using the obtained latitude and longitude
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

        // Mapping of weather codes to emojis and descriptions
        const weatherCodeMappings = {
            0: { emoji: '☀️', description: 'Clear sky' },
            1: { emoji: '🌤️', description: 'Mainly clear' },
            2: { emoji: '⛅', description: 'Partly cloudy' },
            3: { emoji: '☁️', description: 'Overcast' },
            45: { emoji: '🌫️', description: 'Fog' },
            48: { emoji: '🌫️', description: 'Depositing rime fog' },
            51: { emoji: '🌦️', description: 'Light drizzle' },
            53: { emoji: '🌦️', description: 'Moderate drizzle' },
            55: { emoji: '🌧️', description: 'Dense drizzle' },
            56: { emoji: '🌧️', description: 'Light freezing drizzle' },
            57: { emoji: '🌧️', description: 'Dense freezing drizzle' },
            61: { emoji: '🌧️', description: 'Slight rain' },
            63: { emoji: '🌧️', description: 'Moderate rain' },
            65: { emoji: '🌧️', description: 'Heavy rain' },
            66: { emoji: '🌧️', description: 'Light freezing rain' },
            67: { emoji: '🌧️', description: 'Heavy freezing rain' },
            71: { emoji: '🌨️', description: 'Slight snowfall' },
            73: { emoji: '🌨️', description: 'Moderate snowfall' },
            75: { emoji: '🌨️', description: 'Heavy snowfall' },
            77: { emoji: '🌨️', description: 'Snow grains' },
            80: { emoji: '🌧️', description: 'Slight rain showers' },
            81: { emoji: '🌧️', description: 'Moderate rain showers' },
            82: { emoji: '🌧️', description: 'Violent rain showers' },
            85: { emoji: '🌨️', description: 'Slight snow showers' },
            86: { emoji: '🌨️', description: 'Heavy snow showers' },
            95: { emoji: '⛈️', description: 'Thunderstorm' },
            96: { emoji: '⛈️', description: 'Thunderstorm with slight hail' },
            99: { emoji: '⛈️', description: 'Thunderstorm with heavy hail' }
        };

        try {
            const weatherResponse = await axios.get(weatherUrl);
            const weather = weatherResponse.data.current_weather;
            const temperature = weather.temperature;
            const windspeed = weather.windspeed;
            const winddirection = weather.winddirection;
            const weathercode = weather.weathercode;
            const time = weather.time;

            // Get the weather emoji and description based on the weather code
            const { emoji, description } = weatherCodeMappings[weathercode] || { emoji: '❓', description: 'Unknown' };

            await interaction.reply(`${emoji} **Current Weather in ${name}**:
🌡️ Temperature: ${temperature}°C
💨 Wind Speed: ${windspeed} m/s
🧭 Wind Direction: ${winddirection}°
📅 Time: ${time}
🌦️ Condition: ${description}`);
        } catch (error) {
            console.error('Error fetching weather data:', error);
            await interaction.reply('⚠️ Could not fetch weather data. Please try again later.');
        }
    }
};
