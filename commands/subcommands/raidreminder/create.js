// Create subcommand for raidreminder
const {
	MessageActionRow,
	Modal,
	TextInputComponent,
	MessageSelectMenu,
} = require('discord.js')

module.exports = async (interaction, data, globals) => {
	// Get modal fields from the interaction
	const inputs = []
	inputs.push(interaction.options.getRole('role'))
	inputs.push(interaction.options.getChannel('channel').id)
	inputs.push(interaction.options.getInteger('reminder'))

	// Input components for the Modal
	const title = new TextInputComponent()
		.setCustomId('rrTitle')
		.setLabel('Title')
		.setPlaceholder('Weekly raid with friends!')
		.setStyle('SHORT')
		.setRequired(true)
	const message = new TextInputComponent()
		.setCustomId('rrMessage')
		.setLabel('Message')
		.setPlaceholder("Don't forget we raid today!")
		.setRequired(true)
		.setStyle('PARAGRAPH')
		.setMaxLength(1024)
	const days = new TextInputComponent()
		.setCustomId('rrDays')
		.setLabel('Raid days')
		.setPlaceholder('Tues,Wed,Thurs')
		.setStyle('SHORT')
		.setRequired(true)
	const timeTZ = new TextInputComponent()
		.setCustomId('rrTimeTZ')
		.setLabel('Raid Start Time')
		.setPlaceholder('8:30PM EST')
		.setStyle('SHORT')
		.setRequired(true)
	const roleChannelHours = new TextInputComponent()
		.setCustomId('rrRoleChannelHours')
		.setLabel('Role, Channel, Hours')
		.setValue(inputs.join())
		.setStyle('SHORT')
		.setRequired(true)

	// Modal setup
	const modal = new Modal()
		.setCustomId('rrCreateModal') // ../.././.util/modals/raidReminder/rrCreateModal.js
		.setTitle('New Raid Reminder')

	// Add all the components to rows <-- one component per row, maximum 5 rows
	const modalRow1 = new MessageActionRow().addComponents(title)
	const modalRow2 = new MessageActionRow().addComponents(message)
	const modalRow3 = new MessageActionRow().addComponents(days)
	const modalRow4 = new MessageActionRow().addComponents(timeTZ)
	const modalRow5 = new MessageActionRow().addComponents(roleChannelHours)

	// Add the rows to the modal
	modal.addComponents(modalRow1, modalRow2, modalRow3, modalRow4, modalRow5)
	// Send the modal
	await interaction.showModal(modal)
	return
}
