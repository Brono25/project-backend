
import {
  DataStore,
  User,
  UsersAllReturn,
} from './data.types';

import {
  isValidToken,
} from './other';

import {
  getData,
} from './dataStore';

// ////////////////////////////////////////////////////// //
//                      usersAllv1                        //
// ////////////////////////////////////////////////////// //
/**
 * For a valid token, returns a list of all users and their associated details.
 *
 * @param {string} - the uId of the user and the user to view
 * @returns {users} - An array of all users
 */

function usersAllv1(token: string): UsersAllReturn {
  isValidToken(token);

  const data: DataStore = getData();
  let userDetails: User;
  const usersList: User[] = [];
  for (const user of data.users) {
    userDetails = {
      uId: user.uId,
      email: user.email,
      nameFirst: user.nameFirst,
      nameLast: user.nameLast,
      handleStr: user.handleStr,
    };
    usersList.push(userDetails);
  }
  return { users: usersList };
}

export {
  usersAllv1,
};
