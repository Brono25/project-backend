


import {isValidToken} from './other'


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
  
  console.log(token, channelId, length)
  return {timeFinish: length};
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
  console.log('B')

  return {isActive: true, timeFinish: 10 }
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
  console.log('C-------------------------')
  return {}
}
