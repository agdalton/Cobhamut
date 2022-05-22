// Respond to the partyfinder modal and schedule the partyfinder
const { MessageEmbed } = require('discord.js')
const interaction_reply = require('../../../.util/command-utils/interaction-reply.js')

module.exports = {
	name: 'pfNewModal',
	callback: async (client, interaction, globals) => {
		// Destruct globals
		const { lunar_white } = globals

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
			.setColor(lunar_white)
			.setAuthor({
				name: clientUsername,
				iconURL: `${baseImageURL}/avatars/${clientID}/${clientAvatar}.png`,
			})
	},
}
// Module methods //
