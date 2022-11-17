
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
 * Remove user
 *
 * @param {string, number} - token and user Id
 * @returns {}
 */
export function adminUserRemoveV1(token: string, uId: number) {
  isValidToken(token);

  return {};
}
