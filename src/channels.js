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
<<<<<<< HEAD
      channelId: 1,
    }
=======
    channelId: 1,
  }
>>>>>>> ac93b0ee3163c00e9fd8f8036adc165bd6cd1228
}

// Stub function for listing the created channels.
function channelsListV1(authUserId) {
  return {
    channels: [
<<<<<<< HEAD
        {
            channelId: 1, 
            name: 'My Channel',
        }
    ],
  }
}
=======
      {
        channelId: 1, 
        name: 'My Channel',
      }
    ],
  }
}
>>>>>>> ac93b0ee3163c00e9fd8f8036adc165bd6cd1228
