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
	const partySize = new MessageSelectMenu()
		.setCustomId('pfPartySize')
		.setOptions([
			{
				label: '4 players',
				description: 'Light party',
				value: '4',
			},
			{
				label: '8 players',
				description: 'Full party',
				value: '8',
			},
			{
				label: '24 players',
				description: 'Alliance',
				value: '24',
			},
		])
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
	const timezone = new MessageSelectMenu()
		.setCustomId('pfTimezone')
		.setOptions(getTimezones(moment_timezone))
	// Modal config
	const modal = new Modal()
		.setCustomId('pfModal')
		.setTitle('New Partyfinder')

	const modalRow1 = new MessageActionRow().addComponents(description)
	const modalRow2 = new MessageActionRow().addComponents(partySize)
	const modalRow3 = new MessageActionRow().addComponents(
		date,
		time,
		timezone
	)

    modal.addComponents(modalRow1, modalRow2, modalRow3)

	// Send the modal
	await interaction.showModal(modal)
    return
}
// Module methods //
getTimezones = (moment) => {
    const tzAmerica = moment.tz.zonesForCountry('US')
    const options = []
    for (let i = 0; i < tzAmerica.length; i++) {
        const option = new Object()
        option['label'] = tzAmerica[i]
        option['description'] = ''
        option['value'] = tzAmerica[i]
        options.push(option)
    }
    return options
}