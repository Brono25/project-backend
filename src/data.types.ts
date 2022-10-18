
/**********************************************************
 * ------------------Input/Output Defines------------------
 **********************************************************/
/*
 * Accessing only data needed for functions.
 */

export const GLOBAL_OWNER = 0;

type MessageId = { messageId: number };
export type Error = { error: string };
export type UserId = { uId: number };

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

export type Uids = {
  uIds: UserId[];
}
export type AuthUserId = { authUserId: number };
export type ChannelId = { channelId: number };
export type AuthLoginReturn = {token: string, authUserId: number} | Error;
export type AuthRegistorReturn = {token: string, authUserId: number}| Error;
export type UserProfileReturn = { user: User } | Error;
/**********************************************************
 * -------------------Data Storage Types-------------------
 **********************************************************/
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

export type DataStore = {
  users: UserStore[];
  channels: ChannelStore[];
  activeTokens: Token[];
  messageIds: MessageId[];
}
