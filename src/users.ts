
import { isValidAuthUserId } from './other';
import {
  getData,
} from './dataStore';

/**
 * For a valid user, returns information about their user ID, email, first name, last name, and handle
 *
 * @param {number, number} - the uId of the user and the user to view
 * @returns {user} -Object containing uId, email, nameFirst, nameLast, handleStr
 */
function userProfileV1(authUserId, uId) {
  if (isValidAuthUserId(authUserId) === false) {
    return { error: 'authUserId is invalid!' };
  }
  const data = getData();

  for (const user of data.users) {
    if (user.uId === uId) {
      return {
        user: {
          uId: uId,
          email: user.email,
          nameFirst: user.nameFirst,
          nameLast: user.nameLast,
          handleString: user.handleStr,
        }
      };
    }
  }

  return { error: 'User to view is invalid!' };
}

export {
  userProfileV1,
};
