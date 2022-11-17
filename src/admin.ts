
import HTTPError from 'http-errors';
import {
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
