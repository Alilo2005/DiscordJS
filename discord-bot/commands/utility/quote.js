const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quote')
        .setDescription('Fetches a random inspirational quote'),
    async execute(interaction) {
        await interaction.deferReply();

        try {
            const response = await axios.get('https://qapi.vercel.app/api/random');
            const { quote, author } = response.data;

            await interaction.editReply({
                embeds: [{
                    color: 0x0099ff,
                    description: `*"${quote}"*\n\n— **${author}**`
                }]
            });
        } catch (error) {
            console.error('Error fetching quote:', error);
            await interaction.editReply('⚠️ Could not fetch a quote at this time. Please try again later.');
        }
    }
};
