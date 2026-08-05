const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('salta')
		.setDescription('Sposta chi è in turno in fondo alla coda senza rimuoverlo')
		.setDMPermission(false),
	async execute(interaction, queueStore) {
		const result = queueStore.skipTurn(interaction.guildId);
		if (result.empty) {
			await interaction.reply({ content: 'Non c\'è nessuno in coda.', ephemeral: true });
			return;
		}
		if (result.onlyOne) {
			await interaction.reply({ content: `<@${result.user}> è l'unico in coda, il turno resta a lui/lei.`, ephemeral: true });
			return;
		}
		await interaction.reply(
			`Il turno di <@${result.user}> è stato saltato. Ora tocca a <@${result.next}>. <@${result.user}> è stato rimesso in fondo alla coda.`,
		);
	},
};
