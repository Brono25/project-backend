import {
  DataStore,
  User,
  UserStore,
  Message,
  PageMessages,
  Error,
  PAGE_SIZE,
  NO_MORE_PAGES,
  DmStore,
  DmCreateReturn,
  dmDetailsReturn,
} from './data.types';

import {
  getData,
  setData,
} from './dataStore';

import {
  isValidAuthUserId,
  getUserStoreFromId,
  isValidToken,
  isValidDmId,
  getDmStore,
  isTokenMemberOfDm,
  generateDmName,
  generateDmId,
  getUIdFromToken
} from './other';

// ////////////////////////////////////////////////////// //
//                      dmCreateV1                        //
// ////////////////////////////////////////////////////// //
/**
 *
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
 * User with active token can get details of a DM they are a member of.
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
/**
 * Given a DM with ID dmId that the authorised user
 * is a member of, returns up to 50 messages between index "start" and "start + 50".
 * @param {number, number, number} - token, dmId, start
 * @returns {PageMessages | Error} - { messages, start, end }
 */

export function dmMessagesV1(
  token: string,
  dmId: number,
  start: number
): PageMessages | Error {
  if (!isValidDmId(dmId)) {
    return { error: 'Invalid dmId' };
  }
  const dmStore: DmStore = getDmStore(dmId);
  const messages: Message[] = dmStore.messages;
  const numMessages = messages.length;

  if (start > numMessages) {
    return { error: 'Messages start too high' };
  } else if (!isValidToken(token)) {
    return { error: 'Invalid Token' };
  } else if (!isTokenMemberOfDm(token, dmId)) {
    return { error: 'User is not a member of the dm' };
  } else if (start === numMessages) {
    return <PageMessages>{
      messages: [],
      start: start,
      end: NO_MORE_PAGES,
    };
  }

  let end = start + PAGE_SIZE;
  const page: Message[] = messages.slice(start, end);
  if (page.length < PAGE_SIZE) {
    end = NO_MORE_PAGES;
  }
  return <PageMessages>{
    messages: page,
    start: start,
    end: end,
  };
}
