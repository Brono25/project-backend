
// ////////////////////////////////////////////////////// //
//                         I/O types                      //
// ////////////////////////////////////////////////////// //
/*
 * Accessing only data needed for functions.
 */
export const ID_ERROR = -1;
export const GLOBAL_OWNER = 0;
export const MAX_MSG_LEN = 1000;
export const MIN_MSG_LEN = 1;

export type MessageId = { messageId: number };
export type Error = { error: string };
export type UserId = { uId: number };
export type DmId = { dmId: number };

export type User = {
  uId: number;
  email: string;
  nameFirst: string;
  nameLast: string;
  handleStr: string;
}

export type Channel = {
  channelId: number;
  name: string;
}

export type Message = {
  messageId: number;
  uId: number;
  message: string;
  timeSent: number;
}

export type ChannelDetails = {
  name: string;
  isPublic: boolean;
  ownerMembers: User[];
  allMembers: User[];
}
export type Token = {
  token: string;
}

export type Dm = {
  dmId: number;
  name: string;
}

export type AuthUserId = { authUserId: number };
export type ChannelId = { channelId: number };
export type AuthLoginReturn = {
  token: string,
  authUserId: number
} | Error;
export type UserProfileReturn = { user: User} | Error;
export type AuthRegistorReturn = {token: string,
  authUserId: number
} | Error;
export type ChanCreateReturn = ChannelId | Error;
export type ChannelMessages = {
  messages: Message[];
  start: number;
  end: number;
};
export type MessageSendReturn = MessageId | Error;
export type DmCreateReturn = {dmId: number} | Error;
export type UsersAllReturn = { users: User[] } | Error;
export type dmDetailsReturn = { name: string, members: User[]} | Error;

// ////////////////////////////////////////////////////// //
//                       Data Storage                     //
// ////////////////////////////////////////////////////// //
/*
 * Where all data is stored.
 */

export type GlobalPermision = 'owner' | 'member';

export type ChannelStore = {
  channelId: number;
  name: string;
  isPublic: boolean;
  ownerMembers: UserId[];
  allMembers: UserId[];
  messages: Message[];
}

export type UserStore = {
  uId: number;
  nameFirst: string;
  nameLast: string;
  email: string;
  handleStr: string;
  globalPermission: GlobalPermision;
  password: string;
  activeTokens: Token[];
}
export type DmStore = {
  dmId: number;
  name: string;
  ownerId: number;
  messages: Message[];
  allMembersId: number[];
}
export type DataStore = {
  users: UserStore[];
  channels: ChannelStore[];
  activeTokens: Token[];
  messageIds: MessageId[];
  dms: DmStore[];
}
