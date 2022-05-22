/*
Base file for processing modals
*/

module.exports = async (client, modal, globals) => {
	let { name, callback } = modal
	// wait for an interaction
	client.on('interactionCreate', (interaction) => {
		// process command callback
		console.log(interaction)
		if (interaction.isModalSubmit() && name === interaction.customId)
			callback(client, interaction, globals)

		return
	})
}
