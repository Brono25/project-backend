
import {
  DmCreateReturn,
} from './data.types';

import {
  isValidAuthUserId,
  getTokenOwnersUid,
  isActiveToken,
  getHandleStrfromUid,
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
  const creatorId = getTokenOwnersUid(token);
  if (uIds.includes(creatorId)) {
    return { error: 'Dm creator can not include themselves' };
  }
  if (!isActiveToken(token)) {
    return { error: 'Invalid Token' };
  }
  uIds.unshift(creatorId);
  generateDmName(uIds);

  return { dmId: -1 };
}

/**
 * @param {number[]}
 * @returns {string}
 */
function generateDmName(uIds: number[]) {
  const handleStrList: string[] = [];
  for (const uId of uIds) {
    const handleStr = getHandleStrfromUid(uId);
    handleStrList.push(handleStr);
  }
  const name = handleStrList.sort(
    (a, b) => a.toLowerCase().localeCompare(b.toLowerCase())
  ).join(', ');
  return name;
}
