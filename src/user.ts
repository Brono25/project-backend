import HTTPError from 'http-errors';
import validator from 'validator';

import {
  DataStore,
  Error,
  User,
  UserStore,
  userProfSetHandleReturn,
  UserStats
} from './data.types';

import {
  getUIdFromToken,
  getUserStoreFromId,
  isValidToken,
  isValidAuthUserId,
  isEmailUsed,
  updateUserInvolvement
} from './other';

import {
  getData,
  setData
} from './dataStore';

import {
  isHandleStrUnique,
} from './auth';
/* import request from 'sync-request';
import Jimp from 'jimp'; */

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

export function userProfileV2(token: string, uId: number): {user: User} | Error {
  isValidToken(token);
  if (!isValidAuthUserId(uId)) {
    throw HTTPError(400, 'User is not autherised');
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
//                  userProfileSetNameV1                  //
// ////////////////////////////////////////////////////// //
/**
 * Update the authorised user's first and last name
 *
 * @param {string, string, string} - token, new first name, new last name to update for a user
 * @returns {}
 */

export function userProfileSetNameV1(token: string, nameFirst: string, nameLast: string): object {
  isValidToken(token);
  const maxNameLength = 50;
  const minNameLength = 1;
  if (nameFirst.length < minNameLength || nameFirst.length > maxNameLength) {
    throw HTTPError(400, 'First name must be between 1-50 characters long (inclusive)');
  }
  if (nameLast.length < minNameLength || nameLast.length > maxNameLength) {
    throw HTTPError(400, 'Last name must be between 1-50 characters long (inclusive)');
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

export function userProfileSetHandleV1(token: string, handleStr: string): userProfSetHandleReturn {
  isValidToken(token);

  const maxHandleLength = 20;
  const minHandleLength = 3;
  if (handleStr.length < minHandleLength || handleStr.length > maxHandleLength) {
    throw HTTPError(400, 'Handle must be between 3-20 characters long (inclusive)');
  }
  if (!handleStr.match(/^[0-9a-zA-z]+$/)) {
    throw HTTPError(400, 'handleStr contains characters that are not alphanumeric');
  }
  if (!isHandleStrUnique(handleStr)) {
    throw HTTPError(400, 'Handle is already used by another user');
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
export function userProfileSetEmailV1(token: string, email: string): any {
  isValidToken(token);
  isEmailUsed(email);
  if (!validator.isEmail(email)) {
    throw HTTPError(400, 'Invalid Email');
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

// ////////////////////////////////////////////////////// //
//                       user/stats/v1                    //
// ////////////////////////////////////////////////////// //
/**
 * Fetches the required statistics about users use of Beans
 *
 * @param {} - token and email to update for a user
 * @returns {}
 */
export function userStatsV1(token: string): {userStats: UserStats} {
  isValidToken(token);
  const uId: number = getUIdFromToken(token);
  updateUserInvolvement(uId);
  const userStore : UserStore = getUserStoreFromId(uId);
  const userStats: UserStats = userStore.userStats;
  return { userStats: userStats };
}

// ////////////////////////////////////////////////////// //
//                      uploadImage                       //
// ////////////////////////////////////////////////////// //
/**
 * Sets an image with a given url as the profile image of the user
 *
 * @param { string, string, number, number, number, number} - image url, xStart, yStart, xEnd, yEnd
 * @returns {}
 */
export function userProfileUploadPhotoV1 (token: string, imgUrl: string, xStart: number, yStart: number, xEnd: number, yEnd: number) {
  isValidToken(token);
  if (xEnd <= xStart) {
    throw HTTPError('400', 'xEnd cannot be less than or equal to xStart');
  }
  if (yEnd <= yStart) {
    throw HTTPError('400', 'yEnd cannot be less than or equal to yStart');
  }
  imgUrl = 'let imgUrl value be read';
  /*
  const res = request(
    'GET',
    imgUrl
  );
  Jimp.read(imgUrl)
  .then(image => {
    return image
      .crop(xStart, yStart, xEnd, yEnd) // resize
  });
  */
  return {};
}
