/*
Create a new static for the discord server 
where the command was executed
*/
const { MessageEmbed } = require('discord.js')
const node_pg_query = require('../../.util/command-utils/node-pg-query.js')
const interaction_reply = require('../../.util/command-utils/interaction-reply.js')

module.exports = async (interaction, data, globals) => {
	// dictionary
	const server_id = interaction.guild.id
	const { lunar_white } = globals
	const embed = new MessageEmbed() /*.setAuthor(
        client.user.username,
        `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.png`
    )*/
	const create_static_name = interaction.options.getString('name').toUpperCase()
	// create new static
	const static = {
		name: create_static_name,
		members: [],
	}
	// does a properties file exist for this server?
	if (typeof data === 'object' && data.hasOwnProperty('statics')) {
		// ensure no more than 25 statics can be created
		if (data.statics.length == 25) {
			embed.setDescription(
				'The maximum number of statics has already been created in this server.'
			)
			embed.setColor('RED')
			interaction_reply(interaction, null, [embed], null, true)
			// close interaction
			return
		}
		// check if a static already exists with the same name
		for (const static of data.statics) {
			if (static.name.toUpperCase() === create_static_name) {
				embed.setDescription(
					'A static with this name already exists in this server.'
				)
				embed.setColor('RED')
				interaction_reply(interaction, null, [embed], null, true)
				// close interaction
				return
			}
		}
		// add the static to server_props['statics']
		data.statics.push(static)
		await node_pg_query(
			'UPDATE discord_servers SET data = $1 WHERE server_id = $2',
			[data, server_id]
		)
	} else {
		// create structure for the new props file
		const new_server = {
			statics: [],
		}
		// add the new static to the props
		new_server.statics.push(static)
		// insert a record into the discord_servers table
		await node_pg_query(
			'INSERT INTO discord_servers (server_id, data) VALUES ($1, $2)',
			[server_id, new_server]
		)
	}
	// ensure the static was added to the record in the database
	const query_statics = await node_pg_query(
		'SELECT data FROM discord_servers WHERE server_id = $1',
		[server_id]
	)
	// set default embed to error
	embed.setDescription(
		`An issue occurred while creating ${create_static_name} in ${interaction.guild.name}!`
	)
	embed.setColor('RED')
	// check if the static was created successfully
	for (const static of query_statics.statics) {
		if (static.name === create_static_name) {
			embed.setDescription(
				`${create_static_name} created successfully in ${interaction.guild.name}!`
			)
			embed.setColor(lunar_white)
			break
		}
	}
	// send the reply
	interaction_reply(interaction, null, [embed], null, true)
	return
}
