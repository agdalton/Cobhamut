// Reaction listener <-- executes when an interaction is messageReactionAdd

module.exports = async (client, reactionListener, globals) => {
	let { applicableMessages, callback } = reactionListener
	let message = ''

	client.on('messageReactionAdd', async (reaction, user) => {
		if (reaction.partial) {
			try {
				message = await reaction.fetch()
			} catch (error) {
				console.error(
					'Something went wrong when fetching the message: ',
					error
				)
				return
			}

			callback(message, reaction, user, globals)
			return
		}
	})
}
