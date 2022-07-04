// Retrieve a list of raid reminders created by the user and present an option to delete a selection
const { MessageEmbed } = require('discord.js')
const interactionReply = require('../../../.util/command-utils/interactionReply.js')
const getUserRemindersMenu = require('../../../.util/command-utils/raidReminder/getUserRemindersMenu.js')

module.exports = async (interaction, data, globals) => {
	// Destruct globals
	const { baseImageURL } = globals
	const { purple } = globals.colors

	// Setup member data to pass as necessary <-- this is data about the person who sent the command
	const memberData = {
		memberID: interaction.member.user.id,
		memberUsername: interaction.member.user.username,
		memberNick: interaction.member.nickname,
		memberAvatar: interaction.member.user.avatar,
	}

	const embed = new MessageEmbed()
		.setColor(purple)
		.setDescription(
			'Select a reminder from the menu below to view its details and cancel it.'
		)
		.setThumbnail(
			'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/htc/37/warning-sign_26a0.png'
		)
		.setFooter({
			text: `${
				memberData.memberNick
					? memberData.memberNick
					: memberData.memberUsername
			} used /raidreminder cancel`,
			iconURL: `${baseImageURL}/avatars/${memberData.memberID}/${memberData.memberAvatar}.png`,
		})

	interactionReply(
		interaction,
		null,
		[embed],
		[getUserRemindersMenu(memberData.memberID)],
		true,
		false
	)
}
