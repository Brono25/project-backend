
import {
  MessageSendReturn,
} from './data.types';
import {
  isValidChannelId,
  isActiveToken,
  isTokenOwnerMember,
} from './other';

import {
  MAX_MSG_LEN,
  MIN_MSG_LEN,
} from './data.types';
// ////////////////////////////////////////////////////// //
//                     AuthRegisterV1                     //
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

  return { messageId: -1 };
}
