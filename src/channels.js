// Stub-function for listing all channels
function channelsListAllV1 (authUserId) {
  return {
    channels: [
      {
        channelId: 1,
        name: 'My Channel',
      }
    ],
  }
}

// Stub funtion for creating user channels.
function channelsCreateV1(authUserId, name, isPublic) {
  return {
    channelId: 1,
  }
}

<<<<<<< HEAD
=======
// Stub function for listing the created channels.
function channelsListV1(authUserId) {
  return {
    channels: [
      {
        channelId: 1, 
        name: 'My Channel',
      }
    ],
  }
}

>>>>>>> 10d8befd88a9f7f3cd93abbb463658b2d0b96e10
