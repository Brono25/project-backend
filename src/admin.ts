
import HTTPError from 'http-errors';
import {
  setData,
  getData
} from './dataStore';
import {
  getUIdFromToken,
  isValidToken,
  isValidAuthUserId,
} from './other';

// ////////////////////////////////////////////////////// //
//                   Admin User Remove                    //
// ////////////////////////////////////////////////////// //
/**
 * Remove user
 *
 * @param {string, number} - token and user Id
 * @returns {}
 */
export function adminUserRemoveV1(token: string, uId: number) {
  isValidToken(token);

  if (!isValidAuthUserId(uId)) {
     throw HTTPError(400, 'Invalid user id');
  }
  

  return {};
}
