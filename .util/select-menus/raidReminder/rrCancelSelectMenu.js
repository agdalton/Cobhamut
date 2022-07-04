const { MessageActionRow, Modal, TextInputComponent } = require('discord.js')
const raidReminderSchema = require('../../mongo-utils/raidReminder/raidReminderSchema.js')

module.exports = {
	name: 'rrCancelSelectMenu',
	callback: async (client, interaction, globals) => {
		const selectedValue = interaction.values[0]

		// Get reminder data
		const reminder = await raidReminderSchema.findOne({
			_id: selectedValue,
		})

		const reminderData = JSON.parse(reminder.dataSubmission)

		// Input components for the Modal
		const mongoId = new TextInputComponent()
			.setCustomId('rrMongoId')
			.setLabel('Reminder ID')
			.setValue(selectedValue)
			.setRequired(true)
			.setStyle('SHORT')
		const description = new TextInputComponent()
			.setCustomId('rrDays')
			.setLabel('Days')
			.setValue(
				`${reminderData.days} @ ${reminderData.time} ${reminderData.timezone}`
			)
		const confirm = new TextInputComponent()
			.setCustomId('rrConfirm')
			.setLabel('To proceed type CANCEL')
			.setPlaceholder('CANCEL')
			.setStyle('SHORT')
			.setRequired(true)

		// Modal setup
		const modal = new Modal()
			.setCustomId('rrCancelModal') // ../.././.util/modals/raidReminder/rrCancelModal.js
			.setTitle('Cancel Raid Reminder')

		// Add all the components to rows <-- one component per row, maximum 5 rows
		const modalRow1 = new MessageActionRow().addComponents(mongoId)
		const modalRow2 = new MessageActionRow().addComponents(description)
		const modalRow3 = new MessageActionRow().addComponents(confirm)

		// Add the rows to the modal
		modal.addComponents(modalRow1, modalRow2, modalRow3)

		// Send the modal
		await interaction.showModal(modal)
		return
	},
}
