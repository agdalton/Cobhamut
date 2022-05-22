// Respond to the partyfinder modal and schedule the partyfinder
const { MessageEmbed } = require('discord.js')
const { DateTime } = require('luxon')
const validateDTTZ = require('../../command-utils/partyfinder/validateDTTZ.js')
const validateInputs = require('../../command-utils/partyfinder/validateInputs.js')
const getPartyComp = require('../../command-utils/partyfinder/getPartyComp.js')
const reply = require('../../command-utils/interactionReply.js')

module.exports = {
	name: 'pfNewModal',
	callback: async (client, interaction, globals) => {
		// Destruct globals
		const { green, error_red, lunar_purple } = globals

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
		const time = fields.getTextInputValue('pfTime') ?? undefined
		const timezone = fields.getTextInputValue('pfTimezone') ?? undefined

		// --- Validate Party size, date, time, timezone --- //
		const partyComp = getPartyComp(size)
		const dataDTTZ = validateDTTZ(date, time, timezone)
		if (!validateInputs(interaction, partyComp, dataDTTZ)) return

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
		if (dataDTTZ.dttz) {
			const pfDT = DateTime.fromObject(
				dataDTTZ.pfDT.dtObj,
				dataDTTZ.pfDT.dtZone
			)
			const pfDate = pfDT.toLocaleString(
				DateTime.DATE_MED_WITH_WEEKDAY
			)
			const pfTime = pfDT.toLocaleString(DateTime.TIME_SIMPLE)
			const tzName = pfDT.offsetNameShort
			embed.addField(
				'When',
				`${pfDate.substring(
					0,
					pfDate.length - 6
				)} @ ${pfTime} ${tzName}`
			)
		}

		// Figure out how many tanks, healers, and dps are required
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

		reply(interaction, null, [embed], null, false, false)

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
