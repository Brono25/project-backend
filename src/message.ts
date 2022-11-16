import HTTPError from 'http-errors';
import {
  MessageSendReturn,
  MessageId,
  Message,
  DataStore,
  MAX_MSG_LEN,
  MIN_MSG_LEN,
  Error,
  ChannelStore,
  MessageTracking,
  DmStore,
  React
} from './data.types';

import {
  isValidChannelId,
  isValidToken,
  isTokenMemberOfChannel,
  generateMessageId,
  getUIdFromToken,
  getTimeInSecs,
  isValidDmId,
  isTokenMemberOfDm,
  getMessageLocation,
  getChannelStoreFromId,
  doesTokenHaveChanOwnerPermissions,
  doesTokenHaveDmOwnerPermissions,
  getDmStore,
  isValidMessageId,
  updateUserMessagesSentStat,
  isValidReactId,
} from './other';

import { getData, setData } from './dataStore';

// ////////////////////////////////////////////////////// //
//                     messageSendV1                      //
// ////////////////////////////////////////////////////// //
/**
 * User as part of a channel can send a message.
 * @param {string, number, string}
 * @returns { MessageId | Error}
 */
export function messageSendV1(
  token: string,
  channelId: number,
  message: string)
  : MessageSendReturn {
  isValidToken(token);
  isValidChannelId(channelId);

  if (message.length < MIN_MSG_LEN || message.length > MAX_MSG_LEN) {
    throw HTTPError(400, 'Invalid message');
  }
  if (!isTokenMemberOfChannel(token, channelId)) {
    throw HTTPError(403, 'User is not a member');
  }
  const messageId: number = generateMessageId();
  const uId: number = getUIdFromToken(token);
  const messageLoc: MessageTracking = {
    messageId: messageId,
    channelId: channelId,
    dmId: null,
    uId: uId
  };
  const messageDetails: Message = {
    messageId: messageLoc.messageId,
    uId: uId,
    message: message,
    timeSent: getTimeInSecs(),
  };
  const data: DataStore = getData();
  const index = data.channels.findIndex(a => a.channelId === channelId);
  data.channels[index].messages.unshift(messageDetails);
  data.messageIds.unshift(messageLoc);
  setData(data);
  updateUserMessagesSentStat(uId);
  return <MessageId>{ messageId: messageId };
}

// ////////////////////////////////////////////////////// //
//                    messageSendDmV1                     //
// ////////////////////////////////////////////////////// //
/**
 * User as part of a DM can send a message.
 * @param {string, number, string}
 * @returns { MessageId | Error}
 */
export function messageSendDmV1(
  token: string, dmId: number, message: string
): MessageId | Error {
  isValidToken(token);
  isValidDmId(dmId);

  if (message.length < MIN_MSG_LEN || message.length > MAX_MSG_LEN) {
    throw HTTPError(400, 'Invalid message length');
  }
  if (!isTokenMemberOfDm(token, dmId)) {
    throw HTTPError(403, 'User not a member');
  }
  const messageId: number = generateMessageId();
  const uId: number = getUIdFromToken(token);
  const messageLoc: MessageTracking = {
    messageId: messageId,
    channelId: null,
    dmId: dmId,
    uId: uId
  };
  const messageDetails: Message = {
    messageId: messageId,
    uId: uId,
    message: message,
    timeSent: getTimeInSecs(),
  };
  const data: DataStore = getData();
  const index = data.dms.findIndex(a => a.dmId === dmId);
  data.dms[index].messages.unshift(messageDetails);
  data.messageIds.unshift(messageLoc);
  setData(data);
  updateUserMessagesSentStat(uId);
  return <MessageId>{ messageId: messageId };
}

// ////////////////////////////////////////////////////// //
//                      messageRemove                     //
// ////////////////////////////////////////////////////// //
/**
 * User as part of a DM can send a message.
 * @param {string, number}
 * @returns { object | Error}
 */
export function messageRemoveV1(token: string, messageId: number): object | Error {
  isValidToken(token);
  const messageLoc: MessageTracking = getMessageLocation(messageId);
  if (messageLoc === null) {
    throw HTTPError(400, 'Invalid message id');
  }
  if (messageLoc.channelId !== null) {
    const channelId: number = messageLoc.channelId;
    return removeChannelMessage(token, channelId, messageId, messageLoc.uId);
  }

  if (messageLoc.dmId !== null) {
    const dmId: number = messageLoc.dmId;
    return removeDmMessage(token, dmId, messageId, messageLoc.uId);
  }
}

/**
 * @param {string, number, number, number}
 * @returns { object | Error}
 */
function removeChannelMessage(token: string, channelId: number, messageId: number, uId: number) {
  if (!isTokenMemberOfChannel(token, channelId)) {
    throw HTTPError(403, 'User doesnt have permission');
  }
  const isUsersOwnMessage = <boolean> (getUIdFromToken(token) === uId);
  if (!doesTokenHaveChanOwnerPermissions(token, channelId) && !isUsersOwnMessage) {
    throw HTTPError(403, 'User doesnt have permission');
  }
  const data: DataStore = getData();
  const channelStore: ChannelStore = getChannelStoreFromId(channelId);
  let index: number = channelStore.messages.findIndex(a => a.messageId === messageId);
  channelStore.messages.splice(index, 1);
  index = data.channels.findIndex(a => a.channelId === channelId);
  data.channels[index] = channelStore;
  index = data.messageIds.findIndex(a => a.messageId === messageId);
  data.messageIds.splice(index, 1);
  setData(data);
  return {};
}

/**
 * @param {string, number, number, number}
 * @returns { object | Error}
 */
function removeDmMessage(token: string, dmId: number, messageId: number, uId: number) {
  if (!isTokenMemberOfDm(token, dmId)) {
    throw HTTPError(403, 'User doesnt have permission');
  }
  const isUsersOwnMessage = <boolean> (getUIdFromToken(token) === uId);
  if (!doesTokenHaveDmOwnerPermissions(token, dmId) && !isUsersOwnMessage) {
    throw HTTPError(403, 'User doesnt have permission');
  }
  const data: DataStore = getData();
  const dmStore: DmStore = getDmStore(dmId);
  let index: number = dmStore.messages.findIndex(a => a.messageId === messageId);
  dmStore.messages.splice(index, 1);
  index = data.dms.findIndex(a => a.dmId === dmId);
  data.dms[index] = dmStore;
  index = data.messageIds.findIndex(a => a.messageId === messageId);
  data.messageIds.splice(index, 1);
  setData(data);
  return {};
}

// ////////////////////////////////////////////////////// //
//                        messageEdit                     //
// ////////////////////////////////////////////////////// //
/**
 * User as part of a DM can send a message.
 * @param {string, number, string}
 * @returns { object | Error}
 */
export function messageEditV1(token: string, messageId: number, message: string): object | Error {
  isValidToken(token);
  isValidMessageId(messageId);
  const MAX_MSG_LEN = 1000;
  if (message.length > MAX_MSG_LEN) {
    throw HTTPError(400, 'Invalid message');
  }
  const messageLoc: MessageTracking = getMessageLocation(messageId);
  const channelId: number = messageLoc.channelId;
  const dmId: number = messageLoc.dmId;
  if (channelId !== null) {
    editChannelMessage(token, messageId, message, channelId);
  }
  if (messageLoc.dmId !== null) {
    editDmMessage(token, messageId, message, dmId);
  }
  return {};
}

/**
 * Edit channel messages
 * @param {string, number, string, number}
 */

function editChannelMessage(token: string, messageId: number, message: string, channelId: number) {
  if (!isTokenMemberOfChannel(token, channelId)) {
    throw HTTPError(403, 'Not a channel memeber');
  }
  if (!doesTokenHaveChanOwnerPermissions(token, channelId)) {
    throw HTTPError(403, 'Dont have channel owner permissions');
  }
  const channelStore: ChannelStore = getChannelStoreFromId(channelId);
  let index: number = channelStore.messages.findIndex(a => a.messageId === messageId);
  const messageStore: Message = channelStore.messages[index];
  const data: DataStore = getData();
  messageStore.message = message;
  if (message === '') {
    channelStore.messages.splice(index, 1);
    data.messageIds.splice(index, 1);
  }
  index = data.channels.findIndex(a => a.channelId === channelId);
  data.channels[index] = channelStore;
  index = data.messageIds.findIndex(a => a.messageId === messageId);
  setData(data);
}
/**
 * edit dm messages
 * @param {string, number, string, number}
 */

function editDmMessage(token: string, messageId: number, message: string, dmId: number) {
  if (!isTokenMemberOfDm(token, dmId)) {
    throw HTTPError(403, 'Not a dm memeber');
  }
  if (!doesTokenHaveDmOwnerPermissions(token, dmId)) {
    throw HTTPError(403, 'Dont have dm owner permissions');
  }
  const dmStore: DmStore = getDmStore(dmId);
  let index: number = dmStore.messages.findIndex(a => a.messageId === messageId);
  const messageStore: Message = dmStore.messages[index];
  const data: DataStore = getData();
  messageStore.message = message;
  if (message === '') {
    dmStore.messages.splice(index, 1);
    data.messageIds.splice(index, 1);
  }
  index = data.dms.findIndex(a => a.dmId === dmId);
  data.dms[index] = dmStore;
  index = data.messageIds.findIndex(a => a.messageId === messageId);
  setData(data);
}
// ////////////////////////////////////////////////////// //
//                      messageReact                      //
// ////////////////////////////////////////////////////// //
/**
 * Given a message within a channel or DM the authorised user is part of, adds a "react" to that particular message.
 * @param {number, number}
 * @returns { {} | Error}
 */
export function messageReactV1(token: string, messageId: number, reactId: number) {
  isValidToken(token);
  isValidMessageId(messageId);
  isValidReactId(reactId);
  const messageLoc: MessageTracking = getMessageLocation(messageId);
  const channelId: number = messageLoc.channelId;
  const dmId: number = messageLoc.dmId;
  if (channelId !== null) {
    reactChannelMessage(token, messageId, reactId, channelId);
  }
  if (messageLoc.dmId !== null) {
    reactDmMessage(token, messageId, reactId, dmId);
  }
  return {};
}

function reactChannelMessage(token: string, messageId: number, reactId: number, channelId: number) {
  if (!isTokenMemberOfChannel(token, channelId)) {
    throw HTTPError(400, 'Not a channel memeber');
  }

  const uId = getUIdFromToken(token);
  const channelStore: ChannelStore = getChannelStoreFromId(channelId);
  const indexOfMessage: number = channelStore.messages.findIndex(a => a.messageId === messageId);
  const messageStore: Message = channelStore.messages[indexOfMessage];
  if (messageStore.reacts === undefined) {
    messageStore.reacts = [];
  }
  const indexOfReact = messageStore.reacts.findIndex(a => a.reactId === reactId);

  const data: DataStore = getData();
  const react: React = {
    reactId: reactId,
    uIds: [uId],
    isThisUserReacted: null,
  };

  if (indexOfReact !== -1) {
    const indexOfUser = messageStore.reacts[indexOfReact].uIds.findIndex(a => a === uId);
    messageStore.reacts[indexOfReact].uIds.push(uId);
    if (indexOfUser !== -1) {
      throw HTTPError(400, 'the message already contains a react from the authorised user');
    }
  } else {
    messageStore.reacts.push(react);
  }
  const indexOfChannel = data.channels.findIndex(a => a.channelId === channelId);
  data.channels[indexOfChannel].messages[indexOfMessage] = messageStore;
  setData(data);
}

function reactDmMessage(token: string, messageId: number, reactId: number, dmId: number) {
  if (!isTokenMemberOfDm(token, dmId)) {
    throw HTTPError(400, 'Not a dm memeber');
  }
  const uId = getUIdFromToken(token);
  const dmStore: DmStore = getDmStore(dmId);
  const indexOfMessage: number = dmStore.messages.findIndex(a => a.messageId === messageId);
  const messageStore: Message = dmStore.messages[indexOfMessage];
  if (messageStore.reacts === undefined) {
    messageStore.reacts = [];
  }
  const indexOfReact = messageStore.reacts.findIndex(a => a.reactId === reactId);

  const data: DataStore = getData();
  const react: React = {
    reactId: reactId,
    uIds: [uId],
    isThisUserReacted: null,
  };

  if (indexOfReact !== -1) {
    const indexOfUser = messageStore.reacts[indexOfReact].uIds.findIndex(a => a === uId);
    messageStore.reacts[indexOfReact].uIds.push(uId);
    if (indexOfUser !== -1) {
      throw HTTPError(400, 'the message already contains a react from the authorised user');
    }
  } else {
    messageStore.reacts.push(react);
  }
  const indexOfDm = data.dms.findIndex(a => a.dmId === dmId);
  data.dms[indexOfDm].messages[indexOfMessage] = messageStore;
  setData(data);
}
