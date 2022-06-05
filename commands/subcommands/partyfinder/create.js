// New subcommand for partyfinder
const { MessageActionRow, Modal, TextInputComponent } = require('discord.js')

module.exports = async (interaction, data, globals) => {
	// Get subcommand optoins
	const pfDescription = interaction.options.getString('description')
	const pfSize = interaction.options.getString('size')
	const pfPingRole = interaction.options.getRole('ping')
	const pfDate = interaction.options.getString('date')
	const pfTime = interaction.options.getString('time')
	const pfAMPM = interaction.options.getString('ampm')
	const pfTimezone = interaction.options.getString('timezone')

	

	
	return
}
