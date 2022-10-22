
import {
  DataStore,
  DmCreateReturn,
  dmDetailsReturn,
  DmStore,
  User,
  UserStore,
  PageMessages,
} from './data.types';
import {
  getData,
  setData,
} from './dataStore';

import {
  isValidAuthUserId,
  getUIdFromToken,
  isValidToken,
  generateDmId,
  generateDmName,
  isValidDmId,
  isTokenMemberOfDm,
  getDmStore,
  getUserStoreFromId,
} from './other';

// ////////////////////////////////////////////////////// //
//                      dmCreateV1                        //
// ////////////////////////////////////////////////////// //
/**
 * Creat
 * @param {string, number[]}
 * @returns {number}
 */
export function dmCreateV1(token: string, uIds: number[]): DmCreateReturn {
  if (uIds.find(a => isValidAuthUserId(a) === false)) {
    return { error: 'Invalid User ID' };
  }
  const numUniqueIds: number = new Set(uIds).size;
  if (numUniqueIds !== uIds.length) {
    return { error: 'Duplicate uId' };
  }
  const ownerId = getUIdFromToken(token);
  if (uIds.includes(ownerId)) {
    return { error: 'Dm creator can not include themselves' };
  }
  if (!isValidToken(token)) {
    return { error: 'Invalid Token' };
  }
  uIds.unshift(ownerId);

  const dmId: number = generateDmId();
  const dmStore: DmStore = {
    dmId: dmId,
    name: generateDmName(uIds),
    ownerId: ownerId,
    messages: [],
    allMembersId: uIds,
  };

  const data: DataStore = getData();
  data.dms.push(dmStore);
  setData(data);
  return { dmId: dmId };
}

// ////////////////////////////////////////////////////// //
//                      dmDetails                         //
// ////////////////////////////////////////////////////// //
/**
 *
 * @param {string, number[]}
 * @returns {number}
 */
export function dmDetailsv1(token: string, dmId: number): dmDetailsReturn {
  if (!isValidDmId(dmId)) {
    return { error: 'Invalid dmId' };
  }
  if (!isValidToken(token)) {
    return { error: 'Invalid token' };
  }
  if (!isTokenMemberOfDm(token, dmId)) {
    return { error: 'Token owner is not a member of the dm' };
  }

  const dmDetails: DmStore = getDmStore(dmId);
  const userList: User[] = [];
  let userDetails: UserStore;
  let user: User;
  for (const uId of dmDetails.allMembersId) {
    userDetails = getUserStoreFromId(uId);
    user = {
      uId: uId,
      email: userDetails.email,
      nameFirst: userDetails.nameFirst,
      nameLast: userDetails.nameLast,
      handleStr: userDetails.handleStr,
    };
    userList.push(user);
  }
  return {
    name: dmDetails.name,
    members: userList,
  };
}

// ////////////////////////////////////////////////////// //
//                      dmMessages                        //
// ////////////////////////////////////////////////////// //
export function dmMessagesV1(
  token: string, dmId: number, start: number
): PageMessages | Error {
  return <PageMessages> {};
}
