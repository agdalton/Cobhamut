const { MessageActionRow, Modal, TextInputComponent } = require('discord.js')
const raidReminderSchema = require('../../mongo-utils/raidReminder/raidReminderSchema.js')

module.exports = {
	name: 'rrSkipSelectMenu',
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
		const title = new TextInputComponent()
			.setCustomId('rrTitle')
			.setLabel('Title')
			.setValue(reminderData.title)
			.setStyle('SHORT')
		const description = new TextInputComponent()
			.setCustomId('rrDays')
			.setLabel('Raid Schedule')
			.setValue(
				`${reminderData.days} @ ${reminderData.time} ${reminderData.friendlyTZ} | ${reminderData.reminderHours} hour reminder`
			)
			.setStyle('SHORT')
		const confirm = new TextInputComponent()
			.setCustomId('rrConfirm')
			.setLabel('To proceed type SKIP')
			.setPlaceholder('SKIP')
			.setStyle('SHORT')
			.setRequired(true)

		// Modal setup
		const modal = new Modal()
			.setCustomId('rrSkipModal') // ../.././.util/modals/raidReminder/rrSkipModal.js
			.setTitle('Skip Raid Reminder')

		// Add all the components to rows <-- one component per row, maximum 5 rows
		const modalRow1 = new MessageActionRow().addComponents(title)
		const modalRow2 = new MessageActionRow().addComponents(description)
		const modalRow3 = new MessageActionRow().addComponents(mongoId)
		const modalRow4 = new MessageActionRow().addComponents(confirm)

		// Add the rows to the modal
		modal.addComponents(modalRow1, modalRow2, modalRow3, modalRow4)

		// Send the modal
		await interaction.showModal(modal)

		return
	},
}
