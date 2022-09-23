// Stub-function for listing channel details
function channelDetailsV1(authUserId, channelId) {
    return {
        name: 'Hayden',
        ownerMembers: [
          {
            uId: 1,
            email: 'example@gmail.com',
            nameFirst: 'Hayden',
            nameLast: 'Jacobs',
            handleStr: 'haydenjacobs',
          }
        ],
        allMembers: [
          {
            uId: 1,
            email: 'example@gmail.com',
            nameFirst: 'Hayden',
            nameLast: 'Jacobs',
            handleStr: 'haydenjacobs',
          }
        ],
    }
}

// Stub-function for joining channel
function channelJoinV1(authUserId, channelId) {
  return{
      
  }
}

//stub-function for inviting users to the channel
function channelInviteV1( authUserId, channelId, uId ) {

	return{
	
	}

}




