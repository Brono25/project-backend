
import {
  DmCreateReturn,
} from './data.types';

import {
  isValidAuthUserId,
  getTokenOwnersUid,
  isActiveToken,
} from './other';

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

  return { dmId: -1 };
}
