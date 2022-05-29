// Respond to the partyfinder modal and schedule the partyfinder
const validateDTTZ = require('../../command-utils/partyfinder/validateDTTZ.js')
const validateInputs = require('../../command-utils/partyfinder/validateInputs.js')
const getPartyComp = require('../../command-utils/partyfinder/getPartyComp.js')
const reply = require('../../command-utils/interactionReply.js')
const createPFEmbed = require('../../command-utils/partyfinder/createPFEmbed.js')
const partyfinderSchema = require('../../mongo-utils/partyfinder/partyfinderSchema.js')

module.exports = {
	name: 'pfNewModal',
	callback: async (client, interaction, globals) => {
		// Destruct globals
		const { purple } = globals.colors

		// Setup member data to pass as necessary
		const memberData = {
			memberID: interaction.member.user.id,
			memberUsername: interaction.member.user.username,
			memberNick: interaction.member.nickname,
			memberAvatar: interaction.member.user.avatar,
		}

		// Get modal inputs
		const { fields } = interaction
		const description = fields.getTextInputValue('pfDescription').trim()
		const size = fields.getTextInputValue('pfSize').trim()
		const date = fields.getTextInputValue('pfDate').trim() ?? undefined
		const time = fields.getTextInputValue('pfTime').trim() ?? undefined
		const timezone = fields.getTextInputValue('pfTimezone').trim() ?? undefined

		// --- Validate Party size, date, time, timezone --- //
		const partyComp = getPartyComp(size)
		const dataDTTZ = validateDTTZ(date, time, timezone)
		if (
			!validateInputs(
				interaction,
				memberData,
				globals,
				partyComp,
				dataDTTZ
			)
		)
			return

		const embed = createPFEmbed(
			memberData,
			globals,
			purple,
			dataDTTZ,
			description, // Embed title
			'', // Embed description
			partyComp,
			[], // Array[] list of tanks
			[], // Array[] list of healers
			[], // Array[] list of DPS
			[] // Array[] list of fill
		)

		reply(interaction, null, [embed], null, false, false)

		// Add reactions for role selection
		const response = await interaction.fetchReply()
		response
			.react('<:tank:977771775960174652>')
			.then(() => response.react('<:healer:977771776253775932>'))
			.then(() => response.react('<:melee:977771775859494942>'))
			.then(() => response.react('<:fill:977774943154618368>'))
			.catch((error) =>
				console.log(
					'An error ocurred while reacting to the /partyfinder new embed response :: ' +
						error
				)
			)

		// Create document in MongoDB and save it <-- the keys are like column names for the database
		const interactionResponse = await interaction.fetchReply()
		await new partyfinderSchema({
			date: dataDTTZ.pfDT.dtISO,
			dataDTTZ: JSON.stringify(dataDTTZ),
			dataCreator: JSON.stringify(memberData),
			dataSubmission: JSON.stringify({
				description: description,
				size: size,
				date: date,
				time: time,
				timezone: timezone,
			}),
			dataPartyComp: JSON.stringify(partyComp),
			dataUserRSVP: JSON.stringify({
				tanks: [],
				healers: [],
				damage: [],
				fill: [],
			}),
			dataTotalRSVP: 0,
			pfFull: false,
			guildID: interaction.guildId,
			channelID: interaction.channelId,
			originalResponseID: interactionResponse.id,
			reminderSent: false,
		}).save()

		return
	},
}
