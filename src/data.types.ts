
// ////////////////////////////////////////////////////// //
//                         I/O types                      //
// ////////////////////////////////////////////////////// //
/*
 * Accessing only data needed for functions.
 */
export const PAGE_SIZE = 50;
export const NO_MORE_PAGES = -1;
export const GLOBAL_OWNER = 0;
export const MAX_MSG_LEN = 1000;
export const MIN_MSG_LEN = 1;
export const LEAVE = 0;
export const JOIN = 1;
export type LeaveOrJoin = 1 | 0;

/* export type MessageId = { messageId: number }; */
export type Error = { error: string };
export type UserId = { uId: number };
export type DmId = { dmId: number };
export type MessageId = { messageId: number};
export type LeftOrJoined = 0 | 1;
export type MessageTracking = {
  messageId: number;
  dmId: number;
  channelId: number;
  uId:number;
};
export type User = {
  uId: number;
  email: string;
  nameFirst: string;
  nameLast: string;
  handleStr: string;
  profileImgUrl?: string;
}

export type Channel = {
  channelId: number;
  name: string;
}

export type React = {
  reactId: number,
  uIds: number[];
  isThisUserReacted: boolean;
}

export type Message = {
  messageId: number;
  uId: number;
  message: string;
  timeSent: number;
  reacts?: React[];
  isPinned?: boolean;
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
export type TokenHash = {
  hash: string;
  uId: number;
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
export type channelInviteReturn = object | Error;
export type PageMessages = {
  messages: Message[];
  start: number;
  end: number;
};

export type ChannelStat = {numChannelsJoined: number, timeStamp: number};
export type DmsStat = {numDmsJoined: number, timeStamp: number};
export type MessageStat = {numMessagesSent: number, timeStamp: number};
export type UserStats = {
  channelsJoined: ChannelStat[];
  dmsJoined: DmsStat[];
  messagesSent: MessageStat[];
  involvementRate: number;
}

export type NumChannelsExist = { numChannelsExist: number, timeStamp: number };
export type DmsExist = { numDmsExist: number, timeStamp: number };
export type MessagesExist = { numMessagesExist: number, timeStamp: number };
export type WorkspaceStats = {
    channelsExist: NumChannelsExist[],
    dmsExist: DmsExist[],
    messagesExist: MessagesExist[],
    utilizationRate: number;
}

export type MessageSendReturn = MessageId | Error;
export type ChannelJoinReturn = object | Error;
export type DmCreateReturn = { dmId: number } | Error;
export type ChannelLeaveReturn = object | Error;
export type ChanAddOwnerReturn = object | Error;
export type UsersAllReturn = { users: User[] } | Error;
export type dmDetailsReturn = { name: string, members: User[]} | Error;
export type ChanListReturn = Channel[] | Error;
export type userProfSetHandleReturn = object | Error;
export type dmLeaveReturn = object | Error;
export type dmListReturn = { dms: Dm[] } | Error;
export type dmRemoveReturn = object | Error;

// ////////////////////////////////////////////////////// //
//                       Data Storage                     //
// ////////////////////////////////////////////////////// //
/*
 * Where all data is stored.
 */
export const OWNER = 1;
export const MEMBER = 2;

export type GlobalPermision = 1 | 2;

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
  profileImgUrl?: string;
  userStats: UserStats;
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
  activeTokens: TokenHash[];
  messageIds: MessageTracking[];
  dms: DmStore[];
  workspaceStats: WorkspaceStats;
}

export const TOKEN_SECRET = 'xaThoo6xuagah9bahj9ooC1Aeng2aezai9Pei7zelahxoh5ak8oonoo3phifooR3';
