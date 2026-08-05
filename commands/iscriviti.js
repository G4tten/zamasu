const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('iscriviti')
		.setDescription('Ti aggiunge in fondo alla coda per parlare')
		.setDMPermission(false),
	async execute(interaction, queueStore) {
		const result = queueStore.addUser(interaction.guildId, interaction.user.id);
		if (!result.added) {
			await interaction.reply({ content: `Sei già in coda, in ${result.position}ª posizione.`, ephemeral: true });
			return;
		}
		await interaction.reply({ content: `Ti sei iscritto! Sei il ${result.position}º in coda.`, ephemeral: true });
	},
};
