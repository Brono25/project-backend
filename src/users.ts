
import { DataStore, Error, User } from './data.types';
import { isActiveToken, isValidAuthUserId } from './other';
import { getData } from './dataStore';

// ////////////////////////////////////////////////////// //
//                      userProfileV1                     //
// ////////////////////////////////////////////////////// //
/**
 * For a valid user, returns information about their user ID, email, first name, last name, and handle
 *
 * @param {number, number} - the uId of the user and the user to view
 * @returns {user} -Object containing uId, email, nameFirst, nameLast, handleStr
 */

function userProfileV2(token: string, uId: number): {user: User} | Error {
  if (!isValidAuthUserId(uId)) {
    return { error: 'authUserId is invalid!' };
  }

  if (!isActiveToken(token)) {
    return { error: 'token is invalid!' };
  }

  const data: DataStore = getData();

  for (const user of data.users) {
    if (user.uId === uId) {
      return {
        user: {
          uId: user.uId,
          email: user.email,
          nameFirst: user.nameFirst,
          nameLast: user.nameLast,
          handleStr: user.handleStr,
        }
      };
    }
  }
  return { error: 'User to view is invalid!' };
}

export {
  userProfileV2,
};
