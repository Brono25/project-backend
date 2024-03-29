import HTTPError from 'http-errors';
import {
  DataStore,
  User,
  UserStore,
  Message,
  PageMessages,
  Error,
  PAGE_SIZE,
  NO_MORE_PAGES,
  Dm,
  DmStore,
  DmCreateReturn,
  dmListReturn,
  dmDetailsReturn,
  dmLeaveReturn,
  dmRemoveReturn,
  LEAVE,
  JOIN
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
  getUIdFromToken,
  doesTokenHaveDmOwnerPermissions,
  updateUserDmsJoinedStat,
  updateNumDmsExistStat,
  updateNumMessagesExistStat,
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
  isValidToken(token);
  uIds.map(a => isValidAuthUserId(a));

  const numUniqueIds: number = new Set(uIds).size;
  if (numUniqueIds !== uIds.length) {
    throw HTTPError(400, 'Duplicate uId');
  }
  const ownerId = getUIdFromToken(token);
  if (uIds.includes(ownerId)) {
    throw HTTPError(400, 'Dm creator can not include themselves');
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

  // Analytics
  const index: number = data.dms.findIndex(a => a.dmId === dmId);
  for (const uId of data.dms[index].allMembersId) {
    updateUserDmsJoinedStat(uId, JOIN);
  }
  updateNumDmsExistStat();

  return { dmId: dmId };
}

// ////////////////////////////////////////////////////// //
//                      dmListV1                         //
// ////////////////////////////////////////////////////// //
/**
 * Shows a list of all the dms that the user is a member of (if the given token is valid).
 * @param {string} - token
 * @returns {array} - dms[{dmId: , name: }]
 */
export function dmListV1(token: string): dmListReturn {
  isValidToken(token);
  const uId: number = getUIdFromToken(token);
  const data: DataStore = getData();
  const dms: Dm[] = [];
  for (const dm of data.dms) {
    if (dm.allMembersId.includes(uId)) {
      dms.push({ dmId: dm.dmId, name: dm.name });
    }
  }
  return { dms: dms };
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
  isValidToken(token);
  isValidDmId(dmId);

  if (!isTokenMemberOfDm(token, dmId)) {
    throw HTTPError(403, 'Token owner is not a member of the dm');
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
//                      dmLeave                           //
// ////////////////////////////////////////////////////// //
/**
 *
 * @param {string, number[]}
 * @returns {number}
 */
export function dmLeavev1(token: string, dmId: number): dmLeaveReturn {
  isValidToken(token);
  isValidDmId(dmId);
  if (!isTokenMemberOfDm(token, dmId)) {
    throw HTTPError(403, 'Token owner is not a member of the dm');
  }

  const uId: number = getUIdFromToken(token);
  const dmDetails: DmStore = getDmStore(dmId);
  let membersArr: number[] = dmDetails.allMembersId;
  membersArr = membersArr.filter((element) => {
    return element !== uId;
  });
  dmDetails.allMembersId = membersArr;
  const data: DataStore = getData();
  const index: number = data.dms.findIndex(a => a.dmId === dmId);
  data.dms[index] = dmDetails;
  setData(data);
  updateUserDmsJoinedStat(uId, LEAVE);
  return {};
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
  isValidToken(token);
  isValidDmId(dmId);
  const dmStore: DmStore = getDmStore(dmId);
  const messages: Message[] = dmStore.messages;
  const numMessages = messages.length;

  if (start > numMessages) {
    throw HTTPError(400, 'Messages start too high');
  } else if (!isTokenMemberOfDm(token, dmId)) {
    throw HTTPError(403, 'User is not a member of the dm');
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

// ////////////////////////////////////////////////////// //
//                      dmRemove                          //
// ////////////////////////////////////////////////////// //
/**
 *
 * @param {string, number}
 * @returns {number}
 */

export function dmRemoveV1 (token: string, dmId: number): dmRemoveReturn {
  isValidToken(token);
  isValidDmId(dmId);

  if (!doesTokenHaveDmOwnerPermissions(token, dmId)) {
    throw HTTPError(403, 'Token is not the owner');
  }
  if (!isTokenMemberOfDm(token, dmId)) {
    throw HTTPError(403, 'Token is not a member');
  }
  let data: DataStore = getData();
  const index: number = data.dms.findIndex(a => a.dmId === dmId);
  // Update analytics
  for (const uId of data.dms[index].allMembersId) {
    updateUserDmsJoinedStat(uId, LEAVE);
  }
  removeDmMessages(dmId);
  // make sure dm is removed after analytics is updated
  data = getData();
  data.dms.splice(index, 1);
  setData(data);
  updateNumDmsExistStat();
  return {};
}

function removeDmMessages(dmId: number) {
  let data: DataStore = getData();
  const index: number = data.dms.findIndex(a => a.dmId === dmId);
  const dmStore: DmStore = data.dms[index];

  for (const message of dmStore.messages) {
    const index = data.messageIds.findIndex(a => a.messageId === message.messageId);
    data.messageIds.splice(index, 1);
    setData(data);
    updateNumMessagesExistStat();
    data = getData();
  }
}
