// Retrieve a list of raid reminders created by the user and present an option to delete a selection
const { MessageEmbed } = require('discord.js')
const interactionReply = require('../../../.util/command-utils/interactionReply.js')
const raidReminderSchema = require('../../../.util/mongo-utils/raidReminder/raidReminderSchema.js')

module.exports = async (interaction, data, globals) => {
	// Destruct globals
	const { baseImageURL } = globals
	const { purple, red } = globals.colors

	// Destruct data
	const { client } = data

	// Setup member data to pass as necessary <-- this is data about the person who sent the command
	const memberData = {
		memberID: interaction.member.user.id,
		memberUsername: interaction.member.user.username,
		memberNick: interaction.member.nickname,
		memberAvatar: interaction.member.user.avatar,
	}

	// Setup reply embed
	const embed = new MessageEmbed()
		.setTitle('Purge raid reminders')
		.setThumbnail('https://xivapi.com/i/060000/060855_hr1.png')
		.setFooter({
			text: `${
				memberData.memberNick
					? memberData.memberNick
					: memberData.memberUsername
			} used /raidreminder purge`,
			iconURL: `${baseImageURL}/avatars/${memberData.memberID}/${memberData.memberAvatar}.png`,
		})

	// Fetch server members
	const guild = await client.guilds.fetch(interaction.guildId)
	if (!guild || !guild.members) {
		embed.setColor(red).setDescription(
			'Unable to retrieve server members'
		)
		interactionReply(interaction, null[embed], null, false, false)
		return
	}

	// Iterate through the members, find any raid reminders setup by people no longer in the server and cancel them
    console.log(guild.members)
	for (const member in guild.members) {
		const reminders = await raidReminderSchema.find({
			$and: [
				{ guildId: interaction.guildId },
				{ dataCreator: { $regex: `"memberID":"${userId}"` } },
			],
		})
	}
	// Purge embed to allow user selection
	embed.setColor(purple).setDescription(
		'Raid reminders created by users who are no longer in the server have been purged.'
	)

	interactionReply(interaction, null, [embed], null, false, false)
	return
}