// Reaction listener <-- executes when an interaction is messageReactionAdd

module.exports = async (client, reactionListener, globals) => {
	let { applicableEmoji, callback } = reactionListener

	client.on(
		{
			event: 'messageReactionAdd',
			listener: function (reaction, user) {
				if (applicableEmoji.includes(reaction._emoji.id))
					callback(reaction, user, false, globals)

				return
			},
		},
		{
			event: 'messageReactionRemove',
			listener: function (reaction, user) {
				console.log('messageReactionRemove')
				if (applicableEmoji.includes(reaction._emoji.id))
					callback(reaction, user, true, globals)

				return
			},
		}
	)
	/*
	client.on('messageReactionAdd', async (reaction, user) => {
		if (applicableEmoji.includes(reaction._emoji.id))
			callback(reaction, user, false, globals)

		return
	})

	client.on('messageReactionRemove', (reaction, user) => {
		console.log('messageReactionRemove')
		if (applicableEmoji.includes(reaction._emoji.id))
			callback(reaction, user, true, globals)

		return
	})*/
}
