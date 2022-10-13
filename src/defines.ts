
type Member = {
  uId: number;
}
type Owner = {
  uId: number;
}
type Message = {
  messageId: number;
  uId: number;
  message: string;
  timeSent: number;
}

type Channel = {
  channelId: number;
  name: string;
  isPublic: boolean;
  ownerMembers: Owner[];
  allMembers: Member[];
  messages: Message[];
}

type User = {
  uId: number;
  nameFirst: string;
  nameLast: string;
  email: string;
  handleStr: string;
  globalPermission: 'owner' | 'member';
}

type Data = {
  users: User[];
  channels: Channel[];
}

export {
  Member,
  Owner,
  Message,
  Channel,
  User,
  Data
};
