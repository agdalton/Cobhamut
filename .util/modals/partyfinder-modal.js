// Respond to the partyfinder modal and schedule the partyfinder
const { MessageEmbed } = require('discord.js')
const { DateTime } = require('luxon')
const interaction_reply = require('../command-utils/interaction-reply.js')

module.exports = {
	name: 'pfNewModal',
	callback: async (client, interaction, globals) => {
		// Destruct globals
		const { green, lunar_purple } = globals

		// Setup client and member vars
		const clientID = client.user.id
		const clientUsername = client.user.username
		const clientAvatar = client.user.avatar
		const memberUsername = interaction.member.user.username
		const memberNick = interaction.member.nick
		const baseImageURL = 'https://cdn.discordapp.com'

		// Get modal inputs
		const { fields } = interaction
		const description = fields.getTextInputValue('pfDescription')
		const size = fields.getTextInputValue('pfSize')
		const date = fields.getTextInputValue('pfDate') ?? undefined
		const time =
			fields.getTextInputValue('pfTime').toUpperCase() ?? undefined
		const timezone =
			fields.getTextInputValue('pfTimezone').toUpperCase() ?? undefined

		// Validate date, time, timezone
		const dataDTTZ = checkDTTZ(date, time, timezone)
		if (!dataDTTZ.isValid) {
			interaction_reply(
				interaction,
				dataDTTZ.err,
				null,
				null,
				true,
				false
			)
			return
		}

		// Setup embed for response
		const embed = new MessageEmbed()
			.setColor(lunar_purple)
			.setFooter({
				text: `Created by ${
					memberNick ? memberNick : memberUsername
				}`,
				iconURL: `${baseImageURL}/avatars/${interaction.member.user.id}/${interaction.member.user.avatar}.png`,
			})
			.setTitle(description)
			.setThumbnail('https://xivapi.com/i/061000/061536_hr1.png')

		// Add date, time, and timezone if filled out
		if (dataDTTZ.isValid) {
			embed.addField('When')
		}

		// Figure out how many tanks, healers, and dps are required
		const partyComp = getPartyComp(size)
		embed.addField(
			`<:tank:977771775960174652> Tanks 0/${partyComp.tanks}`,
			'-',
			true
		)
		embed.addField(
			`<:healer:977771776253775932> Healers 0/${partyComp.healers}`,
			'-',
			true
		)
		embed.addField(
			`<:melee:977771775859494942> Damage 0/${partyComp.dps}`,
			'-',
			true
		)
		embed.addField(`<:fill:977774943154618368> Fill`, '-', true)

		interaction_reply(interaction, null, [embed], null, false, false)

		// Add reactions for role selection
		const response = await interaction.fetchReply()
		response
			.react('<:tank:977771775960174652>')
			.then(() => response.react('<:healer:977771776253775932>'))
			.then(() => response.react('<:melee:977771775859494942>'))
			.then(() => response.react('<:fill:977774943154618368>'))
			.catch((error) =>
				console.log(
					'An error ocurred while reacting to the /partyfinder new embed response :: ' +
						error
				)
			)

		return
	},
}
// Module methods //
getPartyComp = (size) => {
	const comp = new Object()

	switch (size) {
		case '4':
			comp.tanks = 1
			comp.healers = 1
			comp.dps = 2
			break
		case '8':
			comp.tanks = 2
			comp.healers = 2
			comp.dps = 4
			break
		case '24':
			comp.tanks = 3
			comp.healers = 6
			comp.dps = 15
			break
	}

	return comp
}

checkDTTZ = (date, time, timezone) => {
	const obj = {
		isValid: true,
		dttz: false,
		err: [],
	}
	

	if (!date && !time && !timezone) {
		// Verify none of them have data
	} else if (date && time && timezone) {
		// Verify all of them have data
		// Validate formatting and validity

		// Validate time
		const timeRgx = /^(1[0-2]|0?[1-9]):([0-5]?[0-9])(●?[AP]M)?$/g
		if (!timeRgx.test()) {
			obj.isValid = false
			obj.err.push('Invalid time submitted. Use HH:mmAM/PM.\nFor example, if submitting a partyfinder for 8:30 PM, use 8:30PM.')
		}

		// Validate timezone
		switch (timezone) {
			case 'EST':
			case 'EDT':
			case 'ET':
				obj.validDTTZ.timezone = 'America/New_York'
				break
			case 'CST':
			case 'CDT':
			case 'CT':
				obj.validDTTZ.timezone = 'America/Chicago'
				break
			case 'PST':
			case 'PDT':
			case 'PT':
				obj.validDTTZ.timezone = 'America/Los_Angeles'
				break
			default:
				obj.isValid = false
				obj.err.push(
					'Invalid timezone submitted.\nFor US/Pacific: PST, PDT, PT\nFor US/Central: CST, CDT, CT\nFor US/Eastern: EST, EDT, or ET\nNo other timezones are currently supported.')
		}

		if (obj.isValid) {
			const meridiem = time.substring(time.length - 2).toLowerCase() // AM/PM
			const arrTime = time.slice(0, -2).split(':') // [0] is hour [1] is minutes
			// Convert hours and minutes to integers
			arrTime[0] = parseInt(arrTime[0])
			arrTime[1] = parseInt(arrTime[1])
// Add 12 hours to account for 24hr clock used by Luxon
			if (meridiem === 'pm') arrTime[0] += 12 
			obj.dttz = true
			const nowDT = new DateTime.now()
			const year = nowDT.year
			const pfDT = new DateTime.fromObject({ year: year, month: date.split('/')[0], day: date.split('/')[1], hour: })

		}
	} else {
		// if one of them have data, but the others don't - return an error
		obj.isValid = false
		obj.err.push(
			'When using the date, time, and timezone fields all 3 are required.')
	}

	return obj
}
