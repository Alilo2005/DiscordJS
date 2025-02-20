const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('notify')
        .setDescription('Schedules a custom notification')
        .addStringOption(option =>
            option.setName('time')
                .setDescription('Time to notify (HH:MM) in GMT+1')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('description')
                .setDescription('Custom message for the notification')
                .setRequired(false))
        .addMentionableOption(option => 
            option.setName('mention')
                .setDescription('User or role to mention')
                .setRequired(false)),
    async execute(interaction) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral }); // Prevents command expiration

        const time = interaction.options.getString('time');
        const description = interaction.options.getString('description') || 'This is your scheduled notification!';
        const mention = interaction.options.getMentionable('mention');
        let [hour, minute] = time.split(':').map(Number);

        if (isNaN(hour) || isNaN(minute) || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
            await interaction.editReply('⚠️ Invalid time format! Please use **HH:MM** (24-hour format).');
            return;
        }

        console.log(`Scheduling notification for ${hour}:${minute} (GMT+1)`);

        const now = new Date();
        const scheduledTime = new Date(now);
        
        // Convert input time (GMT+1) to UTC
        scheduledTime.setHours(hour - 1, minute, 0, 0); // Adjust for system UTC if needed

        let delay = scheduledTime - now;
        if (delay < 0) {
            scheduledTime.setDate(scheduledTime.getDate() + 1);
            delay = scheduledTime - now;
        }

        console.log(`Current system time: ${now.toLocaleString()} (UTC)`);
        console.log(`Scheduled time: ${scheduledTime.toLocaleString()} (UTC)`);
        console.log(`Notification will be sent in ${Math.round(delay / 1000)} seconds`);

        await interaction.editReply(`✅ **Notification Scheduled!**  
🕒 Time: **${time} (GMT+1)**  
📜 Message: **"${description}"**  
🔔 Mention: ${mention ? mention.toString() : 'None'}`);

        setTimeout(async () => {
            try {
                console.log('Sending scheduled notification...');
                const channel = await interaction.client.channels.fetch(interaction.channelId);
                if (channel) {
                    await channel.send(`🔔 **Notification!**
${mention ? mention.toString() : ''} 📜 ${description}`);
                    console.log('Notification sent successfully.');
                } else {
                    console.error('Channel not found.');
                }
            } catch (error) {
                console.error('Failed to send notification:', error);
            }
        }, delay);
    }
};
