// New subcommand for partyfinder
const { MessageActionRow, Modal, TextInputComponent } = require('discord.js')

module.exports = async (interaction, data, globals) => {
	console.log(interaction.options.getRole('mentionRole'))
	// Input components for the Modal
	const description = new TextInputComponent()
		.setCustomId('pfDescription')
		.setLabel('Description')
		.setPlaceholder("Eden's Verse: Furor with friends!")
		.setRequired(true)
		.setStyle('SHORT')
	const size = new TextInputComponent()
		.setCustomId('pfSize')
		.setLabel('Party size')
		.setValue(interaction.options.getString('size'))
		.setPlaceholder('8')
		.setStyle('SHORT')
		.setRequired(true)
	const date = new TextInputComponent()
		.setCustomId('pfDate')
		.setLabel('Date')
		.setPlaceholder('5/9')
		.setStyle('SHORT')
	const timeTZ = new TextInputComponent()
		.setCustomId('pfTimeTimezone')
		.setLabel('Time and Timezone')
		.setPlaceholder('8:30PM EST')
		.setStyle('SHORT')
	const mentionRole = new TextInputComponent()
		.setCustomId('pfMentionRole')
		.setLabel('Ping role')
		.setValue(interaction.options.getRole('ping').toString())
		.setPlaceholder('Discord role snowflake')
		.setStyle('SHORT')

	// Modal setup
	const modal = new Modal()
		.setCustomId('pfNewModal') // ../.././.util/modals/partyfinder/pfNewModal.js
		.setTitle('New Party finder')

	// Add all the components to rows <-- one component per row, maximum 5 rows
	const modalRow1 = new MessageActionRow().addComponents(description)
	const modalRow2 = new MessageActionRow().addComponents(size)
	const modalRow3 = new MessageActionRow().addComponents(date)
	const modalRow4 = new MessageActionRow().addComponents(timeTZ)
	const modalRow5 = new MessageActionRow().addComponents(mentionRole)

	// Add the rows to the modal
	modal.addComponents(modalRow1, modalRow2, modalRow3, modalRow4, modalRow5)

	// Send the modal
	await interaction.showModal(modal)
	return
}
