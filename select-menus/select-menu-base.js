/*
Base file for processing select menus
*/

module.exports = async (client, selectMenu, globals) => {
	let { name, callback } = selectMenu
	// wait for an interaction
	client.on('interactionCreate', (interaction) => {
		// process command callback
		if (interaction.isSelectMenu() && name === interaction.customId)
			callback(client, interaction, globals)

		return
	})
}
