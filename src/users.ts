import HTTPError from 'http-errors';
import validator from 'validator';
import { isEmailUsed } from './auth';
import {
  DataStore,
  Error,
  User,
  UsersAllReturn,
  UserStore,
  userProfSetHandleReturn,
} from './data.types';

import {
  getUIdFromToken,
  getUserStoreFromId,
  isValidToken,
  isValidAuthUserId
} from './other';

import {
  getData,
  setData
} from './dataStore';

import {
  isHandleStrUnique,
} from './auth';

// ////////////////////////////////////////////////////// //
//                      userProfileV1                     //
// ////////////////////////////////////////////////////// //
/**
 * For a valid user, returns information about their
 * user ID, email, first name, last name, and handle
 *
 * @param {number, number} - the uId of the user and the user to view
 * @returns {user} -Object containing uId, email, nameFirst, nameLast, handleStr
 */

function userProfileV2(token: string, uId: number): {user: User} | Error {
  if (!isValidAuthUserId(uId)) {
    return { error: 'authUserId is invalid!' };
  }

  if (!isValidToken(token)) {
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
  if (!isValidToken(token)) {
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

function userProfileSetNameV1(token: string, nameFirst: string, nameLast: string): object {
  if (!isValidToken(token)) {
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
  const uId: number = getUIdFromToken(token);
  const userDetails: UserStore = getUserStoreFromId(uId);
  const index = data.users.findIndex(a => a.uId === uId);
  userDetails.nameFirst = nameFirst;
  userDetails.nameLast = nameLast;
  data.users[index] = userDetails;
  setData(data);
  return {};
}

// ////////////////////////////////////////////////////// //
//                  userProfileSetHandleV1                //
// ////////////////////////////////////////////////////// //
/**
 * Update the authorised user's handle
 *
 * @param {string, string} - token and handle to update for a user
 * @returns {}
 */

function userProfileSetHandleV1(token: string, handleStr: string): userProfSetHandleReturn {
  if (!isValidToken(token)) {
    return { error: 'token is invalid!' };
  }

  const maxHandleLength = 20;
  const minHandleLength = 3;

  if (handleStr.length < minHandleLength || handleStr.length > maxHandleLength) {
    return { error: 'Handle must be between 3-20 characters long (inclusive)' };
  }

  if (!handleStr.match(/^[0-9a-zA-z]+$/)) {
    return { error: 'handleStr contains characters that are not alphanumeric' };
  }

  if (!isHandleStrUnique(handleStr)) {
    return { error: 'Handle is already used by another user' };
  }

  const data: DataStore = getData();
  const uId: number = getUIdFromToken(token);
  const userDetails: UserStore = getUserStoreFromId(uId);
  const index = data.users.findIndex(a => a.uId === uId);
  userDetails.handleStr = handleStr;
  data.users[index] = userDetails;
  setData(data);
  return {};
}

// ////////////////////////////////////////////////////// //
//                  userProfileSetEmailV1                 //
// ////////////////////////////////////////////////////// //
/**
 * Update the authorised user's email
 *
 * @param {string, string} - token and email to update for a user
 * @returns {}
 */
function userProfileSetEmailV1(token: string, email: string): any {
  if (!validator.isEmail(email)) {
    return { error: 'Invalid Email' };
  }

  if (isEmailUsed(email)) {
    return { error: 'Email is already taken' };
  }

  if (!isValidToken(token)) {
    return { error: 'token is invalid!' };
  }

  const data: DataStore = getData();
  const uId: number = getUIdFromToken(token);
  const userDetails: UserStore = getUserStoreFromId(uId);
  const index = data.users.findIndex(a => a.uId === uId);
  userDetails.email = email;
  data.users[index] = userDetails;
  setData(data);
  return {};
}

export {
  userProfileV2,
  usersAllv1,
  userProfileSetNameV1,
  userProfileSetHandleV1,
  userProfileSetEmailV1,
};
