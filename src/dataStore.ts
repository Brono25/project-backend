// @ts-nocheck
// Data storage structure to follow
let data = {
   
    users: [
    /*{
      uId: 1,
      nameFirst: 'Hayden',
      nameLast: 'Smith',
      email: 'hayhay123@gmail.com',
      handleStr: 'haydensmith',
      globalPermission: 'owner',
    },*/
    ],

    channels: [
    /*{
      channelId: 1,
      name: 'My Channel',
      isPublic: true,
      ownerMembers: [ {uId: 1}, ];
      allMembers:   [ {uId: 1}, {uId: 2}, ];
      messages: [
      {
        messageId: 1,
        uId: 1,
        message: 'Hello world',
        timeSent: 1582426789,
      },
      ],
  },*/
  ],
}


// YOU SHOULDNT NEED TO MODIFY THE FUNCTIONS BELOW IN ITERATION 1

/*
Example usage
    let store = getData()
    console.log(store) # Prints { 'names': ['Hayden', 'Tam', 'Rani', 'Giuliana', 'Rando'] }

    names = store.names

    names.pop()
    names.push('Jake')

    console.log(store) # Prints { 'names': ['Hayden', 'Tam', 'Rani', 'Giuliana', 'Jake'] }
    setData(store)
*/

// Use get() to access the data
function getData() {
  return data;
}

// Use set(newData) to pass in the entire data object, with modifications made
function setData(newData) {
  data = newData;
}

export { getData, setData };
