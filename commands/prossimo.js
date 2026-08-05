const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('prossimo')
		.setDescription('Fa avanzare il turno: chi ha parlato lascia il posto al successivo')
		.setDMPermission(false),
	async execute(interaction, queueStore) {
		const result = queueStore.advanceTurn(interaction.guildId);
		if (result.empty) {
			await interaction.reply({ content: 'Non c\'è nessuno in coda.', ephemeral: true });
			return;
		}
		const msg = result.next
			? `<@${result.previous}> ha finito di parlare. Ora tocca a <@${result.next}>!`
			: `<@${result.previous}> ha finito di parlare. La coda è ora vuota.`;
		await interaction.reply(msg);
	},
};
