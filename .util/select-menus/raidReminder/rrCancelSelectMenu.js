const { MessageActionRow, Modal, TextInputComponent } = require('discord.js')

module.exports = {
	name: 'rrCancelSelectMenu',
	callback: async (client, interaction, globals) => {
		console.log(interaction)
		// Input components for the Modal
		const mongoId = new TextInputComponent()
			.setCustomId('rrMongoId')
			.setLabel('Reminder ID')
			.setRequired(true)
			.setStyle('SHORT')
		//const description = new TextInputComponent().setCustomId('rrDays').setLabel('Days').setValue()
		const confirm = new TextInputComponent()
			.setCustomId('rrConfirm')
			.setLabel(
				'Type CANCEL below to proceed with canceling this reminder'
			)
			.setPlaceholder('Tues,Wed,Thurs')
			.setStyle('SHORT')
			.setRequired(true)

		// Modal setup
		const modal = new Modal()
			.setCustomId('rrCancelModal') // ../.././.util/modals/raidReminder/rrCancelModal.js
			.setTitle('Cancel Raid Reminder')

		// Add all the components to rows <-- one component per row, maximum 5 rows
		const modalRow1 = new MessageActionRow().addComponents(mongoId)
		const modalRow2 = new MessageActionRow().addComponents(confirm)

		// Add the rows to the modal
		modal.addComponents(modalRow1, modalRow2)

		// Send the modal
		await interaction.showModal(modal)
		return
	},
}
