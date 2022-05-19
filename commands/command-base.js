/*

    Base command structure. Used with DiscordJS Slash commands.
    Will poll all commands in the commands directory and compare
    them to the existing commands returned from the api. New commands
    will be posted to the bot and existing commands will be patched.
    Next, the bot awaits a command to be used and will execute the callback
    provided in the command configuration file.

*/

module.exports = async (client, command, globals) => {
	let { name, guildId, callback, data } = command

	// add the GuildId to the application if it's a Guild Command
	postCommands(client.api.applications(client.user.id), guildId, data)

	// wait for an interaction
	client.on('interactionCreate', (interaction) => {
		// process command callback
		if (interaction.isCommand() && name === interaction.commandName)
			callback(client, interaction, globals)

		return
	})
}

// ------- module methods ------- //
const postCommands = async (app, guildId, data) => {
	// add the GuildId to the application if it's a Guild Command
	if (guildId) {
		app.guilds(guildId)
	}

	// post the command to the bot
	await app.commands.post({
		data: data,
	})
}
