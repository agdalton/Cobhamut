// New subcommand for partyfinder
const interactionReply = require('../../../.util/command-utils/interactionReply')
const createPFEmbed = require('../../../.util/command-utils/partyfinder/createPFEmbed')
const getPartyComp = require('../../../.util/command-utils/partyfinder/getPartyComp')
const partyfinderSchema = require('../../../.util/mongo-utils/partyfinder/partyfinderSchema.js')
const validateDTTZ = require('../../../.util/command-utils/partyfinder/validateDTTZ')

module.exports = async (interaction, data, globals) => {
	// destruct globals
	const { purple } = globals.colors

	// Get subcommand optoins
	const pfDescription = interaction.options.getString('description')
	const pfSize = interaction.options.getString('size')
	const pfPingRole = interaction.options.getRole('ping')
	const pfDate = interaction.options.getString('date')
	const pfTime = interaction.options.getString('time')
	const pfAMPM = interaction.options.getString('ampm')
	const pfTimezone = interaction.options.getString('timezone')

	// Get info about who submitted the command
	const memberData = {
		memberID: interaction.member.user.id,
		memberUsername: interaction.member.user.username,
		memberNick: interaction.member.nickname,
		memberAvatar: interaction.member.user.avatar,
	}

	// --- Validate party size, date, time, and timezone --- //
	const pfComp = getPartyComp(pfSize)
	const dataDTTZ = validateDTTZ(pfDate, pfTime, pfAMPM, pfTimezone)
	if (!validateInputs(interaction, memberData, globals, pfComp, dataDTTZ))
		return

	const embed = createPFEmbed(
		memberData,
		globals,
		purple,
		dataDTTZ,
		pfDescription, // Embed title
		'', // Embed description
		pfComp,
		[], // Array[] list of tanks
		[], // Array[] list of healers
		[], // Array[] list of DPS
		[] // Array[] list of fill
	)

	interactionReply(
		interaction,
		pfPingRole ? pfPingRole.toString() : null,
		[embed],
		null,
		false,
		false
	)

	// Add reactions for role selection
	const interactionResponse = await interaction.fetchReply()
	interactionResponse
		.react('<:tank:977771775960174652>')
		.then(() => interactionResponse.react('<:healer:977771776253775932>'))
		.then(() => interactionResponse.react('<:melee:977771775859494942>'))
		.then(() => interactionResponse.react('<:fill:977774943154618368>'))
		.then(() => interactionResponse.react('❌'))
		.catch((error) =>
			console.log(
				'An error ocurred while reacting to the /partyfinder create embed response :: ' +
					error
			)
		)

	// Create document in MongoDB and save it <-- the keys are like column names for the database
	await new partyfinderSchema({
		date: dataDTTZ.pfDT.dtISO,
		dataDTTZ: JSON.stringify(dataDTTZ),
		dataCreator: JSON.stringify(memberData),
		dataSubmission: JSON.stringify({
			description: pfDescription,
			size: pfSize,
			date: pfDate,
			time: pfTime,
			ampm: pfAMPM,
			timezone: pfTimezone,
		}),
		dataPartyComp: JSON.stringify(pfComp),
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
		mentionRole: pfPingRole.toString(),
		reminderSent: false,
	}).save()

	return
}
