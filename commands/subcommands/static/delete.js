/*
Delete a static from a server
*/
const {
	MessageEmbed,
	MessageActionRow,
	MessageSelectMenu,
} = require('discord.js')
const get_statics = require('../../command-utils/get-statics.js')
const interaction_reply = require('../../command-utils/interaction-reply.js')

module.exports = async (interaction, data, globals) => {
	// dictionary
	const { lunar_white } = globals
	const { statics } = data

	// build a list of statics in the server
	let static_choices = []
	for (const static of statics) {
		static_choices.push({
			label: static.name,
			description: '',
			value: static.name.toUpperCase(),
		})
	}

	// set up a simple embed to send alongside the select menu
	const embed = new MessageEmbed()
		.setDescription(
			'Select the static you wish to delete from this server'
		)
		.setColor(lunar_white)

	// build ephemeral reply with a select box with the list of statics in the server
	const select_menu = new MessageActionRow().addComponents(
		new MessageSelectMenu()
			.setCustomId('static-delete-menu')
			.setPlaceholder('Nothing selected')
			.addOptions(static_choices)
	)
	// send the reply
	await interaction_reply(interaction, null, [embed], [select_menu], true, false)
}
