// Create subcommand for partyfinder
const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js')

module.exports = async (interaction, data, globals) => {
	// Get size, ping from the interaction
	const partySize = interaction.options.getString('size')
	let pingRole = interaction.options.getRole('ping') || ''

	// Set pingRole to string if it's not empty
	if (pingRole !== '') pingRole = pingRole.toString()

	// Input components for the Modal
	const description = new TextInputBuilder()
		.setCustomId('pfDescription')
		.setLabel('Description')
		.setPlaceholder("Eden's Verse: Furor with friends!")
		.setRequired(true)
		.setStyle(TextInputStyle.Short)
	const size = new TextInputBuilder()
		.setCustomId('pfSize')
		.setLabel('Party size')
		.setValue(partySize)
		.setPlaceholder('8')
		.setStyle(TextInputStyle.Short)
		.setRequired(true)
	const date = new TextInputBuilder()
		.setCustomId('pfDate')
		.setLabel('Date')
		.setPlaceholder('5/9')
		.setStyle(TextInputStyle.Short)
	const timeTZ = new TextInputBuilder()
		.setCustomId('pfTimeTimezone')
		.setLabel('Time and Timezone')
		.setPlaceholder('8:30PM EST')
		.setStyle(TextInputStyle.Short)
	const mentionRole = new TextInputBuilder()
		.setCustomId('pfMentionRole')
		.setLabel('Ping role')
		.setValue(pingRole)
		.setStyle(TextInputStyle.Short)

	// Modal setup
	const modal = new ModalBuilder()
		.setCustomId('pfNewModal') // ../.././.util/modals/partyfinder/pfNewModal.js
		.setTitle('New Partyfinder')

	// Add all the components to rows <-- one component per row, maximum 5 rows
	const modalRow1 = new ActionRowBuilder().addComponents(description)
	const modalRow2 = new ActionRowBuilder().addComponents(size)
	const modalRow3 = new ActionRowBuilder().addComponents(date)
	const modalRow4 = new ActionRowBuilder().addComponents(timeTZ)
	const modalRow5 = new ActionRowBuilder().addComponents(mentionRole)

	// Add the rows to the modal
	modal.addComponents(modalRow1, modalRow2, modalRow3, modalRow4, modalRow5)

	// Send the modal
	await interaction.showModal(modal)
	return
}
