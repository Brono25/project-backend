

### **Data Example**

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


## **Data Structure**
The type of information stored in 'data' was taken from the paramters an return values of the interface functions.\
'data' is an object split into two main categories, 'users' and 'channels'.\
Since 'messages', 'allMembers', 'ownerMembers', 'isPublic', 'name' and 'cId' is information relating to a single channel\
they are grouped into a single object inside the channels array.\
While all the user information is grouped into an object in the 'user' array.

