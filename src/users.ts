
import { DataStore, Error, User, UsersAllReturn, UserStore } from './data.types';
import { getTokenOwnersUid, getUserStoreFromId, isActiveToken, isValidAuthUserId } from './other';
import { getData, setData } from './dataStore';

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
  if (!isActiveToken(token)) {
    return { error: 'token is invalid!' };
  }

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
// ////////////////////////////////////////////////////// //
//                  userProfileSetNameV1                  //
// ////////////////////////////////////////////////////// //
/**
 * Update the authorised user's first and last name
 *
 * @param {string, string, string} - token, new first name, new last name to update for a user
 * @returns {}
 */

function userProfileSetNameV1(token: string, nameFirst: string, nameLast: string): any {
  if (!isActiveToken(token)) {
    return { error: 'token is invalid!' };
  }
  const maxNameLength = 50;
  const minNameLength = 1;
  if (nameFirst.length < minNameLength || nameFirst.length > maxNameLength) {
    return { error: 'First name must be between 1-50 characters long (inclusive)' };
  }
  if (nameLast.length < minNameLength || nameLast.length > maxNameLength) {
    return { error: 'Last name must be between 1-50 characters long (inclusive)' };
  }

  const data: DataStore = getData();
  const uId: number = getTokenOwnersUid(token);
  const userDetails: UserStore = getUserStoreFromId(uId);
  const index = data.users.indexOf(userDetails);
  userDetails.nameFirst = nameFirst;
  userDetails.nameLast = nameLast;
  data.users[index] = userDetails;
  setData(data);
  return {};
}

export {
  userProfileV2,
  usersAllv1,
  userProfileSetNameV1,
};
