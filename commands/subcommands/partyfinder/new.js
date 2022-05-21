// New subcommand for partyfinder
const {
	MessageActionRow,
	MessageSelectMenu,
	Modal,
	TextInputComponent,
} = require('discord.js')
const moment_timezone = require('moment-timezone')
const interactionReply = require('../../../.util/command-utils/interaction-reply')

module.exports = async (interaction, data, globals) => {
	const {
		clientId,
		clientUsername,
		clientAvatar,
		memberUsername,
		memberNick,
		baseImageURL,
	} = data
	const { lunar_white } = globals

	// Input components
	const description = new TextInputComponent()
		.setCustomId('pfDescription')
		.setLabel('Description')
		.setPlaceholder("What's the PF for?")
		.setRequired(true)
		.setStyle('SHORT')
	const date = new TextInputComponent()
		.setCustomId('pfDate')
		.setLabel('Date')
		.setPlaceholder('What day? (Use M/dd)')
		.setStyle('SHORT')
	const time = new TextInputComponent()
		.setCustomId('pfTime')
		.setLabel('Time')
		.setPlaceholder('What time? (Use H:mm AM/PM)')
		.setStyle('SHORT')
	const timezone = new TextInputComponent()
		.setCustomId('pfTimezone')
		.setLabel('Timezone')
		.setPlaceholder('What timezone? (Use PST, CST, EST, etc.)')
		.setStyle('SHORT')

	// Modal config
	const modal = new Modal()
		.setCustomId('pfModal')
		.setTitle('New Partyfinder')

	const modalRow1 = new MessageActionRow().addComponents(description)
	const modalRow2 = new MessageActionRow().addComponents(date)
	const modalRow3 = new MessageActionRow().addComponents(time)
    const modalRow4 = new MessageActionRow().addComponents(timezone)

	modal.addComponents(modalRow1, modalRow2, modalRow3, modalRow4)

	// Send the modal
	await interaction.showModal(modal)
	return
}
