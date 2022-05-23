// Reaction listener <-- executes when an interaction is messageReactionAdd

module.exports = async (client, reactionListener, globals) => {
    const { applicableMessages, callback } = reactionListener
	client.on('messageReactionAdd', (reaction, user) => {
        if (reaction.partial) {
            try {
                const message = await reaction.fetch()
                callback(message, reaction, user, globals)
                return

            } catch (error) {
                console.error('Something went wrong when fetching the message: ', error)
                return
            }
        }
    })
}
