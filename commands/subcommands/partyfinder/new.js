// New subcommand for partyfinder
const { MessageActionRow, Modal, TextInputComponent } = require('discord.js')

module.exports = async (interaction, data, globals) => {
	console.log(interaction.id)
	// Input components for the Modal
	const description = new TextInputComponent()
		.setCustomId('pfDescription')
		.setLabel('Description')
		.setPlaceholder("What's the PF for?")
		.setRequired(true)
		.setStyle('SHORT')
	const size = new TextInputComponent()
		.setCustomId('pfSize')
		.setLabel('Party size')
		.setValue(interaction.options.getString('size'))
		.setStyle('SHORT')
		.setRequired(true)
	const date = new TextInputComponent()
		.setCustomId('pfDate')
		.setLabel('Date')
		.setPlaceholder('What day? (Use M/DD, ex. 5/9)')
		.setStyle('SHORT')
	const time = new TextInputComponent()
		.setCustomId('pfTime')
		.setLabel('Time')
		.setPlaceholder('What time? (Use HH:mmAM/PM, ex. 8:30PM)')
		.setStyle('SHORT')
	const timezone = new TextInputComponent()
		.setCustomId('pfTimezone')
		.setLabel('Timezone')
		.setPlaceholder('What timezone? (PST, CST, EST are supported)')
		.setStyle('SHORT')

	// Modal setup
	const modal = new Modal()
		.setCustomId('pfNewModal') // ../.././.util/modals/partyfinder/pfNewModal.js
		.setTitle('New Party finder')

	// Add all the components to rows <-- one component per row, maximum 5 rows
	const modalRow1 = new MessageActionRow().addComponents(description)
	const modalRow2 = new MessageActionRow().addComponents(size)
	const modalRow3 = new MessageActionRow().addComponents(date)
	const modalRow4 = new MessageActionRow().addComponents(time)
	const modalRow5 = new MessageActionRow().addComponents(timezone)

	// Add the rows to the modal
	modal.addComponents(modalRow1, modalRow2, modalRow3, modalRow4, modalRow5)

	// Send the modal
	await interaction.showModal(modal)
	return
}
