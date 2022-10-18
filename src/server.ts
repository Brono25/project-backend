import express, { json, Request, Response } from 'express';
import { echo } from './echo';
import morgan from 'morgan';
import config from './config.json';
import cors from 'cors';
import {
  authLoginV1,
  authRegisterV1,
} from './auth';
import { channelsCreateV2 } from './channels';
import { debug } from './debug';
import { clearV1 } from './other';
import { messageSendV1 } from './message';
import { userProfileV2 } from './users';
import { dmCreateV1 } from './dm';
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

app.post('/channels/create/v2', (req: Request, res: Response) => {
  const { token, name, isPublic } = req.body;
  res.json(channelsCreateV2(token, name, isPublic));
});

app.post('/message/send/v1', (req: Request, res: Response) => {
  const { token, channelId, message } = req.body;
  res.json(messageSendV1(token, channelId, message));
});
app.post('/dm/create/v1', (req: Request, res: Response) => {
  const { token, uId } = req.body;
  res.json(dmCreateV1(token, uId ));
});

app.get('/user/profile/v2', (req: Request, res: Response) => {
  const token = req.query.token as string;
  const uId = req.query.uId as string;
  res.json(userProfileV2(token, +uId));
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
