const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('aiuto')
		.setDescription("Mostra l'elenco dei comandi disponibili")
		.setDMPermission(false),
	async execute(interaction) {
		const embed = new EmbedBuilder()
			.setTitle('Comandi disponibili')
			.setColor(0x5865f2)
			.addFields(
				{ name: '/iscriviti', value: 'Ti aggiunge in fondo alla coda per parlare.' },
				{ name: '/ritirati', value: 'Ti rimuove dalla coda.' },
				{ name: '/lista', value: 'Mostra chi è in turno, chi è il prossimo e il resto della coda.' },
				{ name: '/prossimo', value: 'Fa avanzare il turno al successivo in coda.' },
				{ name: '/salta', value: 'Sposta chi è in turno in fondo alla coda senza rimuoverlo.' },
				{ name: '/rimuovi', value: 'Rimuove un utente specifico dalla coda.' },
				{ name: '/svuota', value: 'Svuota completamente la coda.' },
				{ name: '/aiuto', value: 'Mostra questo messaggio.' },
			);
		await interaction.reply({ embeds: [embed], ephemeral: true });
	},
};
