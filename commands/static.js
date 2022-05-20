/*
Register a static of players with Luna
*/

const { SlashCommandBuilder } = require('@discordjs/builders')
const node_pg_query = require('../.util/command-utils/node-pg-query.js')
const get_jobs = require('../.util/command-utils/get-jobs.js')

module.exports = {
	name: 'static',
	guildId: '681503253623734292',
	callback: async (djs_client, interaction, globals) => {
		// dictionary
		const command = interaction.options.getSubcommand()
		const { jobs, lunar_white } = globals
		// try to find a record in the database for the current server
		const data = await node_pg_query(
			'SELECT data FROM discord_servers WHERE server_id = $1',
			[interaction.guild.id]
		)

		// call subcommand processing
		require(`./subcommands/${interaction.commandName}/${command}.js`)(
			interaction,
			data,
			globals
		)

		// close interaction
		return
	},
	data: (() => {
		// Primary command settings
		const data = new SlashCommandBuilder()
		data.setName('static')
		data.setDescription(
			'Create, manage, or remove a static from the server'
		)

		// create an array of job names for use in options
		const jobs = get_jobs()

		// build choices
		let job_names = []
		for (const job of jobs) {
			job_names.push([job.name, job.value])
		}

		// Subcommand to create a static [0]
		data.addSubcommand((subcommand) =>
			subcommand
				.setName('create')
				.setDescription('Create a new static in this server')
				.addStringOption((option) =>
					option
						.setName('name')
						.setDescription(
							'What should we call this static?'
						)
						.setRequired(true)
				)
		)

		// Subcommand to add members to the static [1]
		data.addSubcommand((subcommand) =>
			subcommand
				.setName('add-member')
				.setDescription('Add a member to a static in this server')
				.addUserOption((option) =>
					option
						.setName('user')
						.setDescription(
							'Mention the person to add to the static'
						)
						.setRequired(true)
				)
				.addStringOption((option) =>
					option
						.setName('job')
						.setDescription(
							'Choose the job this person is playing'
						)
						.addChoices(job_names)
						.setRequired(true)
				)
		)

		// Subcommand to remove members from the static [2]
		data.addSubcommand((subcommand) =>
			subcommand
				.setName('remove-member')
				.setDescription(
					'Remove a member from a static in this server'
				)
		)

		// Subcommand to delete a static [3]
		data.addSubcommand((subcommand) =>
			subcommand
				.setName('delete')
				.setDescription('Delete a static from this server')
		)

		return data.toJSON()
	})(),
}
