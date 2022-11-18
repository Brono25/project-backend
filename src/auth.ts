
import HTTPError from 'http-errors';
import {
  setData,
  getData
} from './dataStore';

import {
  generateToken,
  isValidToken,
  generateTokenHash,
  isValidEmail,
  isEmailUsed,
  isEmailFound,
  getTimeInSecs,
} from './other';

import {
  DataStore,
  UserStore,
  GlobalPermision,
  GLOBAL_OWNER,
  AuthUserId,
  AuthLoginReturn,
  AuthRegistorReturn,
  TokenHash,
} from './data.types';

import { initialiseBeans } from './dataStore';

// ////////////////////////////////////////////////////// //
//                        AuthLoginV1                     //
// ////////////////////////////////////////////////////// //
/**
 * Given a registered user's email and password, returns their authUserId value.
 *
 * @param {string, string} - users and password
 * @returns {AuthLoginReturn} - authUserId
 */
function authLoginV1(email: string, password: string): AuthLoginReturn {
  isValidEmail(email);
  isEmailFound(email);
  isPasswordCorrect(email, password);

  const data: DataStore = getData();
  for (const user of data.users) {
    if (email.toLowerCase() === user.email.toLowerCase()) {
      const token: string = generateToken(email);
      const tokenHash: TokenHash = { uId: user.uId, hash: generateTokenHash(token) };
      data.activeTokens.push(tokenHash);
      setData(data);
      return <AuthLoginReturn> { token: token, authUserId: user.uId };
    }
  }
}

// ////////////////////////////////////////////////////// //
//                     AuthRegisterV1                     //
// ////////////////////////////////////////////////////// //
/**
 * Adds a new user to the dataStore.
 *
 * @param {string, string, string, string} - user information to store
 * @returns {AuthRegistorReturn} - unique user id
 */

function authRegisterV1(
  email: string,
  password: string,
  nameFirst: string,
  nameLast: string
): AuthRegistorReturn {
  isValidEmail(email);
  isEmailUsed(email);

  const minPasswordLength = 6;
  if (password.length < minPasswordLength) {
    throw HTTPError(400, 'Passwords must at-least 6 characters');
  }
  const maxNameLength = 50;
  const minNameLength = 1;
  if (nameFirst.length < minNameLength || nameFirst.length > maxNameLength) {
    throw HTTPError(400, 'First name must be between 1-50 characters long (inclusive)');
  }
  if (nameLast.length < minNameLength || nameLast.length > maxNameLength) {
    throw HTTPError(400, 'Last name must be between 1-50 characters long (inclusive)');
  }

  const handleStr: string = generateHandleStr(nameFirst, nameLast);
  const authUserId: AuthUserId = generateAuthUserId();

  let globalPermission: GlobalPermision = 2;
  if (authUserId.authUserId === GLOBAL_OWNER) {
    globalPermission = 1;
  }
  const timeStamp: number = getTimeInSecs();
  const token: string = generateToken(email);
  const tokenHash: TokenHash = { uId: authUserId.authUserId, hash: generateTokenHash(token) };
  const userStore: UserStore = {
    uId: authUserId.authUserId,
    nameFirst: nameFirst,
    nameLast: nameLast,
    email: email,
    password: password,
    handleStr: handleStr,
    globalPermission: globalPermission,
    userStats: {
      channelsJoined: [{ numChannelsJoined: 0, timeStamp: timeStamp }],
      dmsJoined: [{ numDmsJoined: 0, timeStamp: timeStamp }],
      messagesSent: [{ numMessagesSent: 0, timeStamp: timeStamp }],
      involvementRate: 0,
    }
  };

  let data: DataStore = getData();
  if (data === null) {
    initialiseBeans(timeStamp);
    data = getData();
  }

  data.activeTokens.push(tokenHash);
  data.users.push(userStore);
  setData(data);

  return <AuthRegistorReturn> { token: token, authUserId: authUserId.authUserId };
}

// ////////////////////////////////////////////////////// //
//                     AuthLogoutv1                     //
// ////////////////////////////////////////////////////// //
/**
 * Logouts a user by invalidating their token
 *
 * @param {string} - token
 * @returns {}
 */

function AuthLogoutV1(token: string): any {
  isValidToken(token);
  const data: DataStore = getData();
  const hash = generateTokenHash(token);
  const index = data.activeTokens.findIndex(a => a.hash === hash);
  data.activeTokens.splice(index, 1);
  setData(data);
  return {};
}

// ------------------Auth Helper functions------------------

/**
 * @param {string} - users handle
 * @returns {boolean} - is handle unique
 */
export function isHandleStrUnique(handleStr: string) {
  const data: DataStore = getData();

  if (data === null || !data.users.length) {
    return true;
  }
  for (const user of data.users) {
    if (user.handleStr === handleStr) {
      return false;
    }
  }
  return true;
}

/**
 * Generate a unique handle for a new user based off their
 * first and last names.
 *
 * @param {string, string} - firstName, lastName
 * @returns {string} - always returns a unique handle string
 *
 */
function generateHandleStr(nameFirst: string, nameLast: string) {
  const filteredFirstName: string = nameFirst.match(/[a-z0-9]+/ig).join('').toLowerCase();
  const filteredLastName: string = nameLast.match(/[a-z0-9]+/ig).join('').toLowerCase();
  let handleStr: string = filteredFirstName.concat(filteredLastName);

  const maxChars = 20;
  if (handleStr.length > maxChars) {
    handleStr = handleStr.substring(0, maxChars);
  }

  if (!isHandleStrUnique(handleStr)) {
    let n = 0;
    while (!isHandleStrUnique(handleStr + n)) {
      n++;
    }
    handleStr = handleStr + n;
  }
  return handleStr;
}

/**
 * The user ID is the same as their index in the
 * data.user array. This is to make fetching user details
 * from their user ID easy and ensures unique ID's.
 *
 * @param {}
 * @returns {number} - unique user id
 */
function generateAuthUserId(): AuthUserId {
  const data: DataStore = getData();
  let numUsers = 0;
  if (data !== null) {
    numUsers = data.users.length;
  }
  const id: number = numUsers;
  return { authUserId: id };
}

/**
 * @param {string, string} - users email and password
 * @returns {number} - users id
 */
function isPasswordCorrect(email: string, password: string) {
  const data: DataStore = getData();

  for (const user of data.users) {
    if (email.toLowerCase() === user.email.toLowerCase()) {
      if (password === user.password) {
        return true;
      } else {
        throw HTTPError(400, 'Password is incorrect');
      }
    }
  }
}

export {
  authLoginV1,
  authRegisterV1,
  AuthLogoutV1
};
