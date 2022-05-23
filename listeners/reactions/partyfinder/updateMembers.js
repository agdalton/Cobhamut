// Update the members of a partyfinder

module.exports = {
	applicableMessages: [],
	callback: async (message, reaction, user, globals) => {
		const dataUserRSVP = {
			tanks: new Object(),
			healers: new Object(),
			damage: new Object(),
			fill: new Object(),
		}
        console.log()
		console.log(`MESSAGE\n--------\n${message}`)
        console.log()
        console.log(`REACTION\n--------\n${reaction}`)
        console.log()
        console.log(`USER\n--------\n${user}`)

        return
	},
}
