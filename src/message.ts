import HTTPError from 'http-errors';
import {
  MessageId,
  Message,
  DataStore,
  MAX_MSG_LEN,
  MIN_MSG_LEN,
  Error,
  ChannelStore,
  MessageTracking,
  DmStore,
  React
} from './data.types';

import {
  isValidChannelId,
  isValidToken,
  isTokenMemberOfChannel,
  generateMessageId,
  getUIdFromToken,
  getTimeInSecs,
  isValidDmId,
  isTokenMemberOfDm,
  getMessageLocation,
  getChannelStoreFromId,
  doesTokenHaveChanOwnerPermissions,
  doesTokenHaveDmOwnerPermissions,
  getDmStore,
  isValidMessageId,
  updateUserMessagesSentStat,
  updateNumMessagesExistStat,
  isValidReactId,
  isThisUserReacted,
  getMessageStoreFromChannel,
  getMessageStoreFromDm,
} from './other';

import { getData, setData } from './dataStore';

// ////////////////////////////////////////////////////// //
//                     messageSendV1                      //
// ////////////////////////////////////////////////////// //
/**
 * User as part of a channel can send a message.
 * @param {string, number, string}
 * @returns { MessageId | Error}
 */
export function messageSendV1(
  token: string,
  channelId: number,
  message: string) {
  isValidToken(token);
  isValidChannelId(channelId);

  if (message.length < MIN_MSG_LEN || message.length > MAX_MSG_LEN) {
    throw HTTPError(400, 'Invalid message');
  }
  if (!isTokenMemberOfChannel(token, channelId)) {
    throw HTTPError(403, 'User is not a member');
  }
  const messageId: number = generateMessageId();
  const uId: number = getUIdFromToken(token);
  const messageLoc: MessageTracking = {
    messageId: messageId,
    channelId: channelId,
    dmId: null,
    uId: uId
  };
  const messageDetails: Message = {
    messageId: messageLoc.messageId,
    uId: uId,
    message: message,
    timeSent: getTimeInSecs(),
  };
  const data: DataStore = getData();
  const index = data.channels.findIndex(a => a.channelId === channelId);
  data.channels[index].messages.unshift(messageDetails);
  data.messageIds.unshift(messageLoc);
  setData(data);
  updateUserMessagesSentStat(uId);
  updateNumMessagesExistStat();
  return <MessageId>{ messageId: messageId };
}

// ////////////////////////////////////////////////////// //
//                    messageSendDmV1                     //
// ////////////////////////////////////////////////////// //
/**
 * User as part of a DM can send a message.
 * @param {string, number, string}
 * @returns { MessageId | Error}
 */
export function messageSendDmV1(
  token: string, dmId: number, message: string
) {
  isValidToken(token);
  isValidDmId(dmId);

  if (message.length < MIN_MSG_LEN || message.length > MAX_MSG_LEN) {
    throw HTTPError(400, 'Invalid message length');
  }
  if (!isTokenMemberOfDm(token, dmId)) {
    throw HTTPError(403, 'User not a member');
  }
  const messageId: number = generateMessageId();
  const uId: number = getUIdFromToken(token);
  const messageLoc: MessageTracking = {
    messageId: messageId,
    channelId: null,
    dmId: dmId,
    uId: uId
  };
  const messageDetails: Message = {
    messageId: messageId,
    uId: uId,
    message: message,
    timeSent: getTimeInSecs(),
  };
  const data: DataStore = getData();
  const index = data.dms.findIndex(a => a.dmId === dmId);
  data.dms[index].messages.unshift(messageDetails);
  data.messageIds.unshift(messageLoc);
  setData(data);
  updateUserMessagesSentStat(uId);
  updateNumMessagesExistStat();
  return <MessageId>{ messageId: messageId };
}

// ////////////////////////////////////////////////////// //
//                      messageRemove                     //
// ////////////////////////////////////////////////////// //
/**
 * User as part of a DM can send a message.
 * @param {string, number}
 * @returns { object | Error}
 */
export function messageRemoveV1(token: string, messageId: number): object | Error {
  isValidToken(token);
  const messageLoc: MessageTracking = getMessageLocation(messageId);
  if (messageLoc === null) {
    throw HTTPError(400, 'Invalid message id');
  }
  if (messageLoc.channelId !== null) {
    const channelId: number = messageLoc.channelId;
    removeChannelMessage(token, channelId, messageId, messageLoc.uId);
  }

  if (messageLoc.dmId !== null) {
    const dmId: number = messageLoc.dmId;
    removeDmMessage(token, dmId, messageId, messageLoc.uId);
  }
  updateNumMessagesExistStat();
  return {};
}

/**
 * @param {string, number, number, number}
 * @returns { object | Error}
 */
function removeChannelMessage(token: string, channelId: number, messageId: number, uId: number) {
  if (!isTokenMemberOfChannel(token, channelId)) {
    throw HTTPError(403, 'User doesnt have permission');
  }
  const isUsersOwnMessage = <boolean> (getUIdFromToken(token) === uId);
  if (!doesTokenHaveChanOwnerPermissions(token, channelId) && !isUsersOwnMessage) {
    throw HTTPError(403, 'User doesnt have permission');
  }
  const data: DataStore = getData();
  const channelStore: ChannelStore = getChannelStoreFromId(channelId);
  let index: number = channelStore.messages.findIndex(a => a.messageId === messageId);
  channelStore.messages.splice(index, 1);
  index = data.channels.findIndex(a => a.channelId === channelId);
  data.channels[index] = channelStore;
  index = data.messageIds.findIndex(a => a.messageId === messageId);
  data.messageIds.splice(index, 1);
  setData(data);
}

/**
 * @param {string, number, number, number}
 * @returns { object | Error}
 */
function removeDmMessage(token: string, dmId: number, messageId: number, uId: number) {
  if (!isTokenMemberOfDm(token, dmId)) {
    throw HTTPError(403, 'User doesnt have permission');
  }
  const isUsersOwnMessage = <boolean> (getUIdFromToken(token) === uId);
  if (!doesTokenHaveDmOwnerPermissions(token, dmId) && !isUsersOwnMessage) {
    throw HTTPError(403, 'User doesnt have permission');
  }
  const data: DataStore = getData();
  const dmStore: DmStore = getDmStore(dmId);
  let index: number = dmStore.messages.findIndex(a => a.messageId === messageId);
  dmStore.messages.splice(index, 1);
  index = data.dms.findIndex(a => a.dmId === dmId);
  data.dms[index] = dmStore;
  index = data.messageIds.findIndex(a => a.messageId === messageId);
  data.messageIds.splice(index, 1);
  setData(data);
}

// ////////////////////////////////////////////////////// //
//                        messageEdit                     //
// ////////////////////////////////////////////////////// //
/**
 * User as part of a DM can send a message.
 * @param {string, number, string}
 * @returns { object | Error}
 */
export function messageEditV1(token: string, messageId: number, message: string): object | Error {
  isValidToken(token);
  isValidMessageId(messageId);
  const MAX_MSG_LEN = 1000;
  if (message.length > MAX_MSG_LEN) {
    throw HTTPError(400, 'Invalid message');
  }
  const messageLoc: MessageTracking = getMessageLocation(messageId);
  const channelId: number = messageLoc.channelId;
  const dmId: number = messageLoc.dmId;
  if (channelId !== null) {
    editChannelMessage(token, messageId, message, channelId);
  }
  if (messageLoc.dmId !== null) {
    editDmMessage(token, messageId, message, dmId);
  }
  return {};
}

/**
 * Edit channel messages
 * @param {string, number, string, number}
 */

function editChannelMessage(token: string, messageId: number, message: string, channelId: number) {
  if (!isTokenMemberOfChannel(token, channelId)) {
    throw HTTPError(403, 'Not a channel memeber');
  }
  if (!doesTokenHaveChanOwnerPermissions(token, channelId)) {
    throw HTTPError(403, 'Dont have channel owner permissions');
  }
  const channelStore: ChannelStore = getChannelStoreFromId(channelId);
  let index: number = channelStore.messages.findIndex(a => a.messageId === messageId);
  const messageStore: Message = channelStore.messages[index];
  const data: DataStore = getData();
  messageStore.message = message;
  if (message === '') {
    channelStore.messages.splice(index, 1);
    data.messageIds.splice(index, 1);
  }
  index = data.channels.findIndex(a => a.channelId === channelId);
  data.channels[index] = channelStore;
  index = data.messageIds.findIndex(a => a.messageId === messageId);
  setData(data);
}
/**
 * edit dm messages
 * @param {string, number, string, number}
 */

function editDmMessage(token: string, messageId: number, message: string, dmId: number) {
  if (!isTokenMemberOfDm(token, dmId)) {
    throw HTTPError(403, 'Not a dm memeber');
  }
  if (!doesTokenHaveDmOwnerPermissions(token, dmId)) {
    throw HTTPError(403, 'Dont have dm owner permissions');
  }
  const dmStore: DmStore = getDmStore(dmId);
  let index: number = dmStore.messages.findIndex(a => a.messageId === messageId);
  const messageStore: Message = dmStore.messages[index];
  const data: DataStore = getData();
  messageStore.message = message;
  if (message === '') {
    dmStore.messages.splice(index, 1);
    data.messageIds.splice(index, 1);
  }
  index = data.dms.findIndex(a => a.dmId === dmId);
  data.dms[index] = dmStore;
  index = data.messageIds.findIndex(a => a.messageId === messageId);
  setData(data);
}

// ////////////////////////////////////////////////////// //
//                      messageReact                      //
// ////////////////////////////////////////////////////// //
/**
 * Given a message within a channel or DM the authorised user is part of, adds a "react" to that particular message.
 * @param {number, number}
 * @returns { {} | Error}
 */
export function messageReactV1(token: string, messageId: number, reactId: number) {
  isValidToken(token);
  isValidMessageId(messageId);
  isValidReactId(reactId);
  const messageLoc: MessageTracking = getMessageLocation(messageId);
  const channelId: number = messageLoc.channelId;
  const dmId: number = messageLoc.dmId;
  if (channelId !== null) {
    reactChannelMessage(token, messageId, reactId, channelId);
  }
  if (messageLoc.dmId !== null) {
    reactDmMessage(token, messageId, reactId, dmId);
  }
  return {};
}

function reactChannelMessage(token: string, messageId: number, reactId: number, channelId: number) {
  if (!isTokenMemberOfChannel(token, channelId)) {
    throw HTTPError(400, 'Not a channel memeber');
  }

  const channelStore: ChannelStore = getChannelStoreFromId(channelId);
  const indexOfMessage: number = channelStore.messages.findIndex(a => a.messageId === messageId);
  const messageStore: Message = channelStore.messages[indexOfMessage];
  const data: DataStore = getData();
  const react: React = {
    reactId: reactId,
    uIds: [],
    isThisUserReacted: null,
  };

  if (messageStore.reacts === undefined || messageStore.reacts === null) {
    messageStore.reacts = [];
    messageStore.reacts.push(react);
  }

  if (isThisUserReacted(messageStore, reactId, token)) {
    throw HTTPError(400, 'the message already contains a react from the authorised user');
  }
  const indexOfReact = messageStore.reacts.findIndex(a => a.reactId === reactId);
  messageStore.reacts[indexOfReact].uIds.push(getUIdFromToken(token));
  messageStore.reacts[indexOfReact].isThisUserReacted = true;
  const indexOfChannel = data.channels.findIndex(a => a.channelId === channelId);
  data.channels[indexOfChannel].messages[indexOfMessage] = messageStore;
  setData(data);
}

function reactDmMessage(token: string, messageId: number, reactId: number, dmId: number) {
  if (!isTokenMemberOfDm(token, dmId)) {
    throw HTTPError(400, 'Not a dm memeber');
  }
  const dmStore: DmStore = getDmStore(dmId);
  const indexOfMessage: number = dmStore.messages.findIndex(a => a.messageId === messageId);
  const messageStore: Message = dmStore.messages[indexOfMessage];
  const data: DataStore = getData();
  const react: React = {
    reactId: reactId,
    uIds: [],
    isThisUserReacted: null,
  };

  if (messageStore.reacts === undefined || messageStore.reacts === null) {
    messageStore.reacts = [];
    messageStore.reacts.push(react);
  }

  if (isThisUserReacted(messageStore, reactId, token)) {
    throw HTTPError(400, 'the message already contains a react from the authorised user');
  }
  const indexOfReact = messageStore.reacts.findIndex(a => a.reactId === reactId);
  messageStore.reacts[indexOfReact].uIds.push(getUIdFromToken(token));
  messageStore.reacts[indexOfReact].isThisUserReacted = true;
  const indexOfDm = data.dms.findIndex(a => a.dmId === dmId);
  data.dms[indexOfDm].messages[indexOfMessage] = messageStore;
  setData(data);
}

// ////////////////////////////////////////////////////// //
//                      messageUnreact                    //
// ////////////////////////////////////////////////////// //
/**
 * Given a message within a channel or DM the authorised user is part of, removes a "react" to that particular message.
 * @param {string, number, number}
 * @returns { {} | Error}
 */

export function messageUnreactV1(token: string, messageId: number, reactId: number) {
  isValidToken(token);
  isValidMessageId(messageId);
  isValidReactId(reactId);
  const messageLoc: MessageTracking = getMessageLocation(messageId);
  const channelId: number = messageLoc.channelId;
  const dmId: number = messageLoc.dmId;
  if (channelId !== null) {
    unreactChannelMessage(token, messageId, reactId, channelId);
  }
  if (messageLoc.dmId !== null) {
    unreactDmMessage(token, messageId, reactId, dmId);
  }
  return {};
}

function unreactChannelMessage(token: string, messageId: number, reactId: number, channelId: number) {
  if (!isTokenMemberOfChannel(token, channelId)) {
    throw HTTPError(400, 'Not a channel memeber');
  }
  const uId = getUIdFromToken(token);
  const channelStore: ChannelStore = getChannelStoreFromId(channelId);
  const indexOfMessage: number = channelStore.messages.findIndex(a => a.messageId === messageId);
  const messageStore: Message = channelStore.messages[indexOfMessage];
  const indexOfReact = messageStore.reacts.findIndex(a => a.reactId === reactId);
  const data: DataStore = getData();

  if (!isThisUserReacted(messageStore, reactId, token)) {
    throw HTTPError(400, 'The authorised user has not reacted to this message with this reactId');
  }
  const indexOfUser = messageStore.reacts[indexOfReact].uIds.findIndex(a => a === uId);
  messageStore.reacts[indexOfReact].uIds.splice(indexOfUser, 1);

  const indexOfChannel = data.channels.findIndex(a => a.channelId === channelId);
  data.channels[indexOfChannel].messages[indexOfMessage] = messageStore;
  messageStore.reacts[indexOfReact].isThisUserReacted = false;
  setData(data);
}
function unreactDmMessage(token: string, messageId: number, reactId: number, dmId: number) {
  if (!isTokenMemberOfDm(token, dmId)) {
    throw HTTPError(400, 'Not a dm memeber');
  }
  const uId = getUIdFromToken(token);
  const dmStore: DmStore = getDmStore(dmId);
  const indexOfMessage: number = dmStore.messages.findIndex(a => a.messageId === messageId);
  const messageStore: Message = dmStore.messages[indexOfMessage];
  const indexOfReact = messageStore.reacts.findIndex(a => a.reactId === reactId);
  const data: DataStore = getData();

  if (!isThisUserReacted(messageStore, reactId, token)) {
    throw HTTPError(400, 'The authorised user has not reacted to this message with this reactId');
  }
  const indexOfUser = messageStore.reacts[indexOfReact].uIds.findIndex(a => a === uId);
  messageStore.reacts[indexOfReact].uIds.splice(indexOfUser, 1);
  messageStore.reacts[indexOfReact].isThisUserReacted = false;
  const indexOfDm = data.dms.findIndex(a => a.dmId === dmId);
  data.dms[indexOfDm].messages[indexOfMessage] = messageStore;
  setData(data);
}
// ////////////////////////////////////////////////////// //
//                      messagePin                        //
// ////////////////////////////////////////////////////// //
/**
 * Pins a given message within a channel or DM the authorised user is part of
 * @param {string, number}
 * @returns { {} | Error}
 */
export function messagePinV1(token: string, messageId: number) {
  isValidToken(token);
  isValidMessageId(messageId);

  const messageLoc: MessageTracking = getMessageLocation(messageId);
  const channelId: number = messageLoc.channelId;
  const dmId: number = messageLoc.dmId;

  if (channelId !== null) {
    pinChannelMessage(token, messageId, channelId);
  }

  if (dmId !== null) {
    pinDmMessage(token, messageId, dmId);
  }

  return {};
}

function pinChannelMessage(token: string, messageId: number, channelId: number) {
  if (!isTokenMemberOfChannel(token, channelId)) {
    throw HTTPError(400, 'Not a channel member');
  }

  if (!doesTokenHaveChanOwnerPermissions(token, channelId)) {
    throw HTTPError(403, 'authorised user does not have owner permissions in the channel');
  }

  const channelStore: ChannelStore = getChannelStoreFromId(channelId);
  const indexOfMessage: number = channelStore.messages.findIndex(a => a.messageId === messageId);
  const messageStore: Message = channelStore.messages[indexOfMessage];
  if (messageStore.isPinned !== true) {
    messageStore.isPinned = true;
  } else {
    throw HTTPError(400, 'message is already pinned');
  }

  const data: DataStore = getData();
  const indexOfChannel = data.channels.findIndex(a => a.channelId === channelId);
  data.channels[indexOfChannel].messages[indexOfMessage] = messageStore;
  setData(data);
}

function pinDmMessage(token: string, messageId: number, dmId: number) {
  if (!isTokenMemberOfDm(token, dmId)) {
    throw HTTPError(400, 'Not a dm member');
  }

  if (!doesTokenHaveDmOwnerPermissions(token, dmId)) {
    throw HTTPError(403, 'authorised user does not have owner permissions in the dm');
  }

  const dmStore: DmStore = getDmStore(dmId);
  const indexOfMessage: number = dmStore.messages.findIndex(a => a.messageId === messageId);
  const messageStore: Message = dmStore.messages[indexOfMessage];
  if (messageStore.isPinned !== true) {
    messageStore.isPinned = true;
  } else {
    throw HTTPError(400, 'message is already pinned');
  }

  const data: DataStore = getData();
  const indexOfDm = data.dms.findIndex(a => a.dmId === dmId);
  data.dms[indexOfDm].messages[indexOfMessage] = messageStore;
  setData(data);
}

// ////////////////////////////////////////////////////// //
//                      messageUnpin                      //
// ////////////////////////////////////////////////////// //
/**
 * UnPins a given message within a channel or DM the authorised user is part of
 * @param {string, number}
 * @returns { {} | Error}
 */
export function messageUnpinV1(token: string, messageId: number) {
  isValidToken(token);
  isValidMessageId(messageId);

  const messageLoc: MessageTracking = getMessageLocation(messageId);
  const channelId: number = messageLoc.channelId;
  const dmId: number = messageLoc.dmId;

  if (channelId !== null) {
    unpinChannelMessage(token, messageId, channelId);
  }

  if (dmId !== null) {
    unpinDmMessage(token, messageId, dmId);
  }

  return {};
}

function unpinChannelMessage(token: string, messageId: number, channelId: number) {
  if (!isTokenMemberOfChannel(token, channelId)) {
    throw HTTPError(400, 'Not a channel member');
  }

  if (!doesTokenHaveChanOwnerPermissions(token, channelId)) {
    throw HTTPError(403, 'authorised user does not have owner permissions in the channel');
  }

  const channelStore: ChannelStore = getChannelStoreFromId(channelId);
  const indexOfMessage: number = channelStore.messages.findIndex(a => a.messageId === messageId);
  const messageStore: Message = channelStore.messages[indexOfMessage];
  if (messageStore.isPinned !== false) {
    messageStore.isPinned = false;
  } else {
    throw HTTPError(400, 'message is already not pinned');
  }

  const data: DataStore = getData();
  const indexOfChannel = data.channels.findIndex(a => a.channelId === channelId);
  data.channels[indexOfChannel].messages[indexOfMessage] = messageStore;
  setData(data);
}

function unpinDmMessage(token: string, messageId: number, dmId: number) {
  if (!isTokenMemberOfDm(token, dmId)) {
    throw HTTPError(400, 'Not a dm member');
  }

  if (!doesTokenHaveDmOwnerPermissions(token, dmId)) {
    throw HTTPError(403, 'authorised user does not have owner permissions in the dm');
  }

  const dmStore: DmStore = getDmStore(dmId);
  const indexOfMessage: number = dmStore.messages.findIndex(a => a.messageId === messageId);
  const messageStore: Message = dmStore.messages[indexOfMessage];
  if (messageStore.isPinned !== false) {
    messageStore.isPinned = false;
  } else {
    throw HTTPError(400, 'message is already not pinned');
  }

  const data: DataStore = getData();
  const indexOfDm = data.dms.findIndex(a => a.dmId === dmId);
  data.dms[indexOfDm].messages[indexOfMessage] = messageStore;
  setData(data);
}

// ////////////////////////////////////////////////////// //
//                      messageShare                      //
// ////////////////////////////////////////////////////// //
/**
 * Shares an exisitng message to a channel or dm that the user is in
 * @param {string, number}
 * @returns { { sharedMessageId: number } | Error}
 */
export function messageShareV1 (token: string, ogMessageId: number, message: string, channelId: number, dmId: number) {
  isValidToken(token);
  isValidMessageId(ogMessageId);
  if (channelId !== -1 && dmId !== -1) {
    throw HTTPError(400, 'cannot share to channel and dm at the same time');
  }
  if (message.length > 1000) {
    throw HTTPError(400, 'given message is too long (more than 1000 characters');
  }
  let newMessageId: number;
  if (channelId === -1) {
    isValidDmId(dmId);
    newMessageId = shareToDm(token, ogMessageId, message, dmId).newMessageId;
  } else if (dmId === -1) {
    isValidChannelId(channelId);
    newMessageId = shareToChannel(token, ogMessageId, message, channelId).newMessageId;
  }
  return { newMessageId: newMessageId };
}
function shareToDm(token: string, ogMessageId: number, message: string, dmId: number) {
  if (!isTokenMemberOfDm(token, dmId)) {
    throw HTTPError(403, 'the user is not a member of the dm');
  }
  const messageLoc: MessageTracking = getMessageLocation(ogMessageId);
  const ogChannelId: number = messageLoc.channelId;
  const ogDmId: number = messageLoc.dmId;
  let messageStore: Message;
  if (ogChannelId !== null) {
    // message is from a channel
    messageStore = getMessageStoreFromChannel(ogMessageId, ogChannelId);
  }
  if (ogDmId !== null) {
    // message is from a dm
    messageStore = getMessageStoreFromDm(ogMessageId, ogDmId);
  }
  const ogMessage = messageStore.message;
  const newMessage: string = ogMessage + '\n' + message;
  const newMessageId = messageSendDmV1(token, dmId, newMessage).messageId;

  return { newMessageId: newMessageId };
}

function shareToChannel(token: string, ogMessageId: number, message: string, channelId: number) {
  if (!isTokenMemberOfChannel(token, channelId)) {
    throw HTTPError(403, 'the user is not a member of the channel');
  }
  const messageLoc: MessageTracking = getMessageLocation(ogMessageId);
  const ogChannelId: number = messageLoc.channelId;
  const ogDmId: number = messageLoc.dmId;
  let messageStore: Message;
  if (ogChannelId !== null) {
    // message is from a channel
    messageStore = getMessageStoreFromChannel(ogMessageId, ogChannelId);
  }
  if (ogDmId !== null) {
    // message is from a dm
    messageStore = getMessageStoreFromDm(ogMessageId, ogDmId);
  }
  const ogMessage = messageStore.message;
  const newMessage: string = ogMessage + '\n' + message;
  const newMessageId = messageSendV1(token, channelId, newMessage).messageId;
  return { newMessageId: newMessageId };
}

// ////////////////////////////////////////////////////// //
//                    messageSendLaterDmV1                     //
// ////////////////////////////////////////////////////// //
/**
 * User as part of a DM can send a message.
 * @param {string, number, string, number}
 * @returns { MessageId | Error}
 */
export function messageSendLaterDmV1(
  token: string, dmId: number, message: string, timeSent: number
) {
  isValidToken(token);
  isValidDmId(dmId);

  if (message.length < MIN_MSG_LEN || message.length > MAX_MSG_LEN) {
    throw HTTPError(400, 'Invalid message length');
  }

  if (!isTokenMemberOfDm(token, dmId)) {
    throw HTTPError(403, 'User not a member');
  }

  const messageId: number = generateMessageId();
  const uId: number = getUIdFromToken(token);
  const messageLoc: MessageTracking = {
    messageId: messageId,
    channelId: null,
    dmId: dmId,
    uId: uId
  };
  const messageDetails: Message = {
    messageId: messageId,
    uId: uId,
    message: message,
    timeSent: timeSent,
  };
  const data: DataStore = getData();
  const index = data.dms.findIndex(a => a.dmId === dmId);
  data.dms[index].messages.unshift(messageDetails);
  data.messageIds.unshift(messageLoc);
  setTimeout(executeLater, timeSent * 1000, data, uId);
  return <MessageId>{ messageId: messageId };
}

function executeLater(data: DataStore, uId: number) {
  setData(data);
  updateUserMessagesSentStat(uId);
  updateNumMessagesExistStat();
}
