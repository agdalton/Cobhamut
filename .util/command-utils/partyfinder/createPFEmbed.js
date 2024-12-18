// Function for setting creating the embed used for tracking a party finder
const { EmbedBuilder } = require('discord.js')
const { DateTime } = require('luxon')
const getRoleList = require('./getRoleList')

module.exports = (
	memberData,
	globals,
	color,
	dataDTTZ,
	title,
	description,
	partyComp,
	playersT,
	playersH,
	playersD,
	playersF
) => {
	const { memberID, memberNick, memberUsername, memberAvatar } = memberData
	const { baseImageURL } = globals

	// Setup embed for response
	const embed = new EmbedBuilder()
		.setColor(color)
		.setFooter({
			text: `Created by ${memberNick ? memberNick : memberUsername}`,
			iconURL: `${baseImageURL}/avatars/${memberID}/${memberAvatar}.png`,
		})
		.setTitle(title)
		.setThumbnail('https://xivapi.com/i/061000/061536_hr1.png')

	embed.setDescription(description)

	// Add date, time, and timezone if all 3 are filled out
	if (dataDTTZ.dttz) {
		const pfDT = DateTime.fromObject(
			dataDTTZ.pfDT.dtObj,
			dataDTTZ.pfDT.dtZone
		)
		const pfDate = pfDT.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)
		const pfTime = pfDT.toLocaleString(DateTime.TIME_SIMPLE)
		const tzName = pfDT.offsetNameShort
		embed.addFields({
			name: 'When',
			value: `${pfDate.substring(
				0,
				pfDate.length - 6
			)} @ ${pfTime} ${tzName}`,
		})
	}

	// Figure out how many tanks, healers, and dps are required
	embed.addFields(
		{
			name: `<:tank:977771775960174652> Tanks ${playersT.length}/${partyComp.tanks}`,
			value: getRoleList(playersT),
			inline: true,
		},
		{
			name: `<:healer:977771776253775932> Healers ${playersH.length}/${partyComp.healers}`,
			value: getRoleList(playersH),
			inline: true,
		},
		{
			name: `<:melee:977771775859494942> Damage ${playersD.length}/${partyComp.damage}`,
			value: getRoleList(playersD),
			inline: true,
		},
		{
			name: `<:fill:977774943154618368> Fill ${playersF.length}/\u221e`,
			value: getRoleList(playersF),
			inline: true,
		}
	)

	return embed
}
