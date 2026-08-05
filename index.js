const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const config = require('./config');
const queueStore = require('./storage/queueStore');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
for (const file of fs.readdirSync(commandsPath).filter((f) => f.endsWith('.js'))) {
	const command = require(path.join(commandsPath, file));
	client.commands.set(command.data.name, command);
}

client.once('ready', () => {
	console.log(`Connesso come ${client.user.tag}.`);
});

client.on('interactionCreate', async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	if (!interaction.inGuild()) {
		await interaction.reply({ content: 'Questo comando funziona solo nei server.', ephemeral: true });
		return;
	}

	const command = interaction.client.commands.get(interaction.commandName);
	if (!command) return;

	try {
		await command.execute(interaction, queueStore);
	} catch (err) {
		console.error(`Errore nell'esecuzione di /${interaction.commandName}:`, err);
		const errorReply = { content: 'Si è verificato un errore, riprova.', ephemeral: true };
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp(errorReply);
		} else {
			await interaction.reply(errorReply);
		}
	}
});

process.on('unhandledRejection', (err) => {
	console.error('Unhandled promise rejection:', err);
});

client.on('error', (err) => {
	console.error('Errore del client Discord:', err);
});

client.login(config.token);
