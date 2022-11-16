
import express, { json, Request, Response } from 'express';
import { echo } from './echo';
import morgan from 'morgan';
import config from './config.json';
import cors from 'cors';
import errorHandler from 'middleware-http-errors';
import { clearV1 } from './other';
import {
  authLoginV1,
  authRegisterV1,
  AuthLogoutV1
} from './auth';

import {
  channelsCreateV2,
  channelsListV2,
  channelsListAllV2,
} from './channels';

import {
  channelLeaveV1,
  channelMessagesV1,
  channelInviteV2,
  channelAddOwnerV1,
  channelDetailsV2
} from './channel';

import {
  usersAllv1,
  usersStatsv1,
} from './users';

import {
  userProfileSetNameV1,
  userProfileV2,
  userProfileSetEmailV1,
  userProfileSetHandleV1,
  userStatsV1,
} from './user';

import {
  channelJoinV2,
  channelRemoveOwnerV1,
} from './channel';

import {
  messageSendV1,
  messageSendDmV1,
  messageRemoveV1,
  messageEditV1,
} from './message';

import {
  dmCreateV1,
  dmDetailsv1,
  dmLeavev1,
  dmMessagesV1,
  dmRemoveV1,
  dmListV1,
} from './dm';

// Set up web app
const app = express();
// Use middleware that allows us to access the JSON body of requests
app.use(json());
// Use middleware that allows for access from other domains
app.use(cors());

const PORT: number = parseInt(process.env.PORT || config.port);
const HOST: string = process.env.IP;

// Example get request
app.get('/echo', (req: Request, res: Response, next) => {
  try {
    const data = req.query.echo as string;
    return res.json(echo(data));
  } catch (err) {
    next(err);
  }
});

// handles errors nicely
app.use(errorHandler());

// for logging errors (print to terminal)
app.use(morgan('dev'));

function getTokenFromHeader(req: Request) {
  const token = req.header('token');
  console.log(token);
  // const obj = JSON.parse(json);
  return token;
}

// ////////////////////////////////////////////////////// //
//                    Interface Wrappers                  //
// ////////////////////////////////////////////////////// //

// ------------- AUTH --------------
app.post('/auth/login/v3', (req: Request, res: Response) => {
  const { email, password } = req.body;
  res.json(authLoginV1(email, password));
});

app.post('/auth/register/v3', (req: Request, res: Response) => {
  const { email, password, nameFirst, nameLast } = req.body;
  res.json(authRegisterV1(email, password, nameFirst, nameLast));
});

app.post('/auth/logout/v2', (req: Request, res: Response) => {
  const token = getTokenFromHeader(req);
  res.json(AuthLogoutV1(token));
});

// ------------- CHANNELS --------------
app.post('/channels/create/v3', (req: Request, res: Response) => {
  const { name, isPublic } = req.body;
  const token = getTokenFromHeader(req);
  res.json(channelsCreateV2(token, name, <boolean>isPublic));
});

app.get('/channels/list/v3', (req: Request, res: Response) => {
  const token = getTokenFromHeader(req);
  res.json(channelsListV2(token));
});
app.get('/channels/listAll/v3', (req: Request, res: Response) => {
  const token = getTokenFromHeader(req);
  res.json(channelsListAllV2(token));
});

// ------------- CHANNEL --------------

app.post('/channel/invite/v3', (req: Request, res: Response) => {
  const { channelId, uId } = req.body;
  const token = getTokenFromHeader(req);
  res.json(channelInviteV2(token, parseInt(channelId), parseInt(uId)));
});

app.post('/channel/addowner/v2', (req: Request, res: Response) => {
  const { channelId, uId } = req.body;
  const token = getTokenFromHeader(req);
  res.json(channelAddOwnerV1(token, parseInt(channelId), parseInt(uId)));
});
app.get('/channel/details/v3', (req: Request, res: Response) => {
  const token = getTokenFromHeader(req);
  const channelId = req.query.channelId as string;
  res.json(channelDetailsV2(token, parseInt(channelId)));
});
app.post('/channel/join/v3', (req: Request, res: Response) => {
  const { channelId } = req.body;
  const token = getTokenFromHeader(req);
  res.json(channelJoinV2(token, parseInt(channelId)));
});
app.get('/channel/messages/v3', (req: Request, res: Response) => {
  const token = getTokenFromHeader(req);
  const channelId = req.query.channelId as string;
  const start = req.query.start as string;
  res.json(channelMessagesV1(token, parseInt(channelId), parseInt(start)));
});
app.post('/channel/leave/v2', (req: Request, res: Response) => {
  const { channelId } = req.body;
  const token = getTokenFromHeader(req);
  res.json(channelLeaveV1(token, parseInt(channelId)));
});

app.post('/channel/removeowner/v2', (req: Request, res: Response) => {
  const { channelId, uId } = req.body;
  const token = getTokenFromHeader(req);
  res.json(channelRemoveOwnerV1(token, parseInt(channelId), parseInt(uId)));
});
// ------------- MESSAGE --------------
app.post('/message/send/v2', (req: Request, res: Response) => {
  const { channelId, message } = req.body;
  const token = getTokenFromHeader(req);
  res.json(messageSendV1(token, parseInt(channelId), message));
});
app.delete('/message/remove/v2', (req: Request, res: Response) => {
  const token = getTokenFromHeader(req);
  const messageId = req.query.messageId as string;
  res.json(messageRemoveV1(token, parseInt(messageId)));
});
app.put('/message/edit/v2', (req: Request, res: Response) => {
  const { messageId, message } = req.body;
  const token = getTokenFromHeader(req);
  res.json(messageEditV1(token, parseInt(messageId), message));
});
app.post('/message/senddm/v2', (req: Request, res: Response) => {
  const { dmId, message } = req.body;
  const token = getTokenFromHeader(req);
  res.json(messageSendDmV1(token, parseInt(dmId), message));
});
// ------------- DM --------------
app.post('/dm/create/v2', (req: Request, res: Response) => {
  const { uIds } = req.body;
  const token = getTokenFromHeader(req);
  const uIdsInt: number[] = uIds.map((a: string) => parseInt(a));
  res.json(dmCreateV1(token, uIdsInt));
});

app.get('/dm/details/v2', (req: Request, res: Response) => {
  const token = getTokenFromHeader(req);
  const dmId = req.query.dmId as string;
  res.json(dmDetailsv1(token, parseInt(dmId)));
});

app.get('/dm/list/v2', (req: Request, res: Response) => {
  const token = getTokenFromHeader(req);
  res.json(dmListV1(token));
});

app.post('/dm/leave/v2', (req: Request, res: Response) => {
  const { dmId } = req.body;
  const token = getTokenFromHeader(req);
  res.json(dmLeavev1(token, parseInt(dmId)));
});
app.delete('/dm/remove/v2', (req: Request, res: Response) => {
  const token = getTokenFromHeader(req);
  const dmId = req.query.dmId as string;
  res.json(dmRemoveV1(token, parseInt(dmId)));
});
app.get('/dm/messages/v2', (req: Request, res: Response) => {
  const token = getTokenFromHeader(req);
  const dmId = req.query.dmId as string;
  const start = req.query.start as string;
  res.json(dmMessagesV1(token, parseInt(dmId), parseInt(start)));
});

// ------------- USER --------------
app.get('/user/profile/v3', (req: Request, res: Response) => {
  const token = getTokenFromHeader(req);
  const uId = req.query.uId as string;
  res.json(userProfileV2(token, parseInt(uId)));
});

app.put('/user/profile/setname/v2', (req: Request, res: Response) => {
  const { nameFirst, nameLast } = req.body;
  const token = getTokenFromHeader(req);
  res.json(userProfileSetNameV1(token, nameFirst, nameLast));
});

app.put('/user/profile/sethandle/v2', (req: Request, res: Response) => {
  const { handleStr } = req.body;
  const token = getTokenFromHeader(req);
  res.json(userProfileSetHandleV1(token, handleStr));
});

app.put('/user/profile/setemail/v2', (req: Request, res: Response) => {
  const { email } = req.body;
  const token = getTokenFromHeader(req);
  res.json(userProfileSetEmailV1(token, email));
});
app.get('/user/stats/v1', (req: Request, res: Response) => {
  const token = getTokenFromHeader(req);
  res.json(userStatsV1(token));
});
// ------------- USERS --------------

app.get('/users/all/v2', (req: Request, res: Response) => {
  const token = getTokenFromHeader(req);
  res.json(usersAllv1(token));
});
app.get('/users/stats/v1', (req: Request, res: Response) => {
  const token = getTokenFromHeader(req);
  res.json(usersStatsv1(token));
});

app.delete('/clear/v1', (req: Request, res: Response) => {
  res.json(clearV1());
});

// ----------------------------------------------------------

// start server
const server = app.listen(PORT, HOST, () => {
  // DO NOT CHANGE THIS LINE
  console.log(`⚡️ Server listening on port ${PORT} at ${HOST}`);
});

// For coverage, handle Ctrl+C gracefully
process.on('SIGINT', () => {
  server.close(() => console.log('Shutting down server gracefully.'));
});
