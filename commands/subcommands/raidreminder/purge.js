// Retrieve a list of raid reminders created by the user and present an option to delete a selection
const { MessageEmbed, Permissions } = require('discord.js')
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

	// Return if the user does NOT have the manage server permission
	if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
		embed.setColor(red).setDescription(
			'You must have the Manage Server permission to run this command.'
		)
		interactionReply(interaction, null, [embed], null, false, false)
	}

	// Fetch server members
	const guild = await client.guilds.fetch(interaction.guildId)
	if (!guild || !guild.members) {
		embed.setColor(red).setDescription(
			'Unable to retrieve server members'
		)
		interactionReply(interaction, null, [embed], null, false, false)
		return
	}

	// Iterate through the members, find any raid reminders setup by people no longer in the server and cancel them
	const query = {
		$and: [{ guildId: interaction.guildId }],
	}

	// Add all current members to a NOT query
	const members = await guild.members.list()
	console.log(members)
	for (const member in members) {
		query.$and.push({
			dataCreator: {
				$not: { $regex: `"memberID":"${member.id}"` },
			},
		})
	}

	console.log(JSON.stringify(query))

	const reminders = await raidReminderSchema.deleteMany(query)

	// Purge embed to allow user selection
	embed.setColor(purple)
		.setDescription(
			'Raid reminders created by users who are no longer in the server have been purged.'
		)
		.addField('Purge count', reminders.deletedCount.toString())

	interactionReply(interaction, null, [embed], null, false, false)
	return
}
