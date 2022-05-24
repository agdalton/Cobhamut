// Reaction listener <-- executes when an interaction is messageReactionAdd

module.exports = async (client, reactionListener, globals) => {
	let { applicableEmoji, callback } = reactionListener
	let fullReaction = ''
	client.on('messageReactionAdd', async (reaction, user) => {
		try {
			fullReaction = await reaction.fetch()
		} catch (e) {
			console.log('There was an error fetching the message')
		}

		if (applicableEmoji.includes(reaction._emoji.id))
			callback(fullReaction, user, false, globals)

		return
	})

	client.on('messageReactionRemove', async (reaction, user) => {
		console.log('Remove fired!')
		try {
			fullReaction = await reaction.fetch()
		} catch (e) {
			console.log('There was an error fetching the message')
		}

		if (applicableEmoji.includes(reaction._emoji.id))
			callback(fullReaction, user, true, globals)

		return
	})
}
