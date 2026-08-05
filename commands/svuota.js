const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('svuota')
		.setDescription('Svuota completamente la coda')
		.setDMPermission(false),
	async execute(interaction, queueStore) {
		queueStore.clearQueue(interaction.guildId);
		await interaction.reply(`La coda è stata svuotata da ${interaction.user}.`);
	},
};
