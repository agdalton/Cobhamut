//  Help subcommand giving information about the usage of /partyfinder new
const { MessageEmbed } = require('discord.js')
const reply = require('../../../.util/command-utils/interactionReply')

module.exports = async (interaction, data, globals) => {
	const { baseImageURL } = globals
	const { blue } = globals.colors
	const memberData = {
		memberID: interaction.member.user.id,
		memberUsername: interaction.member.user.username,
		memberNick: interaction.member.nickname,
		memberAvatar: interaction.member.user.avatar,
	}

	const embed = new MessageEmbed()
		.setTitle('How to use /partyfinder new')
		.setThumbnail(
			'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/htc/37/information-source_2139.png'
		)
		.setImage('https://i.imgur.com/ul5epXy.png')
		.setColor(blue)
		.setFooter({
			text: `${
				memberData.memberNick
					? memberData.memberNick
					: memberData.memberUsername
			} used /partyfinder`,
			iconURL: `${baseImageURL}/avatars/${memberData.memberID}/${memberData.memberAvatar}.png`,
		})
		.setDescription(
			'The Partyfinder command will allow you to setup parties for Final Fantasy XIV consisting of 4, 8, or 24 players.' +
				"Optionally, you can include a date and time for the party to start. If included, the players who signup will be DM'd " +
				'and also mentioned in the channel where the partyfinder was originally created 30 minutes before the start time and at the start time.'
		)
		.addField(
			'Creating a partyfinder',
			'When using /partyfinder new, you will be prompted with a required choice for the party size. ' +
				"Optionally, select the ping option and choose a role to ping so that server members are notified that you're recruiting for your partyfinder. " +
				'After submitting the initial command, you will be prompted with the modal shown below. Complete the fields and hit submit:'
		)
		.addField(
			'\u200b',
			'**Description**\nType in a brief description of your party.\n\n**Party Size**\nLeave this field alone. It should be automatically filled in with the number of players you chose earlier.\n\n' +
				"**Date**\nOptionally, you can enter a Date. This should be in M/dd format and the leading zeros are optional. For example, if you'd like to party up on July 12th, you'd type 7/12 *or* 07/12.\n\n" +
				'**Time and timezone**\nIf you typed in a date, you are **required** to provide a time and timezone. This should be formatted at HH:mmAM/PM TZ. ' +
				"For example, if your party should start at 8:30 PM Eastern time, you'd type in 8:30PM EST. Currently, only PST, CST, and EST are supported. Any abbreviation of these zones is accepted, i.e. CST, CDT, CT.\n\n" +
				"**Ping role**If you selected a role to ping when submitting the initial command, it's snowflake value will appear here. **Do not change this field.**"
		)
		.addField(
			'Signing up for a partyfinder',
			"To signup for a partyfinder simply click on the reaction for the role you'd like to play. If you can play any role, then you can select fill to let the party leader know you're good to play anything.\n\n" +
				'<:tank:977771775960174652> Tanks\n<:healer:977771776253775932> Healers\n<:melee:977771775859494942> Damage\n<:fill:977774943154618368> Fill'
		)
		.addField(
			'Deleting a partyfinder',
			'To remove a partyfinder, have the person who created it click the ❌ reaction. Alternatively, an admin or moderator can delete the signup message (the message with the signup reactions). ' +
				'Both of these options will prevent anyone who signed up from receiving the DM and mention reminders.'
		)

	reply(interaction, null, [embed], null, true, false)
	return
}
