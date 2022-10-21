
import {
  MessageSendReturn,
  MessageId,
  Message,
  DataStore,
  MAX_MSG_LEN,
  MIN_MSG_LEN,
} from './data.types';
import {
  isValidChannelId,
  isActiveToken,
  isTokenOwnerMember,
  getChannelStoreFromId,
  generateMessageId,
  getTokenOwnersUid,
  getTimeInSecs,
} from './other';

import { getData } from './dataStore';

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
  if (!isActiveToken(token)) {
    return { error: 'Invalid token' };
  }
  if (!isTokenOwnerMember(token, channelId)) {
    return { error: 'Only members can message on the channel' };
  }

  const messageId: MessageId = { messageId: generateMessageId() };
  const messageDetails: Message = {
    messageId: messageId.messageId,
    uId: getTokenOwnersUid(token),
    message: message,
    timeSent: getTimeInSecs(),
  };
  const channelStore = getChannelStoreFromId(channelId);
  channelStore.messages.push(messageDetails);
  const data: DataStore = getData();
  data.messageIds.push(messageId);

  return messageId;
}

// ////////////////////////////////////////////////////// //
//                        sendDmV1                        //
// ////////////////////////////////////////////////////// //

export function messageSendDmV1(token: string, dmId: number, message: string): MessageId | Error {
  return { messageId: -1 };
}
