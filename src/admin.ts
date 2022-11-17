
import HTTPError from 'http-errors';
import {
  setData,
  getData
} from './dataStore';
import { isValidToken } from './other';

// ////////////////////////////////////////////////////// //
//                   Admin User Remove                    //
// ////////////////////////////////////////////////////// //
/**
 * Given a registered user's email and password, returns their authUserId value.
 *
 * @param {string, string} - users and password
 * @returns {AuthLoginReturn} - authUserId
 */
export function adminUserRemoveV1(token: string, uId: number) {
  isValidToken(token);

  return {};
}
