
### 3.2. Interface
#### 3.2.1. Iteration 0 Interface
Please note these return values are stubs, requiring no implementaion, and will be replaced in iteration 1. 

<table>
  <tr>
    <th style="width:20%">Function name</th>
    <th style="width:30%">Parameters</th>
    <th style="width:50%">Stub Return Value</th>
  </tr>
  <tr>
    <td><code>authLoginV1</code></td>
    <td><code>( email, password )</code></td>
    <td><code>{ authUserId: 1 }</code></td>
  </tr>
  <tr>
    <td><code>authRegisterV1</code></td>
    <td><code>( email, password, nameFirst, nameLast )</code></td>
    <td><code>{ authUserId: 1 }</code></td>
  </tr>
  <tr>
    <td><code>channelsCreateV1</code></td>
    <td><code>( authUserId, name, isPublic )</code></td>
    <td><code>{ channelId: 1 }</code></td>
  </tr>
  <tr>
    <td><code>channelsListV1</code></td>
    <td><code>( authUserId )</code></td>
<td><pre>{
  channels: [
    {
      channelId: 1,
      name: 'My Channel',
    }
  ],
}</pre></td></tr>
  <tr>
    <td><code>channelsListAllV1</code></td>
    <td><code>( authUserId )</code></td>
<td><pre>{
  channels: [
    {
      channelId: 1,
      name: 'My Channel',
    }
  ],
}</pre></td></tr>
  <tr>
    <td><code>channelDetailsV1</code></td>
    <td><code>( authUserId, channelId )</code></td>
<td><pre>{
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
}</pre></td></tr>
  <tr>
    <td><code>channelJoinV1</code></td>
    <td><code>( authUserId, channelId )</code></td>
    <td><code>{}</code></td>
  </tr>
  <tr>
    <td><code>channelInviteV1</code></td>
    <td><code>( authUserId, channelId, uId )</code></td>
    <td><code>{}</code></td>
  </tr>
  <tr>
    <td><code>channelMessagesV1</code></td>
    <td><code>( authUserId, channelId, start )</code></td>
<td><pre>{
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
}</pre></td></tr>

 <tr>
    <td><code>userProfileV1</code></td>
    <td><code>( authUserId, uId )</code></td>
<td><pre>{
  user : {
         uId : (a number), 
         email : (a string),
         nameFirst : (a string),
         nameLast : (a string),
         handleStr : (a string),
    }
}</pre></td></tr>





</table>

