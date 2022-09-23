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

//stub-function for listing the messages in the channel
function channelMessagesV1( authUserId, channelId, start ){

	return{
	
	messages: [
      {
        messageId: 1,
        uId: 1,
        message: 'Hello world',
        timeSent: 1582426789,
      }
	],
	start: 0,
	end: 50,		
		
	}

}


