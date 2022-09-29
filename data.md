

## **Data Example**

```
const data = {
   
    users: [
    {
      authUserId: 1,
      nameFirst: 'Hayden',
      nameLast: 'Smith',
      password,
      email: 'hayhay123@gmail.com',
      handleStr: 'haydensmith',
    },
    ],

    channels: [
    {
      channelId: 1,
      name: 'My Channel',
      isPublic: true,
      ownerMembers: [ {uId: 1}, ];
      allMembers:   [ {uId: 1}, {uId: 2}, ];
      messages: [
      {
        messageId: 1,
        authUserId: 1,
        message: 'Hello world',
        timeSent: 1582426789,
      },
      ],
  },
  ],
}
```


## **Data Structure**
The type of information stored in 'data' was taken from the parameters an return values of the interface functions.\
'data' is an object split into two main categories, 'users' and 'channels'.\
Since 'messages', 'allMembers', 'ownerMembers', 'isPublic', 'name' and 'cId' is information relating to a single channel\
they are grouped into a single object inside the channels array.\
All the user information is grouped into an object in the 'user' array.\
The channels only store the user ID of the owner and
members since that is all that is needed to look up their complete details.



