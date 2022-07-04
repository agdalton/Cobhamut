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
		.setTitle('Raid reminders')
		.setDescription(
			'Select a reminder from the menu below to view its details and cancel it.'
		)
		.setThumbnail('https://xivapi.com/i/060000/060855_hr1.png')
		.setFooter({
			text: `${
				memberData.memberNick
					? memberData.memberNick
					: memberData.memberUsername
			} used /raidreminder cancel`,
			iconURL: `${baseImageURL}/avatars/${memberData.memberID}/${memberData.memberAvatar}.png`,
		})

	const remindersMenu = await getUserRemindersMenu(memberData.memberID)

	interactionReply(interaction, null, [embed], [remindersMenu], true, false)
}
