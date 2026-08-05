const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const dataFile = path.join(dataDir, 'queues.json');

let state = { guilds: {} };

function loadFromDisk() {
	if (!fs.existsSync(dataFile)) {
		return;
	}
	try {
		const raw = fs.readFileSync(dataFile, 'utf8');
		const parsed = JSON.parse(raw);
		if (parsed && typeof parsed === 'object' && parsed.guilds) {
			state = parsed;
		}
	} catch (err) {
		console.warn(`[queueStore] queues.json non leggibile (${err.message}), parto da stato vuoto.`);
		try {
			fs.renameSync(dataFile, `${dataFile}.bak`);
		} catch {
			// ignora: il file corrotto non è bloccante, si riparte comunque da stato vuoto
		}
	}
}

// fs.writeFileSync/renameSync sono sincroni: bloccano l'event loop finché non finiscono,
// quindi due save() ravvicinati non possono mai interlacciarsi e corrompere il file.
function save() {
	try {
		fs.mkdirSync(dataDir, { recursive: true });
		const tmpFile = `${dataFile}.tmp`;
		fs.writeFileSync(tmpFile, JSON.stringify(state, null, 2), 'utf8');
		fs.renameSync(tmpFile, dataFile);
	} catch (err) {
		console.warn(`[queueStore] Impossibile salvare la coda su disco: ${err.message}`);
	}
}

function ensureGuild(guildId) {
	if (!state.guilds[guildId]) {
		state.guilds[guildId] = { queue: [] };
	}
	return state.guilds[guildId];
}

function getQueue(guildId) {
	return ensureGuild(guildId).queue.slice();
}

function addUser(guildId, userId) {
	const guild = ensureGuild(guildId);
	const existingIndex = guild.queue.indexOf(userId);
	if (existingIndex !== -1) {
		return { added: false, position: existingIndex + 1 };
	}
	guild.queue.push(userId);
	save();
	return { added: true, position: guild.queue.length };
}

function removeUser(guildId, userId) {
	const guild = ensureGuild(guildId);
	const index = guild.queue.indexOf(userId);
	if (index === -1) {
		return { removed: false };
	}
	const wasCurrentTurn = index === 0;
	guild.queue.splice(index, 1);
	save();
	return {
		removed: true,
		wasCurrentTurn,
		newCurrent: wasCurrentTurn ? (guild.queue[0] || null) : null,
	};
}

function advanceTurn(guildId) {
	const guild = ensureGuild(guildId);
	if (guild.queue.length === 0) {
		return { empty: true };
	}
	const previous = guild.queue.shift();
	save();
	return { empty: false, previous, next: guild.queue[0] || null };
}

function skipTurn(guildId) {
	const guild = ensureGuild(guildId);
	if (guild.queue.length === 0) {
		return { empty: true };
	}
	if (guild.queue.length === 1) {
		return { empty: false, onlyOne: true, user: guild.queue[0] };
	}
	const [current] = guild.queue.splice(0, 1);
	guild.queue.push(current);
	save();
	return { empty: false, onlyOne: false, user: current, next: guild.queue[0] };
}

function clearQueue(guildId) {
	const guild = ensureGuild(guildId);
	guild.queue = [];
	save();
}

loadFromDisk();

module.exports = {
	getQueue,
	addUser,
	removeUser,
	advanceTurn,
	skipTurn,
	clearQueue,
};
