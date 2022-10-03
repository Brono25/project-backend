


# Interface



<table>
  <tr>
    <th>Name & Description</th>
    <th style="width:18%">Data Types</th>
    <th style="width:26%">Error returns</th>
    <th style="width:16%">Dependencies</th>
  </tr>
  <tr>
    <td><code>authLoginV1</code><br /><br />Given a registered user's email and password, returns their <code>authUserId</code> value.</td>
    <td><b>Parameters:</b><br /><code>{ email, password }</code><br /><br /><b>Return type if no error:</b><br /><code>{ authUserId }</code></td>
    <td>
      <b>Return object <code>{error: 'error'}</code></b> when any of:
      <ul>
        <li>email entered does not belong to a user</li>
        <li>password is not correct</li>
      </ul>
    </td>
    <td><code>authRegisterV1</code></td>
  </tr>


  <tr>
    <td><code>authRegisterV1</code><br /><br />Given a user's first and last name, email address, and password, creates a new account for them and returns a new <code>authUserId</code>.<br /><br />A unique handle will be generated for each registered user. The user handle is created as follows:
      <ul>
        <li>First, generate a concatenation of their casted-to-lowercase alphanumeric (a-z0-9) first name and last name (i.e. make lowercase then remove non-alphanumeric characters).</li>
        <li>If the concatenation is longer than 20 characters, it is cut off at 20 characters.</li>
        <li>If this handle is already taken by another user, append the concatenated names with the smallest number (starting from 0) that forms a new handle that isn't already taken.</li>
        <li>The addition of this final number may result in the handle exceeding the 20 character limit (the handle 'abcdefghijklmnopqrst0' is allowed if the handle 'abcdefghijklmnopqrst' is already taken).</li>
      </ul>
    </td>
    <td><b>Parameters:</b><br /><code>{ email, password, nameFirst, nameLast }</code><br /><br /><b>Return type if no error:</b><br /><code>{ authUserId }</code></td>
    <td>
      <b>Return object <code>{error: 'error'}</code></b> when any of:
      <ul>
        <li>email entered is not a valid email (more in section 6.4)</li>
        <li>email address is already being used by another user</li>
        <li>length of password is less than 6 characters</li>
        <li>length of nameFirst is not between 1 and 50 characters inclusive</li>
        <li>length of nameLast is not between 1 and 50 characters inclusive</li>
      </ul>
    </td>
    <td>N/A</td>
  </tr>



  <tr>
    <td><code>channelsCreateV1</code><br /><br />Creates a new channel with the given name, that is either a public or private channel. The user who created it automatically joins the channel.</td>
    <td><b>Parameters:</b><br /><code>{ authUserId, name, isPublic }</code><br /><br /><b>Return type if no error:</b><br /><code>{ channelId }</code></td>
    <td>
      <b>Return object <code>{error: 'error'}</code></b> when any of:
      <ul>
        <li>length of name is less than 1 or more than 20 characters</li>
        <li><code>authUserId</code> is invalid</li>
      </ul>
    </td>
    <td><code>authRegisterV1</code></td>
  </tr>



  <tr>
    <td><code>channelsListV1</code><br /><br />Provides an array of all channels (and their associated details) that the authorised user is part of.</td>
    <td><b>Parameters:</b><br /><code>{ authUserId }</code><br /><br /><b>Return type if no error:</b><br /><code>{ channels }</code></td>
    <td><li><code>authUserId</code> is invalid</li></td>
    <td>
      <ul>
        <li><code>authRegisterV1</code>
        <li><code>channelsCreateV1</code>
      </ul>
    </td>

    
  </tr>
  <tr>
    <td><code>channelsListAllV1</code><br /><br />Provides an array of all channels, including private channels (and their associated details)</td>
    <td><b>Parameters:</b><br /><code>{ authUserId }</code><br /><br /><b>Return type if no error:</b><br /><code>{ channels }</code></td>
    <td><li><code>authUserId</code> is invalid</li></td>
    <td>
      <ul>
        <li><code>authRegisterV1</code>
        <li><code>channelsCreateV1</code>
      </ul>
    </td>
  </tr>


  <tr>
    <td><code>channelDetailsV1</code><br /><br />Given a channel with ID <code>channelId</code> that the authorised user is a member of, provides basic details about the channel.</td>
    <td><b>Parameters:</b><br /><code>{ authUserId, channelId }</code><br /><br /><b>Return type if no error:</b><br /><code>{ name, isPublic, ownerMembers, allMembers }</code></td>
    <td>
      <b>Return object <code>{error: 'error'}</code></b> when any of:
      <ul>
        <li><code>channelId</code> does not refer to a valid channel</li>
        <li><code>channelId</code> is valid and the authorised user is not a member of the channel</li>
        <li><code>authUserId</code> is invalid</li>
      </ul>
    </td>
    <td>
      <ul>
        <li><code>authRegisterV1</code>
        <li><code>channelsCreateV1</code>
      </ul>
    </td>
    
  </tr>





  <tr>
    <td><code>channelJoinV1</code><br /><br />Given a <code>channelId</code> of a channel that the authorised user can join, adds them to that channel.</td>
    <td><b>Parameters:</b><br /><code>{ authUserId, channelId }</code><br /><br /><b>Return type if no error:</b><br /><code>{}</code></td>
    <td>
      <b>Return object <code>{error: 'error'}</code></b> when any of:
      <ul>
        <li><code>channelId</code> does not refer to a valid channel</li>
        <li>the authorised user is already a member of the channel</li>
        <li><code>channelId</code> refers to a channel that is private, when the authorised user is not already a channel member and is not a global owner</li>
        <li><code>authUserId</code> is invalid</li>
      </ul>
    </td>
    <td>
      <ul>
        <li><code>authRegisterV1</code>
        <li><code>channelsCreateV1</code>
      </ul>
    </td>
  </tr>



  <tr>
    <td><code>channelInviteV1</code><br /><br />Invites a user with ID <code>uId</code> to join a channel with ID <code>channelId</code>. Once invited, the user is added to the channel immediately. In both public and private channels, all members are able to invite users.</td>
    <td><b>Parameters:</b><br /><code>{ authUserId, channelId, uId }</code><br /><br /><b>Return type if no error:</b><br /><code>{}</code></td>
    <td>
      <b>Return object <code>{error: 'error'}</code></b> when any of:
      <ul>
        <li><code>channelId</code> does not refer to a valid channel</li>
        <li><code>uId</code> does not refer to a valid user</li>
        <li><code>uId</code> refers to a user who is already a member of the channel</li>
        <li><code>channelId</code> is valid and the authorised user is not a member of the channel</li>
        <li><code>authUserId</code> is invalid</li>
      </ul>
    </td>
    <td>
      <ul>
        <li><code>authRegisterV1</code>
        <li><code>channelsCreateV1</code>
      </ul>
    </td>
  </tr>



  <tr>
    <td><code>channelMessagesV1</code><br /><br />Given a channel with ID <code>channelId</code> that the authorised user is a member of, returns up to 50 messages between index "start" and "start + 50". Message with index 0 (i.e. the first element in the returned array of <code>messages</code>) is the most recent message in the channel. This function returns a new index "end". If there are more messages to return after this function call, "end" equals "start + 50". If this function has returned the least recent messages in the channel, "end" equals -1 to indicate that there are no more messages to load after this return.</td>
    <td><b>Parameters:</b><br /><code>{ authUserId, channelId, start }</code><br /><br /><b>Return type if no error:</b><br /><code>{ messages, start, end }</code></td>
    <td>
      <b>Return object <code>{error: 'error'}</code></b> when any of:
      <ul>
        <li><code>channelId</code> does not refer to a valid channel</li>
        <li><code>start</code> is greater than the total number of messages in the channel</li>
        <li><code>channelId</code> is valid and the authorised user is not a member of the channel</li>
        <li><code>authUserId</code> is invalid</li>
      </ul>
    </td>
    <td>
      <ul>
        <li><code>authRegisterV1</code>
        <li><code>channelsCreateV1</code>
      </ul>
    </td>
  </tr>
  <tr>
    <td><code>userProfileV1</code><br /><br />For a valid user, returns information about their user ID, email, first name, last name, and handle
    </td>
    <td><b>Parameters:</b><br /><code>{ authUserId, uId }</code><br /><br /><b>Return type if no error:</b><br /><code>{ user }</code></td>
    <td>
      <b>Return object <code>{error: 'error'}</code></b> when any of:
      <ul>
        <li><code>uId</code> does not refer to a valid user</li>
        <li><code>authUserId</code> is invalid</li>
      </ul>
    </td>
    <td><code>authRegisterV1</code></td>
    
  </tr>


  <tr>
    <td><code>clearV1</code><br /><br />Resets the internal data of the application to its initial state</td>
    <td><b>Parameters:</b><br /><code>{}</code><br /><br /><b>Return type if no error:</b><br /><code>{}</code></td>
    <td>N/A</td>
    <td>N/A</td>
  </tr>
</table>
