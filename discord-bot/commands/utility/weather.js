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

        try {
            const weatherResponse = await axios.get(weatherUrl);
            const weather = weatherResponse.data.current_weather;
            const temperature = weather.temperature;
            const windspeed = weather.windspeed;
            const winddirection = weather.winddirection;
            const weathercode = weather.weathercode;
            const time = weather.time;

            await interaction.reply(`🌤 **Current Weather in ${name}**:
🌡 Temperature: ${temperature}°C
💨 Wind Speed: ${windspeed} m/s
🧭 Wind Direction: ${winddirection}°
📅 Time: ${time}
🌦 Weather Code: ${weathercode}`);
        } catch (error) {
            console.error('Error fetching weather data:', error);
            await interaction.reply('⚠️ Could not fetch weather data. Please try again later.');
        }
    }
};
