
import validator from 'validator';
import { setData, getData } from './dataStore';
import {
  generateToken,
  getUIdFromToken,
  getUserStoreFromId,
  isValidToken,
} from './other';
import {
  DataStore,
  UserStore,
  GlobalPermision,
  GLOBAL_OWNER,
  AuthUserId,
  Token,
  AuthLoginReturn,
  AuthRegistorReturn
} from './data.types';

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
  if (!isEmailUsed(email)) {
    return { error: 'Email does not belong to a user' };
  }

  if (!isPasswordCorrect(email, password)) {
    return { error: 'Password is incorrect' };
  }

  const data: DataStore = getData();
  for (const user of data.users) {
    if (email.toLowerCase() === user.email.toLowerCase()) {
      const token: Token = generateToken(email);
      user.activeTokens.push(token);
      data.activeTokens.push(token);
      return <AuthLoginReturn> { token: token.token, authUserId: user.uId };
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
  if (!validator.isEmail(email)) {
    return { error: 'Invalid Email' };
  }
  if (isEmailUsed(email)) {
    return { error: 'Email is already taken' };
  }
  const minPasswordLength = 6;
  if (password.length < minPasswordLength) {
    return { error: 'Passwords must at-least 6 characters' };
  }
  const maxNameLength = 50;
  const minNameLength = 1;
  if (nameFirst.length < minNameLength || nameFirst.length > maxNameLength) {
    return { error: 'First name must be between 1-50 characters long (inclusive)' };
  }
  if (nameLast.length < minNameLength || nameLast.length > maxNameLength) {
    return { error: 'Last name must be between 1-50 characters long (inclusive)' };
  }

  const handleStr: string = generateHandleStr(nameFirst, nameLast);
  const authUserId: AuthUserId = generateAuthUserId();

  let globalPermission: GlobalPermision = 'member';
  if (authUserId.authUserId === GLOBAL_OWNER) {
    globalPermission = 'owner';
  }
  const token: Token = generateToken(email);
  const userStore: UserStore = {
    uId: authUserId.authUserId,
    nameFirst: nameFirst,
    nameLast: nameLast,
    email: email,
    password: password,
    handleStr: handleStr,
    globalPermission: globalPermission,
    activeTokens: [],
  };

  const data: DataStore = getData();

  userStore.activeTokens.push(token);
  data.activeTokens.push(token);
  data.users.push(userStore);
  setData(data);

  return <AuthRegistorReturn> { token: token.token, authUserId: authUserId.authUserId };
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
  if (!isValidToken(token)) {
    return { error: 'token is invalid!' };
  }

  const data: DataStore = getData();
  const tokensList: Token[] = data.activeTokens;
  const newTokensList: Token[] = tokensList.filter(element => {
    return element.token !== token;
  });

  data.activeTokens = newTokensList;

  const uId: number = getUIdFromToken(token);
  const user: UserStore = getUserStoreFromId(uId);
  const index = data.users.indexOf(user);
  const tokensList1: Token[] = user.activeTokens;
  const newTokensList1: Token[] = tokensList1.filter(element => {
    return element.token !== token;
  });
  user.activeTokens = newTokensList1;
  data.users[index] = user;
  setData(data);
  return {};
}

// ------------------Auth Helper functions------------------

/**
 * @param {string} - users handle
 * @returns {boolean} - is handle unique
 */
function isHandleStrUnique(handleStr: string) {
  const data: DataStore = getData();

  if (!data.users.length) {
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
  const id: number = data.users.length;
  return { authUserId: id };
}

/**
 * @param {string} - users email
 * @returns {boolean} - is email already claimed by another user
 */
export function isEmailUsed(email: string) {
  const data: DataStore = getData();

  if (!data.users.length) {
    return false;
  }
  for (const user of data.users) {
    if (user.email.toLowerCase() === email.toLowerCase()) {
      return true;
    }
  }
  return false;
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
        return false;
      }
    }
  }
}

export {
  authLoginV1,
  authRegisterV1,
  AuthLogoutV1
};
