const { MessageActionRow, Modal, TextInputComponent } = require('discord.js')
const raidReminderSchema = require('../../mongo-utils/raidReminder/raidReminderSchema.js')

module.exports = {
	name: 'rrUpdateMessageSelectMenu',
	callback: async (client, interaction, globals) => {
		const selectedValue = interaction.values.join()

		// Input components for the Modal
		const mongoId = new TextInputComponent()
			.setCustomId('rrMongoId')
			.setLabel('Reminder IDs')
			.setValue(selectedValue)
			.setRequired(true)
			.setStyle('SHORT')
		const message = new TextInputComponent()
			.setCustomId('rrMessage')
			.setLabel('Message')
			.setStyle('PARAGRAPH')
			.setMaxLength(1024)

		// Modal setup
		const modal = new Modal()
			.setCustomId('rrUpdateMessageModal') // ../.././.util/modals/raidReminder/rrCancelModal.js
			.setTitle('Update Raid Reminder')

		// Add all the components to rows <-- one component per row, maximum 5 rows
		const modalRow1 = new MessageActionRow().addComponents(message)
		const modalRow2 = new MessageActionRow().addComponents(mongoId)

		// Add the rows to the modal
		modal.addComponents(modalRow1, modalRow2, modalRow3, modalRow4)

		// Send the modal
		await interaction.showModal(modal)
		return
	},
}
