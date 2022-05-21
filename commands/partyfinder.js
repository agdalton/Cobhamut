// Partyfinder command for creating and scheduling parties in FF14 for things like raids!
const { SlashCommandBuilder } = require('@discordjs/builders')
const partyfinder_modal = require('../.util/modals/partyfinder-modal.js')

module.exports = {
	name: 'partyfinder',
	guildId: '',
	callback: async (client, interaction, globals) => {
		const command = interaction.options.getSubcommand()
		const data = {
			clientID: client.user.id,
			clientUsername: client.user.username,
			clientAvatar: client.user.avatar,
			memberUsername: interaction.member.user.username,
			memberNick: interaction.member.nick,
			baseImageURL: 'https://cdn.discordapp.com',
		}

		require(`./subcommands/${interaction.commandName}/${command}.js`)(
			interaction,
			data,
			globals
		)

		return
	},
	data: (() => {
		// Primary command settings
		const data = new SlashCommandBuilder()
			.setName('partyfinder')
			.setDescription('Create or manage a party finder for FF14')

		// New subcommand
		data.addSubcommand((subcommand) =>
			subcommand
				.setName('new')
				.setDescription(
					'Create a new party finder for a FF14 group'
				)
				.addStringOption((option) =>
					option
						.setName('party_size')
						.setDescription(
							'The number of players in the party'
						)
                        .setRequired(true)
						.addChoices(
							{ name: '4 Players', value: '4' },
							{ name: '8 Players', value: '8' },
							{ name: '24 Players', value: '24' }
						)
				)
		)

		return data.toJSON()
	})(),
}
