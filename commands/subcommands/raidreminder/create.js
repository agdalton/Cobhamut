// Create subcommand for raidreminder
const { MessageActionRow, Modal, TextInputComponent } = require('discord.js')

module.exports = async (interaction, data, globals) => {
	// Get size, ping from the interaction
	const roleAndChannel = []
	roleAndChannel.push(interaction.options.getRole('role'))
	roleAndChannel.push(interaction.options.getChannel('channel').id)

	// Input components for the Modal
	const message = new TextInputComponent()
		.setCustomId('rrMessage')
		.setLabel('Message')
		.setPlaceholder("Don't forget we raid today!")
		.setRequired(true)
		.setStyle('PARAGRAPH')
	const days = new TextInputComponent()
		.setCustomId('rrDays')
		.setLabel('Raid days')
		.setPlaceholder('Tues,Wed,Thurs')
		.setStyle('SHORT')
		.setRequired(true)
	const time = new TextInputComponent()
		.setCustomId('rrTime')
		.setLabel('Time')
		.setPlaceholder('8:30PM')
		.setStyle('SHORT')
		.setRequired(true)
	const timezone = new TextInputComponent()
		.setCustomId('rrTimezone')
		.setLabel('Timezone')
		.setPlaceholder('EST')
		.setStyle('SHORT')
		.setRequired(true)
	const inputRoleAndChannel = new TextInputComponent()
		.setCustomId('rrRoleAndChannel')
		.setLabel('Role and Channel')
		.setValue(roleAndChannel.join())
		.setStyle('SHORT')
		.setRequired(true)

	// Modal setup
	const modal = new Modal()
		.setCustomId('rrCreateModal') // ../.././.util/modals/raidReminder/rrCreateModal.js
		.setTitle('New Raid Reminder')

	// Add all the components to rows <-- one component per row, maximum 5 rows
	const modalRow1 = new MessageActionRow().addComponents(message)
	const modalRow2 = new MessageActionRow().addComponents(days)
	const modalRow3 = new MessageActionRow().addComponents(time)
	const modalRow4 = new MessageActionRow().addComponents(timezone)
	const modalRow5 = new MessageActionRow().addComponents(inputRoleAndChannel)

	// Add the rows to the modal
	modal.addComponents(modalRow1, modalRow2, modalRow3, modalRow4, modalRow5)

	// Send the modal
	await interaction.showModal(modal)
	return
}
