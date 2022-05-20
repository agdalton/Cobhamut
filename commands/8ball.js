/*
    Ask the magic 8 ball a question.
    This command takes a text input,
    picks an answer from an array of 20 items,
    and returns that answer in a MessageEmbed.

*/
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
	guildId: '',
	callback: async (client, interaction, globals) => {
		const command = interaction.options.getSubcommand()
		const data = {
			clientID: client.user.id,
			clientUsername: client.user.username,
			clientAvatar: client.user.avatar,
			memberUsername: interaction.member.user.username,
			memberNick: interaction.member.nick,
			baseImageURL: 'htps://cdn.discordapp.com',
		}
		console.log(interaction.commandName)
		console.log(command)
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
		data.setName('8ball')
		data.setDescription('Ask a question or seek Divine Intervention!')

		// Ask subcommand
		data.addSubcommand((subcommand) =>
			subcommand
				.setName('ask')
				.setDescription('Ask the Magic 8 ball')
				.addStringOption((option) =>
					option
						.setName('question')
						.setDescription('What do you seek an answer to?')
						.setRequired(true)
				)
		)

		// Intervene subcommand
		data.addSubcommand((subcommand) =>
			subcommand
				.setName('intervene')
				.setDescription(
					'Seek divine intervention and ask the Magic 8 ball to change the outcome of the last question'
				)
				.addStringOption((option) =>
					option
						.setName('type')
						.setDescription(
							'What kind of intervention are you seeking?'
						)
						.addChoices(
							{ name: 'Good', value: 'good' },
							{ name: 'Bad', value: 'bad' }
						)
						.setRequired(true)
				)
		)

		return data.toJSON()
	})(),
}
