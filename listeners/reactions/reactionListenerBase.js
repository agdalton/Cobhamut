// Reaction listener <-- executes when an interaction is messageReactionAdd

module.exports = async (client, reactionListener, globals) => {
	let { applicableEmoji, callback } = reactionListener
    let message = ''
	client.on('messageReactionAdd', async (reaction, user) => {
        message = await reaction.fetch()
		if (applicableEmoji.includes(reaction._emoji.id))
			callback(reaction, user, false, globals)

		return
	})

	client.on('messageReactionRemove', (reaction, user) => {
        console.log('messageReactionRemove')
		if (applicableEmoji.includes(reaction._emoji.id))
			callback(reaction, user, true, globals)

		return
	})
}
