
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
    messageId: generateMessageId(),
    channelId: null,
    dmId: dmId,
    uId: uId
  };
  const messageDetails: Message = {
    messageId: messageLoc.messageId,
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
    console.log(messageLoc);
    return removeChannelMessage(token, channelId, messageId, messageLoc.uId);
  }

  return { error: 'something went wrong' };
}

function removeChannelMessage(token: string, channelId: number, messageId: number, uId: number) {
  if (!isTokenMemberOfChannel(token, channelId)) {
    return { error: 'Invalid message Id' };
  }
  const isUsersOwnMessage = <boolean> (getUIdFromToken(token) === uId);
  console.log(getUIdFromToken(token), uId);
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
