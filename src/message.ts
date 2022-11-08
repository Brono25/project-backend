
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
  DmStore
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
  if (!isValidChannelId(channelId)) {
    return { error: 'Invalid channel ID' };
  }
  if (message.length < MIN_MSG_LEN || message.length > MAX_MSG_LEN) {
    return { error: 'Invalid message length' };
  }
  if (!isValidToken(token)) {
    return { error: 'Invalid token' };
  }
  if (!isTokenMemberOfChannel(token, channelId)) {
    return { error: 'Only members can message on the channel' };
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
  if (!isValidToken(token)) {
    return { error: 'Invalid token' };
  }
  if (!isValidDmId(dmId)) {
    return { error: 'Invalid DM ID' };
  }
  if (message.length < MIN_MSG_LEN || message.length > MAX_MSG_LEN) {
    return { error: 'Invalid message length' };
  }
  if (!isTokenMemberOfDm(token, dmId)) {
    return { error: 'Invalid Member' };
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
  if (!isValidToken(token)) {
    return { error: 'Invalid token' };
  }
  const messageLoc: MessageTracking = getMessageLocation(messageId);
  if (messageLoc === null) {
    return { error: 'Message doesnt exist' };
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
    return { error: 'Invalid message Id' };
  }
  const isUsersOwnMessage = <boolean> (getUIdFromToken(token) === uId);
  if (!doesTokenHaveChanOwnerPermissions(token, channelId) && !isUsersOwnMessage) {
    return { error: 'Token doesnt have permission' };
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
    return { error: 'Invalid message Id' };
  }
  const isUsersOwnMessage = <boolean> (getUIdFromToken(token) === uId);
  if (!doesTokenHaveDmOwnerPermissions(token, dmId) && !isUsersOwnMessage) {
    return { error: 'Token doesnt have permission' };
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
  if (!isValidToken(token)) {
    return { error: 'Invalid token' };
  }
  const MAX_MSG_LEN = 1000;
  if (message.length > MAX_MSG_LEN) {
    return { error: 'Invalid message' };
  }
  if (!isValidMessageId(messageId)) {
    return { error: 'Invalid message ID' };
  }
  const messageLoc: MessageTracking = getMessageLocation(messageId);
  const channelId: number = messageLoc.channelId;
  const dmId: number = messageLoc.dmId;
  if (channelId !== null) {
    if (!isTokenMemberOfChannel(token, channelId)) {
      return { error: 'Not a channel memeber' };
    }
    if (!doesTokenHaveChanOwnerPermissions(token, channelId)) {
      return { error: 'Dont have channel owner permissions' };
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

  if (messageLoc.dmId !== null) {
    if (!isTokenMemberOfDm(token, messageLoc.dmId)) {
      return { error: 'Not a dm memeber' };
    }
    if (!doesTokenHaveDmOwnerPermissions(token, messageLoc.dmId)) {
      return { error: 'Dont have dm owner permissions' };
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

  return {};
}
