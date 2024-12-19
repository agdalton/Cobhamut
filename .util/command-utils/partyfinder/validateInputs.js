// validate inputs for partyfinder command
const reply = require('../interactionReply.js')
const { EmbedBuilder } = require('discord.js')

module.exports = (interaction, memberData, globals, partyComp, dataDTTZ) => {
	const { memberID, memberUsername, memberNick, memberAvatar } = memberData
	const { baseImageURL } = globals
	const { orange } = globals.colors

	// If the partyComp has an error or the date, time, timezone inputs return invalid
	if (partyComp.hasOwnProperty('err') || !dataDTTZ.isValid) {
		const errEmbed = new EmbedBuilder()
			.setTitle('An error ocurred')
			.setDescription(
				'Cobhamut encountered an error while processing /partyfinder. See below for details.'
			)
			.setColor(orange)
			.setThumbnail(
				'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/htc/37/warning-sign_26a0.png'
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
			errEmbed.addFields({
				name: compErr.field,
				value: compErr.message,
			})
		}
		// If date, time, timezone submitted is invalid
		if (!dataDTTZ.isValid) {
			// Add the errors to the embed
			for (let iErr = 0; iErr < dataDTTZ.err.length; iErr++) {
				errEmbed.addFields({
					name: dataDTTZ.err[iErr].field,
					value: dataDTTZ.err[iErr].message,
				})
			}
		}

		// Send the errors back to the user ephemerally
		reply(interaction, null, [errEmbed], null, true, false)

		return false
	}

	return true
}
