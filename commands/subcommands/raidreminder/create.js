// Create subcommand for raidreminder
const {
	ActionRowBuilder,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
} = require('discord.js')

module.exports = async (interaction, data, globals) => {
	// Get modal fields from the interaction
	const inputs = []
	inputs.push(interaction.options.getRole('role'))
	inputs.push(interaction.options.getChannel('channel').id)
	inputs.push(interaction.options.getInteger('reminder'))

	// Input components for the Modal
	const title = new TextInputBuilder()
		.setCustomId('rrTitle')
		.setLabel('Title')
		.setPlaceholder('Weekly raid with friends!')
		.setStyle(TextInputStyle.Short)
		.setRequired(true)
	const message = new TextInputBuilder()
		.setCustomId('rrMessage')
		.setLabel('Message')
		.setPlaceholder("Don't forget we raid today!")
		.setRequired(true)
		.setStyle(TextInputStyle.Paragraph)
		.setMaxLength(1024)
	const days = new TextInputBuilder()
		.setCustomId('rrDays')
		.setLabel('Raid days')
		.setPlaceholder('Tues,Wed,Thurs')
		.setStyle(TextInputStyle.Short)
		.setRequired(true)
	const timeTZ = new TextInputBuilder()
		.setCustomId('rrTimeTZ')
		.setLabel('Raid Start Time')
		.setPlaceholder('8:30PM EST')
		.setStyle(TextInputStyle.Short)
		.setRequired(true)
	const roleChannelHours = new TextInputBuilder()
		.setCustomId('rrRoleChannelHours')
		.setLabel('Role, Channel, Hours')
		.setValue(inputs.join())
		.setStyle(TextInputStyle.Short)
		.setRequired(true)

	// Modal setup
	const modal = new ModalBuilder()
		.setCustomId('rrCreateModal') // ../.././.util/modals/raidReminder/rrCreateModal.js
		.setTitle('New Raid Reminder')

	// Add all the components to rows <-- one component per row, maximum 5 rows
	const modalRow1 = new ActionRowBuilder().addComponents(title)
	const modalRow2 = new ActionRowBuilder().addComponents(message)
	const modalRow3 = new ActionRowBuilder().addComponents(days)
	const modalRow4 = new ActionRowBuilder().addComponents(timeTZ)
	const modalRow5 = new ActionRowBuilder().addComponents(roleChannelHours)

	// Add the rows to the modal
	modal.addComponents(modalRow1, modalRow2, modalRow3, modalRow4, modalRow5)
	// Send the modal
	await interaction.showModal(modal)
	return
}
