const {SlachCommandBuilder} = require('discord.js');

module.exports = {
    data: new SlachCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    async execute(interaction) {
        await interaction.reply('Pong!');
    }
}