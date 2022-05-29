// validate inputs for partyfinder command
const reply = require('../interactionReply.js')
const { MessageEmbed } = require('discord.js')

module.exports = (interaction, memberData, globals, partyComp, dataDTTZ) => {
	const { memberID, memberUsername, memberNick, memberAvatar } = memberData
	const { baseImageURL } = globals
	const { error } = globals.colors

	// If the partyComp has an error or the date, time, timezone inputs return invalid
	if (partyComp.hasOwnProperty('err') || !dataDTTZ.isValid) {
		const errEmbed = new MessageEmbed()
			.setTitle('An error ocurred')
			.setDescription(
				'Cobhamut encountered an error while processing /partyfinder. See below for details.'
			)
			.setColor(error)
			.setThumbnail(
				'https://cdn1.iconfinder.com/data/icons/basic-ui-elements-color-round/3/61-512.png'
			)
			.setFooter({
				text: `${
					memberNick ? memberNick : memberUsername
				} used /partyfinder`,
				iconURL: `${baseImageURL}/avatars/${memberID}/${memberAvatar}.png`,
			})
		// If invalid Party size
		if (partyComp.hasOwnProperty('err')) {
			const compErr = partyComp.err
			errEmbed.addField(compErr.field, compErr.message)
		}
		// If date, time, timezone submitted is invalid
		if (!dataDTTZ.isValid) {
			// Add the errors to the embed
			for (let iErr = 0; iErr < dataDTTZ.err.length; iErr++) {
				errEmbed.addField(
					dataDTTZ.err[iErr].field,
					dataDTTZ.err[iErr].message
				)
			}
		}

		// Send the errors back to the user ephemerally
		reply(interaction, null, [errEmbed], null, true, false)

		return false
	}

	return true
}
