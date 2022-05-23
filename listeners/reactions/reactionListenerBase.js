// Reaction listener <-- executes when an interaction is messageReactionAdd

module.exports = async (client, reactionListener, globals) => {
    let { applicableMessages, callback } = reactionListener
	client.on('messageReactionAdd', async (reaction, user) => {
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
