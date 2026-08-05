require('dotenv').config();

const { DISCORD_TOKEN, CLIENT_ID, GUILD_ID } = process.env;

if (!DISCORD_TOKEN) {
	throw new Error('Variabile d\'ambiente mancante: DISCORD_TOKEN. Copia .env.example in .env e compilalo.');
}

if (!CLIENT_ID) {
	throw new Error('Variabile d\'ambiente mancante: CLIENT_ID. Copia .env.example in .env e compilalo.');
}

module.exports = {
	token: DISCORD_TOKEN,
	clientId: CLIENT_ID,
	guildId: GUILD_ID || null,
};
