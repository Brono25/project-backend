## **Data Structure**
The type of information stored in 'data' was taken from the paramters an return values of the interface functions.\
'data' is an object split into two categories, 'users' and 'channels' since they are the two main categories of information.\

The structure is such that new items (users, channels, messages etc) are added into lists while information about the item is added into object within the list.\
This makes traversing items easy with loops.




### **Data example**

```
const data = {
   
    users: [
    {
      uId: 1,
      nameFirst: 'Hayden',
      nameLast: 'Smith',
      email: 'hayhay123@gmail.com',
      handleStr: 'haydensmith',
    },
    ],

    channels: [
    {

    cId: 1,
    name: 'My Channel',
    isPublic: true,
    ownerMembers: [
        {
          uId: 1,
          email: 'example@gmail.com',
          nameFirst: 'Hayden',
          nameLast: 'Jacobs',
          handleStr: 'haydenjacobs',
        },
        ],
        
    allMembers: [
        {
          uId: 1,
          email: 'example@gmail.com',
          nameFirst: 'Hayden',
          nameLast: 'Jacobs',
          handleStr: 'haydenjacobs',
        },
        ],
    messages: [
        {
          mId: 1,
          uId: 1,
          message: 'Hello world',
          timeSent: 1582426789,
        },
        ],

    start: 0,
    end: 50,

  },
  ],
}
```