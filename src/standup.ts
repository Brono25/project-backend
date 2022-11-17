


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
  
  console.log(length)
  return {timeFinish: length};
}


// ////////////////////////////////////////////////////// //
//                        StandupActive                   //
// ////////////////////////////////////////////////////// //
/**
 * Logouts a user by invalidating their token
 *
 * @param {string, number, number} - token, channelId, length
 * @returns {number} time finished
 */

export function standupActivetV1(token: string, channelId: number, length: number) {
  isValidToken(token);
  
  console.log(length)
  return {timeFinish: length};
}
