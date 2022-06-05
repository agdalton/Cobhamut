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
			'The Partyfinder command will allow you to setup parties for Final Fantasy XIV consisting of 4, 8, or 24 players.\n\n' +
				"Optionally, you can include a date and time for the party to start. If included, the players who signup will be DM'd " +
				'and pinged, in the channel where the partyfinder was originally created, 30 minutes before the start time and again at the start time.'
		)
		.addField(
			'Creating a partyfinder',
			'In the bot channel, type /partyfinder and select the option under Cobhamut for /partfinder create.\n\n' +
				"Discord will walk you through selecting the options for your partyfinder. Select ping and choose a role so that server members are notified that you're recruiting for your partyfinder.\n\n" +
				'After submitting the initial command, you will be prompted with the popup shown at the bottom. Complete the fields and hit submit:'
		)
		.addField(
			'Partyfinder options',
			'>>> **Description**\nRequired. Type in a brief description of your party.\n\n**Party Size**\nRequired. Choose how many players can RSVP to your partyfinder. 4, 8, and 24 players are supported.\n\n' +
				"**Ping**\nOptional. Select a discord role that Cobhamut should ping. This will let people know you're recruiting players." +
				"**Date**\nOptional. This should be in M/dd format and the leading zeros are optional.\n\nFor example, if you'd like to party up on July 12th, you'd type 7/12 *or* 07/12.\n\n" +
				'**Time**\nOptional. If you typed in a date, you are **required** to provide a time. This should be formatted at HH:mm.\n\n' +
				'**AMPM**\nOptional. If you typed in a date and time, you are **required** to provided AM or PM. Choose whether the time you entered is in the morning or afternoon.\n\n' +
				'**Timezone**\n Optional. If you type in a date and time, you are **required** to provide a timezone. Choose between US/Pacific, US/Central, or US/Eastern timezones.'
		)
		.addField(
			'Signing up for a partyfinder',
			"Click on the reaction for the role you'd like to play. If you can play any role, then you can select <:fill:977774943154618368> to let the party leader know you're good to play anything.\n\n" +
				'<:tank:977771775960174652> Tanks\n<:healer:977771776253775932> Healers\n<:melee:977771775859494942> Damage\n<:fill:977774943154618368> Fill'
		)
		.addField(
			'Deleting a partyfinder',
			'Have the person who created it click the ❌.\n\nAlternatively, an admin or moderator can delete the signup message (the message with the signup reactions).\n\n' +
				'Both of these options will prevent anyone who signed up from receiving the DM and mention reminders.'
		)

	reply(interaction, null, [embed], null, true, false)
	return
}
