/*
Select menu processing for the delete-static-menu in /static delete
*/
const { MessageEmbed } = require('discord.js')
const get_statics = require('../command-utils/get-statics.js')
const node_pg_query = require('../command-utils/node-pg-query.js')

module.exports = {
	name: 'delete-static-menu',
	callback: async (client, interaction, globals) => {
		const { lunar_white } = globals
		const selected_static = interaction.values[0]
		// get statics in the current discord server
		const statics = await get_statics(interaction.guild.id)
		let updated_statics = statics.filter((value, index, arr) => {
			return value.name != selected_static
		})
		
		// update the db and remove the selected static
		await node_pg_query(
			"UPDATE discord_servers SET data = jsonb_set(data, '{statics}', $1, FALSE) WHERE server_id = $2",
			[JSON.stringify(updated_statics), interaction.guild.id]
		)

		// validate the static was removed
		const check_statics = await get_statics(interaction.guild.id)

		const embed = new MessageEmbed()
			.setDescription(
				`${selected_static} has been deleted from this server.`
			)
			.setColor(lunar_white)
		
		// if the db still shows the selected static existing, reply an error
		if (check_statics.some(static => static.name === selected_static)) {
			embed.setDescription(`There was an issue removing ${selected_static} from the server.`)
			embed.setColor('RED')
		}

		await interaction.update({ embeds: [embed], components: [] })
		return
	},
}
