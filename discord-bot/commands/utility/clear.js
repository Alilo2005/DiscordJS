const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Deletes a specified number of messages from the channel.')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('The number of messages to delete (1-100)')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages), // Restrict command to users with Manage Messages permission
    async execute(interaction) {
        const amount = interaction.options.getInteger('amount');

        // Ensure the amount is between 1 and 100
        if (amount < 1 || amount > 100) {
            return interaction.reply({ content: 'Please enter a number between 1 and 100.', ephemeral: true });
        }

        // Defer the reply to acknowledge the command
        await interaction.deferReply({ ephemeral: true });

        try {
            // Fetch the specified number of messages
            const messages = await interaction.channel.messages.fetch({ limit: amount });
            // Bulk delete the messages
            await interaction.channel.bulkDelete(messages, true);

            // Reply with a confirmation
            await interaction.editReply({ content: `🧹 Successfully deleted ${messages.size} messages.`, ephemeral: true });
        } catch (error) {
            console.error('Error deleting messages:', error);
            await interaction.editReply({ content: '⚠️ An error occurred while trying to delete messages. Please ensure the messages are not older than 14 days and that I have the necessary permissions.', ephemeral: true });
        }
    },
};
