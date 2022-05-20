/*
Process /static add-member
*/

const {
	MessageEmbed,
	MessageActionRow,
	MessageSelectMenu,
} = require('discord.js')
const interactionReply = require('../../command-utils/interaction-reply.js')

module.exports = async (interaction, data, globals) => {
	const { lunar_white } = globals
	const { statics } = data

	// build a list of statics in the server
	let static_choices = []
	for (const static of statics) {
		static_choices.push({
			label: static.name,
			description: '',
			value: `${static.name.toUpperCase()},${interaction.options.getUser(
				'user'
			)},${interaction.options.getString('job')}`,
		})
	}

	// set up reply embed
	const embed = new MessageEmbed()
		.setDescription('Which static should this person be added to?')
		.setColor(lunar_white)
	// set up select menu to choose a static
	const select_menu = new MessageActionRow().addComponents(
		new MessageSelectMenu()
			.setCustomId('static-add-member-menu')
			.setPlaceholder('Nothing selected')
			.addOptions(static_choices)
	)

	interactionReply(interaction, null, [embed], [select_menu], true, false)
}
