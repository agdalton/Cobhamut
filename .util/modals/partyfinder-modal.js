// Respond to the partyfinder modal and schedule the partyfinder
const { MessageEmbed } = require('discord.js')
const interaction_reply = require('../command-utils/interaction-reply.js')

module.exports = {
	name: 'pfNewModal',
	callback: async (client, interaction, globals) => {
		// Destruct globals
		const { lunar_purple } = globals

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

		// Setup embed for response
		const embed = new MessageEmbed()
			.setColor(lunar_purple)
			.setFooter({
				text: `Created by ${
					memberNick ? memberNick : memberUsername
				}`,
			})
			.setTitle(description)
			.setThumbnail('https://xivapi.com/i/061000/061536_hr1.png')

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
