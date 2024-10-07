const Discord = require('discord.js')
const { EmbedBuilder, REST, Routes, ActivityType, Client, Events, GatewayIntentBits, Collection, Status } = require('discord.js');
require('dotenv').config()
const fs = require('node:fs');
const path = require('node:path');

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildPresences] });

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

const { Server } = require('socket.io');
const { createServer } = require('http');

const httpServer = createServer();
const io = new Server(httpServer, {
	cors: {
		origin: '*',
	},
});

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction, client);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});


// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
	// client.user.setActivity("default", { type: ActivityType.Playing }); //debug

	io.on("connection", (socket) => {
		console.log("Socket connected");
		console.log(socket.id);
		
		//change status text based on socket message
		socket.on("setStatusText", (statusText) => {
			console.log("New status Text: " + statusText);
			if (statusText == "") {
				console.log("No status text set");
				return;
			}

			if (client.user.presence.activities[0].type) {
				client.user.setActivity(statusText, { type: client.user.presence.activities[0].type });
			} else {
				console.log("No previous status");
			}
		});

		function setStatus(statusText, statusType) {
			if (statusText == "") {
				console.log("No status text set");
				return;
			}
			if (statusType == "") {
				statusType = "Playing";
			}

			switch(statusType) {
				case "Playing":
					client.user.setActivity(statusText, { type: ActivityType.Playing });
					break;
				case "Streaming":
					client.user.setActivity(statusText, { type: ActivityType.Streaming });
					break;
				case "Listening":
					client.user.setActivity(statusText, { type: ActivityType.Listening });
					break;
				case "Watching":
					client.user.setActivity(statusText, { type: ActivityType.Watching });
					break;
				case "Competing":
					client.user.setActivity(statusText, { type: ActivityType.Competing });
					break;
				default:
					console.log("Invalid status type");
					break;
			}
		}

		//change status type based on socket message
		socket.on("setStatusType", (statusType) => {
			console.log("New status Type: " + statusType);
			if (!client.user.presence.activities[0].name) {
				console.log("No status text set");
				return;
			}
			setStatus(client.user.presence.activities[0].name, statusType);
		});

		//change presence status based on socket message
		socket.on("setPresenceStatus", (status) => {
			console.log("New presence status: " + status);
			switch(status) {
				case "Online":
					client.user.setPresence({
						status: "online",
					});
					break;
				case "Idle":
					client.user.setPresence({
						status: "idle",
					});
					break;
				case "DoNotDisturb":
					client.user.setPresence({
						status: "dnd",
					});
					break;
				case "Invisible":
					client.user.setPresence({
						status: "invisible",
					});
					break;
				case "Offline":
					client.user.setPresence({
						status: "offline",
					});
					break;
				default:
					console.log("Invalid presence status");
					break;
			}
		});

		//new status
		socket.on("newStatus", (statusText, statusType) => {
			console.log("New status: " + statusText + " " + statusType);
			if (statusText == "") {
				console.log("No status text set");
				return;
			}
			setStatus(statusText, statusType);
		});

	});
	  
	httpServer.listen(3000);
});


// Log in to Discord with your client's token
client.login(TOKEN);