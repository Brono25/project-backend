
import {
  MessageSendReturn,
  MessageId,
  Message,
  DataStore,
  MAX_MSG_LEN,
  MIN_MSG_LEN,
  Error,
} from './data.types';
import {
  isValidChannelId,
  isValidToken,
  isTokenOwnerMember,
  generateMessageId,
  getUIdFromToken,
  getTimeInSecs,
  isValidDmId,
  isTokenMemberOfDm,
} from './other';

import { getData, setData } from './dataStore';

// ////////////////////////////////////////////////////// //
//                     messageSendV1                      //
// ////////////////////////////////////////////////////// //

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
  if (!isTokenOwnerMember(token, channelId)) {
    return { error: 'Only members can message on the channel' };
  }

  const messageId: MessageId = { messageId: generateMessageId() };
  const messageDetails: Message = {
    messageId: messageId.messageId,
    uId: getUIdFromToken(token),
    message: message,
    timeSent: getTimeInSecs(),
  };
  const data: DataStore = getData();
  const index = data.channels.findIndex(a => a.channelId === channelId);
  data.channels[index].messages.push(messageDetails);
  data.messageIds.push(messageId);
  setData(data);
  return messageId;
}

// ////////////////////////////////////////////////////// //
//                    messageSendDmV1                     //
// ////////////////////////////////////////////////////// //

export function messageSendDmV1(token: string, dmId: number, message: string): MessageId | Error {
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

  const messageId: MessageId = { messageId: generateMessageId() };
  const messageDetails: Message = {
    messageId: messageId.messageId,
    uId: getUIdFromToken(token),
    message: message,
    timeSent: getTimeInSecs(),
  };
  const data: DataStore = getData();
  const index = data.dms.findIndex(a => a.dmId === dmId);
  data.dms[index].messages.push(messageDetails);
  data.messageIds.push(messageId);
  setData(data);
  return messageId;
}
