
import HTTPError from 'http-errors';

import {
  isValidAuthUserId,
  isValidPermId,
  getUserStoreFromId,
  isValidToken,
  isGlobalOwner,
  getUIdFromToken,
} from './other';

import {
  UserStore,
  DataStore,
  GOLBALOWNER,
  GLOBALMEMBER,
} from './data.types';

import {
  setData,
  getData,
} from './dataStore';

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
  console.log(uId);
  if (!isValidAuthUserId(uId)) {
    throw HTTPError(400, 'Invalid user id');
  }
  throw HTTPError(400, 'only global owner');
}
// ////////////////////////////////////////////////////// //
//                      adminUserPermChangeV1             //
// ////////////////////////////////////////////////////// //
/**
 * For a valid token, returns a list of all users and their associated details.
 *
 * @param {string, number, number}
 * @returns {{} | Error}
 */

export function adminUserPermChangeV1(token: string, uId: number, permissionId: number) {
  isValidToken(token);
  isValidAuthUserId(uId);
  isValidPermId(permissionId);

  const authUserID: number = getUIdFromToken(token);

  if (!isGlobalOwner(authUserID)) {
    throw HTTPError(403, 'the authorised user is not a global owner');
  }
 
  const userStore: UserStore = getUserStoreFromId(uId);
  const permission: number = userStore.globalPermission;

  if (permission === permissionId && permissionId === 1) {
    throw HTTPError(400, 'the user already has the permissions level');
  }

  if (isonlyGlobalOwner) {
    throw HTTPError(400, 'uId refers to a user who is the only global owner and they are being demoted to a user');
  }

  const data: DataStore = getData();
  const userIndex: number = data.users.findIndex(a => a.uId === uId);

  if (permissionId === 1) {
    data.users[userIndex].globalPermission = 1;
  } else {
    data.users[userIndex].globalPermission = 2;
  }

  setData(data);

  return {};
}

function isonlyGlobalOwner(uId: number) {
  const data: DataStore = getData();
  const users: UserStore[] = data.users;

  let ownerNumber = 0;

  for (const user of users) {
    if (user.globalPermission === 1) {
      ownerNumber++;
    }
  }

  if (ownerNumber === 1) {
    return true;
  } else {
    return false;
  }
}
