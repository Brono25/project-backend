
import HTTPError from 'http-errors';

import {
  isValidToken,
  isTokenMemberOfChannel,
  isValidChannelId
} from './other';

// ////////////////////////////////////////////////////// //
//                      StandupStart                      //
// ////////////////////////////////////////////////////// //
/**
 * Logouts a user by invalidating their token
 *
 * @param {string, number, number} - token, channelId, length
 * @returns {number} time finished
 */

export function standupStartV1(token: string, channelId: number, length: number) {
  isValidToken(token);
  isValidChannelId(channelId);
  if (length < 0) {
    throw HTTPError(400, 'Invalid length');
  }
  if (!isTokenMemberOfChannel(token, channelId)) {
    throw HTTPError(403, 'User not a member');
  }
  throw HTTPError(400, 'Standup currently active');
}

// ////////////////////////////////////////////////////// //
//                        StandupActive                   //
// ////////////////////////////////////////////////////// //
/**
 *
 * @param {string, number, number} - token, channelId, length
 * @returns {number} time finished
 */

export function standupActivetV1(token: string, channelId: number) {
  isValidToken(token);
  isValidChannelId(channelId);
  if (!isTokenMemberOfChannel(token, channelId)) {
    throw HTTPError(403, 'User not a member');
  }
}

// ////////////////////////////////////////////////////// //
//                       StandupSend                      //
// ////////////////////////////////////////////////////// //
/**
 *
 * @param {string, number, number} - token, channelId, message
 * @returns {number} time finished
 */

export function standupSendV1(token: string, channelId: number, message: string) {
  isValidToken(token);
  isValidChannelId(channelId);

  if (message.length > 1000) {
    throw HTTPError(400, 'invalid message');
  }
  if (!isTokenMemberOfChannel(token, channelId)) {
    throw HTTPError(403, 'User not a member');
  }
  throw HTTPError(400, 'Standup not currently active');
}
