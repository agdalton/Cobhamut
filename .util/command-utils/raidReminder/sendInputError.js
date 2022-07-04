// Send an error for raidReminder command
const reply = require('../interactionReply.js')
const { MessageEmbed } = require('discord.js')

module.exports = (interaction, memberData, globals, inputs) => {
	const { memberID, memberUsername, memberNick, memberAvatar } = memberData
	const { baseImageURL } = globals
	const { orange } = globals.colors

	const errEmbed = new MessageEmbed()
		.setTitle('An error ocurred')
		.setDescription(
			'Cobhamut encountered an error while processing /raidReminder. See below for details.'
		)
		.setColor(orange)
		.setThumbnail(
			'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/htc/37/warning-sign_26a0.png'
		)
		.setFooter({
			text: `${
				memberNick ? memberNick : memberUsername
			} used /raidReminder`,
			iconURL: `${baseImageURL}/avatars/${memberID}/${memberAvatar}.png`,
		})

	// If time, timezone submitted is invalid
	if (!inputs.isValid) {
		// Add the errors to the embed
		for (let iErr = 0; iErr < inputs.err.length; iErr++) {
			errEmbed.addField(
				inputs.err[iErr].field,
				inputs.err[iErr].message
			)
		}
	}

	// Send the errors back to the user ephemerally
	reply(interaction, null, [errEmbed], null, true, false)

    return
}
