/*
Reusable utility to reply to an interaction
*/
module.exports = async (
	interaction,
	content,
	embeds,
	components,
	ephemeral,
	edit
) => {
	if (!edit) {
		await interaction.reply({
			allowedMentions: { parse: ['roles','users'] },
			content: content,
			embeds: embeds,
			components: components,
			ephemeral: ephemeral,
		})
	} else {
		await interaction.editReply({
			allowedMentions: { parse: ['roles','users'] },
			content: content,
			embeds: embeds,
			components: components,
			ephemeral: ephemeral,
		})
	}

	return
}
