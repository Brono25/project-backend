
import {
  DataStore,
  User,
  UsersAllReturn,
  WorkspaceStats,
} from './data.types';

import {
  isValidToken,
} from './other';

import {
  getData, setData,
} from './dataStore';

// ////////////////////////////////////////////////////// //
//                      usersAllv1                        //
// ////////////////////////////////////////////////////// //
/**
 * For a valid token, returns a list of all users and their associated details.
 *
 * @param {string} - the uId of the user and the user to view
 * @returns {users} - An array of all users
 */

export function usersAllv1(token: string): UsersAllReturn {
  isValidToken(token);

  const data: DataStore = getData();
  let userDetails: User;
  const usersList: User[] = [];
  for (const user of data.users) {
    userDetails = {
      uId: user.uId,
      email: user.email,
      nameFirst: user.nameFirst,
      nameLast: user.nameLast,
      handleStr: user.handleStr,
    };
    usersList.push(userDetails);
  }
  return { users: usersList };
}

// ////////////////////////////////////////////////////// //
//              usersStats (Workspace stats)              //
// ////////////////////////////////////////////////////// //
/**
 * Fetches the required statistics about users use of Beans
 *
 * @param {} - token and email to update for a user
 * @returns {{workspaceStats: WorkspaceStats} }
 */
export function usersStatsV1(token: string): {workspaceStats: WorkspaceStats} {
  isValidToken(token);
  const data: DataStore = getData();
  const numActiveUsers: number = getNumberOfUsersWhoBelongToAtleastOneChannelOrDm(data);
  const totalUsers: number = data.users.length;
  const workspaceStats: WorkspaceStats = data.workspaceStats;
  workspaceStats.utilizationRate = numActiveUsers / totalUsers;
  data.workspaceStats = workspaceStats;
  setData(data);
  return { workspaceStats: workspaceStats };
}

function getNumberOfUsersWhoBelongToAtleastOneChannelOrDm(data: DataStore) {
  const userCount = new Set();
  for (const channel of data.channels) {
    channel.allMembers.map(a => userCount.add(a.uId));
  }
  for (const dm of data.dms) {
    dm.allMembersId.map(a => userCount.add(a));
  }
  return userCount.size;
}
