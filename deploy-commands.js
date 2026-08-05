const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');
const config = require('./config');

const commandsPath = path.join(__dirname, 'commands');
const commands = fs
	.readdirSync(commandsPath)
	.filter((f) => f.endsWith('.js'))
	.map((file) => require(path.join(commandsPath, file)).data.toJSON());

const rest = new REST().setToken(config.token);

(async () => {
	try {
		const route = config.guildId
			? Routes.applicationGuildCommands(config.clientId, config.guildId)
			: Routes.applicationCommands(config.clientId);
		const scope = config.guildId ? `guild ${config.guildId}` : 'globale';

		const data = await rest.put(route, { body: commands });
		console.log(`Registrati ${data.length} comandi slash (scope: ${scope}).`);
	} catch (err) {
		console.error('Errore nella registrazione dei comandi:', err);
		process.exitCode = 1;
	}
})();
