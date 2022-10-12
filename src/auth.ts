
import validator from 'validator';
import {
  setData,
  getData,
} from './dataStore';

// ------------------Auth Helper functions------------------

/**
 * @param {string} - users handle
 * @returns {boolean} - is handle unique
 */
function isHandleStrUnique(handleStr) {
  const data = getData();

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
 */
function generateHandleStr(nameFirst, nameLast) {
  const filteredFirstName = nameFirst.match(/[a-z0-9]+/ig).join('').toLowerCase();
  const filteredLastName = nameLast.match(/[a-z0-9]+/ig).join('').toLowerCase();
  let handleStr = filteredFirstName.concat(filteredLastName);

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
function generateAuthUserId() {
  const data = getData();
  const id = data.users.length;
  return id;
}

/**
 * @param {string} - users email
 * @returns {boolean} - is email already claimed by another user
 */
function isEmailUsed(email) {
  const data = getData();

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
function isPasswordCorrect(email, password) {
  const data = getData();
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

// ------------------Auth Main functions------------------

/**
 * Given a registered user's email and password, returns their authUserId value.
 *
 * @param {string, string} - users and password
 * @returns {number} - authUserId
 */
function authLoginV1(email, password) {
  if (isEmailUsed(email) === false) {
    return { error: 'Email does not belong to a user' };
  }

  if (isPasswordCorrect(email, password) === false) {
    return { error: 'Password is incorrect' };
  }

  const data = getData();
  for (const user of data.users) {
    if (email.toLowerCase() === user.email.toLowerCase()) {
      return {
        authUserId: user.uId,
      };
    }
  }
  return {};
}

/**
 * Adds a new user to the dataStore.
 *
 * @param {string, string, string, string} - user information to store
 * @returns {number} - unique user id
 */

function authRegisterV1(email, password, nameFirst, nameLast) {
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

  const handleStr = generateHandleStr(nameFirst, nameLast);
  const authUserId = generateAuthUserId();

  let globalPermission = 'member';
  if (authUserId === 0) {
    globalPermission = 'owner';
  }

  const userDetails = {
    uId: authUserId,
    nameFirst: nameFirst,
    nameLast: nameLast,
    email: email,
    password: password,
    handleStr: handleStr,
    globalPermission: globalPermission,
  };

  const data = getData();
  data.users.push(userDetails);
  setData(data);

  return { authUserId: authUserId };
}

export {
  authLoginV1,
  authRegisterV1,
};