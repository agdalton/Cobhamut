// Retrieve a list of raid reminders created by the input user and present an option to delete a selection
const { EmbedBuilder, PermissionsBitField } = require('discord.js')
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

	// Get the selected user from the interaction
	const user = interaction.options.getUser('user')

	// Setup reply embed
	const embed = new EmbedBuilder()
		.setTitle('Cancel a raid reminder (moderator)')
		.setThumbnail('https://xivapi.com/i/060000/060855_hr1.png')
		.setFooter({
			text: `${
				memberData.memberNick
					? memberData.memberNick
					: memberData.memberUsername
			} used /raidreminder mod-cancel`,
			iconURL: `${baseImageURL}/avatars/${memberData.memberID}/${memberData.memberAvatar}.png`,
		})

	// Return if the user does NOT have the manage server permission
	if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
		embed.setColor(red).setDescription(
			'You must have the Manage Server permission to run this command.'
		)

		interactionReply(interaction, null, [embed], null, false, false)
		return
	}

	// Cancel embed to allow user selection
	embed.setColor(purple).setDescription(
		'Select a reminder from the menu below to view its details and cancel it.'
	)

	const remindersMenu = await getUserRemindersMenu(
		user.id,
		'rrCancelSelectMenu'
	)

	// If there are no reminders scheduled by the user change the embed accordingly
	if (!remindersMenu) {
		embed.setColor(red).setDescription(
			`${user.toString()} does not have any active raid reminders`
		)
	}

	interactionReply(
		interaction,
		null,
		[embed],
		remindersMenu ? [remindersMenu] : null,
		true,
		false
	)
    
	return
}
