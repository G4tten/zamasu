const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ritirati')
		.setDescription('Ti rimuove dalla coda per parlare')
		.setDMPermission(false),
	async execute(interaction, queueStore) {
		const result = queueStore.removeUser(interaction.guildId, interaction.user.id);
		if (!result.removed) {
			await interaction.reply({ content: 'Non sei in coda.', ephemeral: true });
			return;
		}
		if (result.wasCurrentTurn) {
			const msg = result.newCurrent
				? `${interaction.user} si è ritirato dalla coda. Ora tocca a <@${result.newCurrent}>!`
				: `${interaction.user} si è ritirato dalla coda. La coda è ora vuota.`;
			await interaction.reply(msg);
			return;
		}
		await interaction.reply({ content: 'Ti sei ritirato dalla coda.', ephemeral: true });
	},
};
