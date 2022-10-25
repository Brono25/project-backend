import express, { json, Request, Response } from 'express';
import { echo } from './echo';
import morgan from 'morgan';
import config from './config.json';
import cors from 'cors';
import {
  authLoginV1,
  authRegisterV1,
  AuthLogoutV1
} from './auth';
import { channelsCreateV2 } from './channels';
import { channelLeaveV1, channelMessagesV1 } from './channel';
import { debug } from './debug';
import { clearV1 } from './other';
import { userProfileSetNameV1, userProfileV2, usersAllv1, userProfileSetEmailV1, userProfileSetHandleV1 } from './users';
import { channelJoinV2 } from './channel';
import {
  messageSendV1,
  messageSendDmV1,
} from './message';

import {
  dmCreateV1,
  dmDetailsv1,
  dmMessagesV1,
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
// for logging errors (print to terminal)
app.use(morgan('dev'));

// ////////////////////////////////////////////////////// //
//                    Interface Wrappers                  //
// ////////////////////////////////////////////////////// //
app.post('/auth/login/v2', (req: Request, res: Response) => {
  const { email, password } = req.body;
  res.json(authLoginV1(email, password));
});

app.post('/auth/register/v2', (req: Request, res: Response) => {
  const { email, password, nameFirst, nameLast } = req.body;
  res.json(authRegisterV1(email, password, nameFirst, nameLast));
});

app.post('/auth/logout/v1', (req: Request, res: Response) => {
  const { token } = req.body;
  res.json(AuthLogoutV1(token));
});

app.post('/channels/create/v2', (req: Request, res: Response) => {
  const { token, name, isPublic } = req.body;
  res.json(channelsCreateV2(token, name, <boolean>isPublic));
});

app.post('/message/send/v1', (req: Request, res: Response) => {
  const { token, channelId, message } = req.body;
  res.json(messageSendV1(token, parseInt(channelId), message));
});
app.post('/dm/create/v1', (req: Request, res: Response) => {
  const { token, uIds } = req.body;
  const uIdsInt: number[] = uIds.map((a: string) => parseInt(a));
  res.json(dmCreateV1(token, uIdsInt));
});

app.get('/dm/details/v1', (req: Request, res: Response) => {
  const token = req.query.token as string;
  const dmId = req.query.dmId as string;
  res.json(dmDetailsv1(token, parseInt(dmId)));
});

app.get('/channel/messages/v2', (req: Request, res: Response) => {
  const token = req.query.token as string;
  const channelId = req.query.channelId as string;
  const start = req.query.start as string;
  res.json(channelMessagesV1(token, parseInt(channelId), parseInt(start)));
});
app.get('/dm/messages/v1', (req: Request, res: Response) => {
  const token = req.query.token as string;
  const dmId = req.query.dmId as string;
  const start = req.query.start as string;
  res.json(dmMessagesV1(token, parseInt(dmId), parseInt(start)));
});

app.post('/message/senddm/v1', (req: Request, res: Response) => {
  const { token, dmId, message } = req.body;
  res.json(messageSendDmV1(token, parseInt(dmId), message));
});

app.get('/user/profile/v2', (req: Request, res: Response) => {
  const token = req.query.token as string;
  const uId = req.query.uId as string;
  res.json(userProfileV2(token, parseInt(uId)));
});

app.get('/users/all/v1', (req: Request, res: Response) => {
  const token = req.query.token as string;
  res.json(usersAllv1(token));
});

app.put('/user/profile/setname/v1', (req: Request, res: Response) => {
  const { token, nameFirst, nameLast } = req.body;
  res.json(userProfileSetNameV1(token, nameFirst, nameLast));
});

app.put('/user/profile/sethandle/v1', (req: Request, res: Response) => {
  const { token, handleStr } = req.body;
  res.json(userProfileSetHandleV1(token, handleStr));
});

app.put('/user/profile/setemail/v1', (req: Request, res: Response) => {
  const { token, email } = req.body;
  res.json(userProfileSetEmailV1(token, email));
});

app.post('/channel/join/v2', (req: Request, res: Response) => {
  const { token, channelId } = req.body;
  res.json(channelJoinV2(token, parseInt(channelId)));
});

app.post('/channel/leave/v1', (req: Request, res: Response) => {
  const { token, channelId } = req.body;
  res.json(channelLeaveV1(token, parseInt(channelId)));
});

app.delete('/clear/v1', (req: Request, res: Response) => {
  res.json(clearV1());
});

// ////////////////////////////////////////////////////// //
//                for debugging *delete later*            //
// ////////////////////////////////////////////////////// //
app.post('/debug', (req: Request, res: Response) => {
  res.json(debug());
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
