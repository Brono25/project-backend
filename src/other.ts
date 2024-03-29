
import HTTPError from 'http-errors';
const MD5 = require('crypto-md5');
const crypto = require('crypto');
import {
  setData,
  getData,
} from './dataStore';
import validator from 'validator';
import {
  DataStore,
  ChannelStore,
  UserStore,
  MessageId,
  DmStore,
  MessageTracking,
  TokenHash,
  TOKEN_SECRET,
  LEAVE,
  JOIN,
  LeaveOrJoin,
  ChannelStat,
  DmsStat,
  MessageStat,
  Message,
  NumChannelsExist,
  DmsExist,
  MessagesExist,
  OWNER,
} from './data.types';

/**
 * Set data back to initial state.
 * @param {}
 * @returns {}
 */
export function clearV1(): any {
  const data: any = null;
  setData(data);
  return {};
}

// ////////////////////////////////////////////////////// //
//                         IS VALID                       //
// ////////////////////////////////////////////////////// //

/**
 * @param {string} - users email
 * @returns {boolean} - is email already claimed by another user
 */
export function isEmailUsed(email: string) {
  const data: DataStore = getData();

  if (data === null) {
    return;
  }
  for (const user of data.users) {
    if (user.email.toLowerCase() === email.toLowerCase()) {
      throw HTTPError(400, 'Email in use');
    }
  }
}
export function isEmailFound(email: string) {
  const data: DataStore = getData();
  if (data === null) {
    throw HTTPError(400, 'Email not found');
  }
  for (const user of data.users) {
    if (user.email.toLowerCase() === email.toLowerCase()) {
      return true;
    }
  }
  throw HTTPError(400, 'Email not found');
}
/**
 * @param {string} - email
 */
export function isValidEmail(email: string) {
  if (!validator.isEmail(email)) {
    throw HTTPError(400, 'Invalid email');
  }
}

/**
 * @param {string} - users handle
 * @returns {boolean} - is handle unique
 */
export function isValidAuthUserId(authUserId: number): boolean {
  const data: DataStore = getData();

  for (const user of data.users) {
    if (user.uId === authUserId) {
      return true;
    }
  }
  throw HTTPError(400, 'Invalid user id');
}
/**
 * @param {number} - channel id
 * @returns {boolean} - does channel exist
 */

export function isValidChannelId(channelId: number): boolean {
  const data: DataStore = getData();

  for (const channel of data.channels) {
    if (channel.channelId === channelId) {
      return true;
    }
  }
  throw HTTPError(400, 'Invalid channel id');
}

/**
 * @param {number} - Dm id
 * @returns {boolean} - does DM exist
 */
export function isValidDmId(dmId: number) {
  const data: DataStore = getData();
  if (data.dms.some(a => a.dmId === dmId)) {
    return true;
  }
  throw HTTPError(400, 'Invalid dm id');
}
/**
 * Set data back to initial state.
 * @param {string}
 */
export function isValidToken(token: string) {
  const data: DataStore = getData();
  const hash: string = generateTokenHash(token);
  if (!data.activeTokens.some(a => a.hash === hash)) {
    throw HTTPError(403, 'Invalid token');
  }
}
/**
 * Set data back to initial state.
 * @param {number, number} - uId, channel Id
 * @returns {boolean} - is owner true/false
 */
export function isUIdOwnerOfChannel(uId: number, channelId: number) {
  const channelStore: ChannelStore = getChannelStoreFromId(channelId);
  if (channelStore.ownerMembers.find(a => a.uId === uId)) {
    return true;
  }
  return false;
}

/**
 * @param {number} - mId
 * @returns {boolean} - does exist true/false
 */
export function isValidMessageId(mId: number) {
  const dataStore: DataStore = getData();
  if (dataStore.messageIds.find(a => a.messageId === mId)) {
    return true;
  }
  throw HTTPError(400, 'Invalid message id');
}

/**
 * @param {number} - reactId
 * @returns {boolean} - does exist true/false
 */
export function isValidReactId(reactId: number) {
  if (reactId !== 1) {
    throw HTTPError(400, 'Invalid react id');
  }
  return true;
}

export function isThisUserReacted(message: Message, reactId: number, token: string) {
  const uId = getUIdFromToken(token);
  const indexOfReact = message.reacts.findIndex(a => a.reactId === reactId);
  if (indexOfReact !== -1) {
    const indexOfUser = message.reacts[indexOfReact].uIds.findIndex(a => a === uId);
    if (indexOfUser !== -1) {
      return true;
    } else {
      return false;
    }
  }
}
/**
 * @param {number} - permissionId
 * @returns {boolean} - does exist true/false
 */
export function isValidPermId(permissionId: number) {
  if (permissionId === 1) {
    return true;
  }

  if (permissionId === 2) {
    return true;
  }

  throw HTTPError(400, 'Invalid permission id');
}

// ////////////////////////////////////////////////////// //
//                        IS MEMBER                       //
// ////////////////////////////////////////////////////// //

/** Takes in a user ID or token
 * @param {number|string, number} - authorised user's id and channel id
 * @returns {boolean} - is user already member of channel
 */
export function isAuthUserMember(authUserId: number, channelId: number) {
  const channel: ChannelStore = getChannelStoreFromId(channelId);
  if (channel.allMembers.some(a => a.uId === authUserId)) {
    return true;
  }
  return false;
}
export function isTokenMemberOfChannel(token: string, channelId: number) {
  const authUserId: number = getUIdFromToken(token);
  if (isAuthUserMember(authUserId, channelId)) {
    return true;
  }
  return false;
}
/**
 * @param {number|string, number} - authorised user's token and channel id
 * @returns {boolean} - is user an owner of channel
 */
export function isTokenOwnerOfChannel(token: string, channelId: number) {
  const uId: number = getUIdFromToken(token);
  const channelStore: ChannelStore = getChannelStoreFromId(channelId);
  if (channelStore.ownerMembers.some(a => a.uId === uId)) {
    return true;
  }
  return false;
}

/**
 * @param {number} - Dm id
 * @returns {boolean} - does DM exist
 */
export function isTokenMemberOfDm(token: string, dmId: number) {
  const dmStore: DmStore = getDmStore(dmId);
  const uId: number = getUIdFromToken(token);
  if (dmStore.allMembersId.includes(uId)) {
    return true;
  }
  return false;
}

// ////////////////////////////////////////////////////// //
//                            GET                         //
// ////////////////////////////////////////////////////// //
/**
 * @param {number} - User ID
 * @returns {string} - HandleStr
 */
export function getHandleStrfromUid(uId: number): string {
  const userStore: UserStore = getUserStoreFromId(uId);
  return userStore.handleStr;
}
/**
 * @param {number} - User ID
 * @returns {UserStore} - User data
 */
export function getUserStoreFromId(uId: number): UserStore {
  const data: DataStore = getData();
  const index = data.users.findIndex(a => a.uId === uId);
  return <UserStore>data.users[index];
}
/**
 * @param {number} - Channel ID
 * @returns {ChannelStore} - Channel data
 */
export function getChannelStoreFromId(channelId: number):ChannelStore {
  const data: DataStore = getData();
  const channel: ChannelStore = data.channels.find(a => a.channelId === channelId);
  return channel;
}
/**
 * Get the uId of the token owner or return nothing.
 * @param {string}
 * @returns {UserId}
 */
export function getUIdFromToken(token: string): number {
  const data: DataStore = getData();
  const hash: string = generateTokenHash(token);
  const session: TokenHash = data.activeTokens.find(a => a.hash === hash);
  return session.uId;
}
/**
 * Get the uId of the token owner or return nothing.
 * @param {number} - Dm Id
 * @returns {DmStore} - Dm data
 */
export function getDmStore(dmId: number): DmStore {
  const data: DataStore = getData();
  const dmStore: DmStore = data.dms.find(a => a.dmId === dmId);
  return dmStore;
}

export function getMessageStoreFromChannel(messageId: number, channelId: number): Message {
  const channelStore: ChannelStore = getChannelStoreFromId(channelId);
  const indexOfMessage: number = channelStore.messages.findIndex(a => a.messageId === messageId);
  const messageStore: Message = channelStore.messages[indexOfMessage];
  return messageStore;
}

export function getMessageStoreFromDm(messageId: number, dmId: number): Message {
  const dmStore: DmStore = getDmStore(dmId);
  const indexOfMessage: number = dmStore.messages.findIndex(a => a.messageId === messageId);
  const messageStore: Message = dmStore.messages[indexOfMessage];
  return messageStore;
}

/**
 * Retrieve the channel or DM location of a message
 * @param {number} - message Id
 * @returns {MessageTracking} - does message exist true/false
 */
export function getMessageLocation(messageId: number) {
  const data: DataStore = getData();
  const index = data.messageIds.findIndex(a => a.messageId === messageId);
  if (index < 0) {
    return null;
  }
  return <MessageTracking> {
    messageId: data.messageIds[index].messageId,
    dmId: data.messageIds[index].dmId,
    channelId: data.messageIds[index].channelId,
    uId: data.messageIds[index].uId,
  };
}

// ////////////////////////////////////////////////////// //
//                        Permissions                     //
// ////////////////////////////////////////////////////// //
/**
 * @param {number} - uId
 * @returns {boolean} - is user a global owner
 */
export function isGlobalOwner (authUserId: number): boolean {
  const user: UserStore = getUserStoreFromId(authUserId);
  if (user.globalPermission === OWNER) {
    return true;
  }
  return false;
}

/**
 * @param {string, number} - token , channel Id
 * @returns {boolean} - does token have correct permissions
 */
export function doesTokenHaveChanOwnerPermissions (token: string, channelId: number) {
  const uId: number = getUIdFromToken(token);
  const userStore: UserStore = getUserStoreFromId(uId);
  const channelStore: ChannelStore = getChannelStoreFromId(channelId);

  if (channelStore.ownerMembers.find(a => a.uId === uId)) {
    return true;
  }
  if (channelStore.allMembers.find(a => a.uId === uId)) {
    if (userStore.globalPermission === OWNER) {
      return true;
    }
  }
  return false;
}

/**
 * @param {string, number} - token , channel Id
 * @returns {boolean} - does token have correct permissions
 */
export function doesTokenHaveDmOwnerPermissions (token: string, dmId: number) {
  const uId: number = getUIdFromToken(token);
  const dmStore: DmStore = getDmStore(dmId);
  const dmOwnerId: number = dmStore.ownerId;

  if (dmOwnerId === uId) {
    return true;
  }
  return false;
}

// ////////////////////////////////////////////////////// //
//                          Generate                      //
// ////////////////////////////////////////////////////// //

/**
 * Generate DM name from user handles
 * @param {number[]}
 * @returns {string}
 */
export function generateDmName(uIds: number[]) {
  const handleStrList: string[] = [];
  for (const uId of uIds) {
    const handleStr = getHandleStrfromUid(uId);
    handleStrList.push(handleStr);
  }
  const name = handleStrList.sort(
    (a, b) => a.toLowerCase().localeCompare(b.toLowerCase())
  ).join(', ');
  return name;
}
/**
 * Generate unique random integer for DM ID
 * @param {}
 * @returns {number}
 */
export function generateDmId() {
  const data: DataStore = getData();
  const dmIdStores: DmStore[] = data.dms;
  let newDmId = -1;
  while (dmIdStores.find(a => a.dmId === newDmId) || newDmId < 0) {
    newDmId = Math.floor(Math.random() * Math.pow(2, 32));
  }
  return newDmId;
}
/**
 * Generate unique random integer for Message ID
 * @param {}
 * @returns {number}
 */
export function generateMessageId() {
  const data: DataStore = getData();
  const messageIds: MessageId[] = data.messageIds;
  let newMessageId = -1;
  while (messageIds.find(a => a.messageId === newMessageId) || newMessageId < 0) {
    newMessageId = Math.floor(Math.random() * Math.pow(2, 32));
  }
  return newMessageId;
}

/**
 * Generate a unique token by hashing users email and
 * the current time to ensure uniqueness
 * @param {string}
 * @returns {Token}
 */
export function generateToken(email: string): string {
  const time = Date.now().toString();
  return MD5(time + email.toString()).slice(0, 10);
}

/**
 * Generate a hash of token + secret
 * @param {string}
 * @returns {Token}
 */
export function generateTokenHash(token: string): string {
  const key = token.concat(TOKEN_SECRET);
  const hash = crypto.createHash('sha256').update(key).digest('hex');
  return hash;
}

// ////////////////////////////////////////////////////// //
//                     Update Stats                       //
// ////////////////////////////////////////////////////// //
/**
 *
 * @param {number, number}
 */
export function updateUserChannelsJoinedStat(uId: number, leaveOrJoin: LeaveOrJoin) {
  const data: DataStore = getData();
  const index: number = data.users.findIndex(a => a.uId === uId);
  const timeStamp: number = getTimeInSecs();
  const lastElement: number = data.users[index].userStats.channelsJoined.length - 1;

  let newChannelStat: ChannelStat;
  const currChannelCount: number = data.users[index].userStats.channelsJoined[lastElement].numChannelsJoined;
  if (leaveOrJoin === JOIN) {
    newChannelStat = { numChannelsJoined: currChannelCount + 1, timeStamp: timeStamp };
  } else if (leaveOrJoin === LEAVE) {
    newChannelStat = { numChannelsJoined: currChannelCount - 1, timeStamp: timeStamp };
  }
  data.users[index].userStats.channelsJoined.push(newChannelStat);
  setData(data);
}
/**
 *
 * @param {number, number}
 */
export function updateUserDmsJoinedStat(uId: number, leaveOrJoin: LeaveOrJoin) {
  const data: DataStore = getData();
  const index: number = data.users.findIndex(a => a.uId === uId);
  const timeStamp: number = getTimeInSecs();
  const lastElement: number = data.users[index].userStats.dmsJoined.length - 1;

  let newDmStat: DmsStat;
  const currDmCount: number = data.users[index].userStats.dmsJoined[lastElement].numDmsJoined;
  if (leaveOrJoin === JOIN) {
    newDmStat = { numDmsJoined: currDmCount + 1, timeStamp: timeStamp };
  } else if (leaveOrJoin === LEAVE) {
    newDmStat = { numDmsJoined: currDmCount - 1, timeStamp: timeStamp };
  }
  data.users[index].userStats.dmsJoined.push(newDmStat);
  setData(data);
}
/**
 *
 * @param {number}
 */
export function updateUserMessagesSentStat(uId: number) {
  const data: DataStore = getData();
  const index: number = data.users.findIndex(a => a.uId === uId);
  const timeStamp: number = getTimeInSecs();
  const lastElement: number = data.users[index].userStats.messagesSent.length - 1;
  const currMessageCount: number = data.users[index].userStats.messagesSent[lastElement].numMessagesSent;
  const newMessageStat: MessageStat = { numMessagesSent: currMessageCount + 1, timeStamp: timeStamp };
  data.users[index].userStats.messagesSent.push(newMessageStat);
  setData(data);
}
/**
 *
 * @param {number}
 */
export function updateUserInvolvement(uId: number) {
  const data: DataStore = getData();
  const index: number = data.users.findIndex(a => a.uId === uId);
  const userStore: UserStore = getUserStoreFromId(uId);

  let i: number = userStore.userStats.channelsJoined.length - 1;
  const numChannelsJoined: number = userStore.userStats.channelsJoined[i].numChannelsJoined;

  i = userStore.userStats.dmsJoined.length - 1;
  const numDmsJoined: number = userStore.userStats.dmsJoined[i].numDmsJoined;

  i = userStore.userStats.messagesSent.length - 1;
  const numMessagesSent: number = userStore.userStats.messagesSent[i].numMessagesSent;

  const numChannels: number = data.channels.length;
  const numDms: number = data.dms.length;
  const numMessages: number = data.messageIds.length;

  const numerator = (numChannelsJoined + numDmsJoined + numMessagesSent);
  const denominator = (numChannels + numDms + numMessages);
  let involvementRate: number;
  if (denominator === 0) {
    involvementRate = 0;
  } else {
    involvementRate = numerator / denominator;
  }
  if (involvementRate > 1) {
    involvementRate = 1;
  }
  data.users[index].userStats.involvementRate = involvementRate;
  setData(data);
}
/**
 * Count how many channels exist and update the stat
 */
export function updateNumChannelsExistStat() {
  const data: DataStore = getData();
  const timeStamp: number = getTimeInSecs();
  const numChannels: number = data.channels.length;
  const newStat: NumChannelsExist = { numChannelsExist: numChannels, timeStamp: timeStamp };
  data.workspaceStats.channelsExist.push(newStat);
  setData(data);
}

/**
 * Count how many dms exist and update the stat
 */
export function updateNumDmsExistStat() {
  const data: DataStore = getData();
  const timeStamp: number = getTimeInSecs();
  const numDms: number = data.dms.length;
  const newStat: DmsExist = { numDmsExist: numDms, timeStamp: timeStamp };
  data.workspaceStats.dmsExist.push(newStat);
  setData(data);
}

/**
 * Count how many dms exist and update the stat
 */
export function updateNumMessagesExistStat() {
  const data: DataStore = getData();
  const timeStamp: number = getTimeInSecs();
  const numMessages: number = data.messageIds.length;
  const newStat: MessagesExist = { numMessagesExist: numMessages, timeStamp: timeStamp };
  data.workspaceStats.messagesExist.push(newStat);
  setData(data);
}

// ////////////////////////////////////////////////////// //
//                         Utilities                      //
// ////////////////////////////////////////////////////// //
/**
 * Set data back to initial state.
 * @param {}
 * @returns {number}
 */
export function getTimeInSecs(): number {
  const time: number = Math.floor(Date.now() / 1000);
  return time;
}
