const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rimuovi')
		.setDescription('Rimuove un utente specifico dalla coda')
		.addUserOption((option) =>
			option.setName('utente').setDescription('Utente da rimuovere dalla coda').setRequired(true),
		)
		.setDMPermission(false),
	async execute(interaction, queueStore) {
		const target = interaction.options.getUser('utente', true);
		const result = queueStore.removeUser(interaction.guildId, target.id);
		if (!result.removed) {
			await interaction.reply({ content: `${target} non è in coda.`, ephemeral: true });
			return;
		}
		const base = `${target} è stato rimosso dalla coda da ${interaction.user}.`;
		const msg = result.wasCurrentTurn
			? result.newCurrent
				? `${base} Ora tocca a <@${result.newCurrent}>!`
				: `${base} La coda è ora vuota.`
			: base;
		await interaction.reply(msg);
	},
};
