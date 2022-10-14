
/**********************************************************
 * ------------------Input/Output Defines------------------
 **********************************************************/
/*
 * Accessing only data needed for functions.
 */

const GLOBAL_OWNER = 0;

type Error = { error: string };
type UserId = { uId: number };
type AuthUserId = { authUserId: number };
type ChannelId = { channelId: number };

type User = {
  uId: number;
  email: string;
  nameFirst: string;
  nameLast: string;
  handleStr: string;
}

type Channel = {
  channelId: number;
  name: string;
}

type Message = {
  messageId: number;
  uId: number;
  message: string;
  timeSent: number;
}

type ChannelDetails = {
  name: string;
  isPublic: boolean;
  ownerMembers: User[];
  allMembers: User[];
}

/**********************************************************
 * -------------------Data Storage Types-------------------
 **********************************************************/
/*
 * Where all data is stored.
 */

type GlobalPermision = 'owner' | 'member';

type ChannelStore = {
  channelId: number;
  name: string;
  isPublic: boolean;
  ownerMembers: UserId[];
  allMembers: UserId[];
  messages: Message[];
}

type UserStore = {
  uId: number;
  nameFirst: string;
  nameLast: string;
  email: string;
  handleStr: string;
  globalPermission: GlobalPermision;
  password: string;
}

type DataStore = {
  users: UserStore[];
  channels: ChannelStore[];
}

export {
  Error,
  UserId,
  AuthUserId,
  ChannelId,
  User,
  Channel,
  Message,
  ChannelDetails,
  GlobalPermision,
  ChannelStore,
  UserStore,
  DataStore,
  GLOBAL_OWNER,
};
