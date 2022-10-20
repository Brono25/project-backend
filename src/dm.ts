
import {
  DataStore,
  DmCreateReturn, DmStore, UserStore,
} from './data.types';
import { getData, setData } from './dataStore';

import {
  isValidAuthUserId,
  getTokenOwnersUid,
  isActiveToken,
  generateDmId,
  generateDmName,
  getUserStoreFromId,
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
  const ownerId = getTokenOwnersUid(token);
  if (uIds.includes(ownerId)) {
    return { error: 'Dm creator can not include themselves' };
  }
  if (!isActiveToken(token)) {
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

  for (const uId of uIds) {
    const userStore: UserStore = getUserStoreFromId(uId);
    userStore.dmIdsIsMemberOf.push(dmId);
  }
  return { dmId: dmId };
}
