const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('joke')
        .setDescription('Tells a random joke'),
    async execute(interaction) {
        try {
            const response = await axios.get('https://official-joke-api.appspot.com/random_joke');
            const joke = response.data;

            const jokeEmbed = new EmbedBuilder()
                .setColor(0x00FF00) // Set the color of the embed
                .setTitle('Here\'s a Joke for You!')
                .addFields(
                    { name: 'Setup', value: joke.setup },
                    { name: 'Punchline', value: joke.punchline }
                )
                .setFooter({ text: 'Enjoy your day with a smile!' });

            await interaction.reply({ embeds: [jokeEmbed] });
        } catch (error) {
            console.error('Error fetching joke:', error);
            await interaction.reply('Sorry, I couldn\'t fetch a joke at this time.');
        }
    },
};
