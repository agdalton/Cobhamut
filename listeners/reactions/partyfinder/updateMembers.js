// Update the members of a partyfinder
const partyfinderSchema = require('../../../.util/mongo-utils/partyfinder/partyfinderSchema')

module.exports = {
	applicableEmoji: [
		'977771775960174652',
		'977771776253775932',
		'977771775859494942',
		'977774943154618368',
	],
	callback: async (reaction, user, remove, globals) => {
		// Check if we should actually be here
		if ((reaction.message.interaction.commandName ?? '') !== 'partyfinder')
			return
		if (
			!partyfinderSchema.find({
				originalResponseID: reaction.message.id,
			})
		)
			return
		//if (reaction.count === 1) return

		//
		const dataUserRSVP = {
			tanks: new Object(),
			healers: new Object(),
			damage: new Object(),
			fill: new Object(),
		}
		console.log(`Remove: ${remove}`)
		console.log()
		console.log(`REACTION\n--------\n`)
		console.log(reaction)
		console.log()
		console.log(`USER\n--------\n${user}`)

		return
	},
}
