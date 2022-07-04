// Raid reminder command for configuring scheduled reminders for FF14 statics
const { SlashCommandBuilder } = require('@discordjs/builders')
const { DateTime } = require('luxon')

module.exports = {
	name: 'raidreminder',
	guildId: '',
	init: async () => {},
	callback: async (client, interaction, globals) => {
		const command = interaction.options.getSubcommand()
		const data = {}

		// Call the file for the subcommand submitted <-- require(filePath)() automatically calls the file's exported function
		require(`./subcommands/${interaction.commandName}/${command}.js`)(
			interaction,
			data,
			globals
		)

		return
	},
	data: (() => {
		const data = new SlashCommandBuilder()
			.setName('raidreminder')
			.setDescription(
				'Create or manage a starting soon reminder for your static'
			)

		data.addSubcommand((subcommand) =>
			subcommand
				.setName('create')
				.setDescription(
					'Create a new raid reminder for your static'
				)
				.addChannelOption((option) =>
					option
						.setName('channel')
						.setDescription(
							'What channel should the reminder be sent in?'
						)
						.setRequired(true)
				)
				.addRoleOption((option) =>
					option
						.setName('role')
						.setDescription(
							'What role should be pinged for this reminder?'
						)
						.setRequired(true)
				)
		)

		data.addSubcommand((subcommand) =>
			subcommand
				.setName('cancel')
				.setDescription(
					'Cancel an existing raid reminder you created'
				)
		)

		return data.toJSON()
	})(),
}
