// Retrieve a list of raid reminders created by the user and present it to the user
const { MessageEmbed } = require('discord.js')
const interactionReply = require('../../../.util/command-utils/interactionReply.js')
const getUserRemindersMenu = require('../../../.util/command-utils/raidReminder/getUserRemindersMenu.js')

module.exports = async (interaction, data, globals) => {
	// Destruct globals
	const { baseImageURL } = globals
	const { purple, red } = globals.colors

	// Setup member data to pass as necessary <-- this is data about the person who sent the command
	const memberData = {
		memberID: interaction.member.user.id,
		memberUsername: interaction.member.user.username,
		memberNick: interaction.member.nickname,
		memberAvatar: interaction.member.user.avatar,
	}

	// Cancel embed to allow user selection
	const embed = new MessageEmbed()
		.setColor(purple)
		.setTitle("Update a raid reminder's message")
		.setDescription(
			'Select a reminder from the menu below to view its details and change its message.'
		)
		.setThumbnail('https://xivapi.com/i/060000/060855_hr1.png')
		.setFooter({
			text: `${
				memberData.memberNick
					? memberData.memberNick
					: memberData.memberUsername
			} used /raidreminder update-message`,
			iconURL: `${baseImageURL}/avatars/${memberData.memberID}/${memberData.memberAvatar}.png`,
		})

	const remindersMenu = await getUserRemindersMenu(
		memberData.memberID,
		'rrUpdateMessageSelectMenu', true
	)

	// If there are no reminders scheduled by the user change the embed accordingly
	if (!remindersMenu) {
		embed.setColor(red).setDescription(
			'You do not have any active raid reminders'
		)
	}

	interactionReply(
		interaction,
		null,
		[embed],
		remindersMenu
			? [remindersMenu]
			: null,
		true,
		false
	)
	return
}
