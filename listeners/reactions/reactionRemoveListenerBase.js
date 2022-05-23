// Reaction listener <-- executes when an interaction is messageReactionAdd

module.exports = async (client, reactionListener, globals) => {
	let { applicableEmoji, callback } = reactionListener
	let message = ''

	client.on('messageReactionRemove', (reaction, user) => {
		console.log('Remove fired!')
		try {
			message = await reaction.fetch()
		} catch (e) {
			console.log('There was an error fetching the message')
		}

		if (applicableEmoji.includes(reaction._emoji.id))
			callback(message, user, true, globals)

		return
	})
}
