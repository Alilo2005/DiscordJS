// filepath: /workspaces/DiscordJS/discord-bot/commands/utility/notify.js
const { SlashCommandBuilder } = require('discord.js');
const schedule = require('node-schedule');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('notify')
        .setDescription('Schedules a notification')
        .addStringOption(option =>
            option.setName('time')
                .setDescription('Time to notify (HH:MM)')
                .setRequired(true)),
    async execute(interaction) {
        const time = interaction.options.getString('time');
        const [hour, minute] = time.split(':').map(Number);

        // Schedule the notification
        schedule.scheduleJob({ hour, minute }, async () => {
            await interaction.channel.send('This is your scheduled notification!');
        });

        await interaction.reply(`Notification scheduled for ${time}`);
    }
}