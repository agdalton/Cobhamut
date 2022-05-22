/*
Cobhamut
Does stuff
*/

// requirements
const { Client, Intents } = require('discord.js')
const path = require('path')
const fs = require('fs')

// globals
const client = new Client({ intents: [Intents.FLAGS.GUILDS] })
const globals = {}
globals['baseImageURL'] = 'https://cdn.discordapp.com'
globals['last8BallQuestion'] = { interaction: '', question: '' }
globals['error_red'] = '#a62828'
globals['green'] = '#4be34b'
globals['lunar_white'] = '#E3DEE7'
globals['lunar_purple'] = '#9c59b6'
globals['legend27'] = '#f1c40f'

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
	const baseCommandFile = 'command-base.js'
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
	const baseSelectMenuFile = 'select-menu-base.js'
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
	const baseModalFile = 'modal-base.js'
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
