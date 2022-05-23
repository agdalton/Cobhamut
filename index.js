/*
Cobhamut
Does stuff
*/

// requirements
const { Client, Intents } = require('discord.js')
const { default: mongoose, Connection, mongo } = require('mongoose')
const path = require('path')
const fs = require('fs')

// globals
const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
	],
	partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
})
const globals = {}
globals['baseImageURL'] = 'https://cdn.discordapp.com'
globals['last8BallQuestion'] = { interaction: '', question: '' }
globals['colors'] = {
	error: '#a62828',
	green: '#4be34b',
	white: '#e3dee7',
	purple: '#9c59b6',
	gold: '#f1c40f',
}

// methods
const getApp = (guildId) => {
	const app = client.api.applications(client.user.id)
	if (guildId) {
		app.guilds(guildId)
	}
	return app
}

// when the bot is ready
client.on('ready', async () => {
	console.log('Cobhamut is online!')
	client.user.setActivity('Akh Corn')
	console.log()
	// LOAD COMMANDS //
	// require base command file
	const baseCommandFile = 'commandBase.js'
	const commandBase = require(`./commands/${baseCommandFile}`)
	// build function to read all files in the commands directory
	const readCommands = (dir) => {
		const files = fs.readdirSync(path.join(__dirname, dir))

		for (const file of files) {
			const stat = fs.lstatSync(path.join(__dirname, dir, file))
			if (stat.isDirectory()) {
				continue
			} else if (
				file !== baseCommandFile &&
				path.extname(file) === '.js'
			) {
				const command = require(path.join(__dirname, dir, file))
				commandBase(client, command, globals)
			}
		}
	}

	readCommands('commands')
	// LOAD SELECT MENUS //
	// require base select menu file
	const baseSelectMenuFile = 'selectMenuBase.js'
	const selectMenuBase = require(`./.util/select-menus/${baseSelectMenuFile}`)
	// build function to read all files in the select-menus directory
	const readSelectMenus = (dir) => {
		const files = fs.readdirSync(path.join(__dirname, dir))

		for (const file of files) {
			const stat = fs.lstatSync(path.join(__dirname, dir, file))
			if (stat.isDirectory()) {
				readSelectMenus(path.join(dir, file))
			} else if (
				file !== baseSelectMenuFile &&
				path.extname(file) === '.js'
			) {
				const selectMenu = require(path.join(__dirname, dir, file))
				selectMenuBase(client, selectMenu, globals)
			}
		}
	}

	readSelectMenus('./.util/select-menus')

	// LOAD MODALS //
	// require base modal file
	const baseModalFile = 'modalBase.js'
	const modalBase = require(`./.util/modals/${baseModalFile}`)
	// build function to read all files in the modals directory
	const readModals = (dir) => {
		const files = fs.readdirSync(path.join(__dirname, dir))

		for (const file of files) {
			const stat = fs.lstatSync(path.join(__dirname, dir, file))
			if (stat.isDirectory()) {
				readModals(path.join(dir, file))
			} else if (
				file !== baseModalFile &&
				path.extname(file) === '.js'
			) {
				const modal = require(path.join(__dirname, dir, file))
				modalBase(client, modal, globals)
			}
		}
	}

	readModals('./.util/modals')

	// LOAD REACTION LISTENERS //
	// require base listener file
	const baseReactionListenerFile = 'reactionListenerBase.js'
	const reactionListenerBase = require(`./listeners/reactions/${baseReactionListenerFile}`)
	// build function to read all files in the modals directory
	const readReactionListeners = (dir) => {
		const files = fs.readdirSync(path.join(__dirname, dir))

		for (const file of files) {
			const stat = fs.lstatSync(path.join(__dirname, dir, file))
			if (stat.isDirectory()) {
				readReactionListeners(path.join(dir, file))
			} else if (
				file !== baseModalFile &&
				path.extname(file) === '.js'
			) {
				const reactionListener = require(path.join(__dirname, dir, file))
				reactionListenerBase(client, reactionListener, globals)
			}
		}
	}

	readReactionListeners('./listeners/reactions')

	// Connect to MongoDB
	const connectionStates = {
		0: 'Disconnected',
		1: 'Connected',
		2: 'Connecting',
		3: 'Disconnecting',
	}

	await mongoose.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})

	const { connection } = mongoose
	const state = connectionStates[connection.readyState] || 'Unknown'
	console.log(`MongoDB ${state}`)
	console.log()

	// command DELETE
	//await getApp('681503253623734292').commands('977336279651999784').delete()

	// Log all commands
	const globalCommands = await getApp().commands.get()
	const guildCommands = await getApp('681503253623734292').commands.get()
	console.log('Available global commands')
	console.log('-------------------------')
	console.log(globalCommands)
	console.log()
	console.log('Available guild commands')
	console.log('------------------------')
	console.log(guildCommands)
})

client.login(process.env.COBHAMUT_TOKEN)
