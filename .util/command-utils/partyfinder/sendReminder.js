// Function to send the reminder messages to the channel and DM to users
const createPFEmbed = require('../../command-utils/partyfinder/createPFEmbed.js')

module.exports = async (client, partyfinders, description, globals) => {
	const { green, red } = globals.colors

	// Loop through all the incoming partyfinders
	for (const party of partyfinders) {
		let embedDesc = ''
		const dataDTTZ = JSON.parse(party.dataDTTZ)
		const dataCreator = JSON.parse(party.dataCreator)
		const dataSubmission = JSON.parse(party.dataSubmission)
		const dataPartyComp = JSON.parse(party.dataPartyComp)
		const dataUserRSVP = JSON.parse(party.dataUserRSVP)
		const { pfFull, guildID, channelID } = party

		// Fetch the guild the partyfinder was scheduled in
		const guild = await client.guilds.fetch(guildID)
		if (!guild) continue // Skip if the guild can't be fetched

		// Fetch the channel of the guild the partyfinder was scheduled in
		const channel = await guild.channels.fetch(channelID)
		if (!channel) continue // Skip if the channel can't be fetched (i.e deleted)

		// If the party is not full, concat the description to indicate that
		if (!pfFull)
			embedDesc =
				description.substring(0, description.length - 1) +
				', but is NOT FULL!'

		// Create the embed for the message to be sent to the channel and DM'd to the members
		const embed = createPFEmbed(
			dataCreator,
			globals,
			pfFull ? green : red, // If not full, make the embed red
			dataDTTZ,
			dataSubmission.description,
			embedDesc,
			dataPartyComp,
			dataUserRSVP.tanks,
			dataUserRSVP.healers,
			dataUserRSVP.damage,
			dataUserRSVP.fill
		)

		// Send the message and DMs
		const userList = dataUserRSVP.tanks.concat(
			dataUserRSVP.healers,
			dataUserRSVP.damage,
			dataUserRSVP.fill
		)

		// Message the channel and mention the users
		await channel.send({
			content: userList.join(),
			embeds: [embed],
		})

		for (let iUser = 0; iUser < userList.length; iUser++) {
			// Fetch the user from the client <-- remove the <: at the start and > at the end
			const user = await client.users.fetch(
				userList[iUser].substring(2, userList[iUser].length - 1)
			)

			// Send a DM to the user
			await user.send({
				embeds: [embed],
				allowedMentions: { parse: true },
			})
		}
	}

	return
}
