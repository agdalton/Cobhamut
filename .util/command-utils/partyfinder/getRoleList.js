// Return the values that should be used in the createPFEmbed embed for each role
module.exports = (userList) => {
    console.log(userList)
	if (userList && userList.length > 0)
		return userList.join().replace(',', '\n')

	return '-'
}
