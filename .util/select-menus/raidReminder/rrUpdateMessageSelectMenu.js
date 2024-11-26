const {
	ActionRowBuilder,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
} = require('discord.js')
const raidReminderSchema = require('../../mongo-utils/raidReminder/raidReminderSchema.js')

module.exports = {
	name: 'rrUpdateMessageSelectMenu',
	callback: async (client, interaction, globals) => {
		const selectedValue = interaction.values.join()

		// Input components for the Modal
		const mongoId = new TextInputBuilder()
			.setCustomId('rrMongoIds')
			.setLabel('Reminder IDs')
			.setValue(selectedValue)
			.setRequired(true)
			.setStyle(TextInputStyle.Short)
		const message = new TextInputBuilder()
			.setCustomId('rrMessage')
			.setLabel('Message')
			.setStyle(TextInputStyle.Paragraph)
			.setMaxLength(1024)
			.setRequired(true)

		// Modal setup
		const modal = new ModalBuilder()
			.setCustomId('rrUpdateMessageModal') // ../.././.util/modals/raidReminder/rrCancelModal.js
			.setTitle('Update Raid Reminder')

		// Add all the components to rows <-- one component per row, maximum 5 rows
		const modalRow1 = new ActionRowBuilder().addComponents(message)
		const modalRow2 = new ActionRowBuilder().addComponents(mongoId)

		// Add the rows to the modal
		modal.addComponents(modalRow1, modalRow2)

		// Send the modal
		await interaction.showModal(modal)
		return
	},
}
