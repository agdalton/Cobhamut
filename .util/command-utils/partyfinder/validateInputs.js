// validate inputs for partyfinder command
const reply = require('../interactionReply.js')
const { MessageEmbed } = require('discord.js')

module.exports = (interaction, error_red, partyComp, dataDTTZ) => {
	if (partyComp.hasOwnProperty('err') || !dataDTTZ.isValid) {
		const errEmbed = new MessageEmbed()
			.setTitle('An error ocurred')
			.setDescription(
				'Cobhamut encountered an error while processing your Partyfinder command. See below for details.'
			)
			.setColor(error_red)
			.setAuthor({
				name: clientUsername,
				iconURL: `${baseImageURL}/avatars/${clientID}/${clientAvatar}.png`,
			})
			.setThumbnail(
				'https://cdn1.iconfinder.com/data/icons/basic-ui-elements-color-round/3/61-512.png'
			)
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

		reply(interaction, null, [errEmbed], null, true, false)

		return false
	}

	return true
}
