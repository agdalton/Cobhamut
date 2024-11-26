const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js')
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
		const mongoId = new TextInputBuilder()
			.setCustomId('rrMongoId')
			.setLabel('Reminder ID')
			.setValue(selectedValue)
			.setRequired(true)
			.setStyle(TextInputStyle.Short)
		const title = new TextInputBuilder()
			.setCustomId('rrTitle')
			.setLabel('Title')
			.setValue(reminderData.title)
			.setStyle(TextInputStyle.Short)
		const description = new TextInputBuilder()
			.setCustomId('rrDays')
			.setLabel('Raid Schedule')
			.setValue(
				`${reminderData.days} @ ${reminderData.time} ${reminderData.friendlyTZ} | ${reminderData.reminderHours} hour reminder`
			)
			.setStyle(TextInputStyle.Short)
		const confirm = new TextInputBuilder()
			.setCustomId('rrConfirm')
			.setLabel('To proceed type SKIP')
			.setPlaceholder('SKIP')
			.setStyle(TextInputStyle.Short)
			.setRequired(true)

		// Modal setup
		const modal = new ModalBuilder()
			.setCustomId('rrSkipModal') // ../.././.util/modals/raidReminder/rrSkipModal.js
			.setTitle('Skip Raid Reminder')

		// Add all the components to rows <-- one component per row, maximum 5 rows
		const modalRow1 = new ActionRowBuilder().addComponents(title)
		const modalRow2 = new ActionRowBuilder().addComponents(description)
		const modalRow3 = new ActionRowBuilder().addComponents(mongoId)
		const modalRow4 = new ActionRowBuilder().addComponents(confirm)

		// Add the rows to the modal
		modal.addComponents(modalRow1, modalRow2, modalRow3, modalRow4)

		// Send the modal
		await interaction.showModal(modal)

		return
	},
}
