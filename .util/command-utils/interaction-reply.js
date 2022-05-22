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
			content: content,
			embeds: embeds,
			components: components,
			ephemeral: ephemeral,
		})
	} else {
		await interaction.editReply({
			content: content,
			embeds: embeds,
			components: components,
			ephemeral: ephemeral,
		})
	}

	return
}
