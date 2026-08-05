const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('lista')
		.setDescription('Mostra la coda di chi deve parlare')
		.setDMPermission(false),
	async execute(interaction, queueStore) {
		const queue = queueStore.getQueue(interaction.guildId);
		if (queue.length === 0) {
			await interaction.reply('La coda è vuota. Usa /iscriviti per aggiungerti!');
			return;
		}

		const [current, next, ...rest] = queue;
		const embed = new EmbedBuilder()
			.setTitle('Coda per parlare')
			.setColor(0x5865f2)
			.addFields(
				{ name: '🎙️ In turno ora', value: `<@${current}>` },
				{ name: '⏭️ Prossimo', value: next ? `<@${next}>` : '—' },
				{ name: '📋 In coda', value: rest.length ? rest.map((id, i) => `${i + 1}. <@${id}>`).join('\n') : '—' },
			)
			.setFooter({ text: `${queue.length} in totale` });

		await interaction.reply({ embeds: [embed] });
	},
};
