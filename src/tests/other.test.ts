
import {
  authRegisterV1,
} from '../auth';
import { AuthRegistorReturn } from '../data.types';
import * as h from './test.helper';
import { clearV1 } from '../other';

describe('clearV1()', () => {
  test('Adding duplicate user after clearV1', () => {
    const args: h.Args = ['test@gmail.com', '123456', 'firstName', 'lastName'];
    expect(authRegisterV1(...args)).toStrictEqual(<AuthRegistorReturn>{
      authUserId: expect.any(Number),
      token: expect.any(String),
    });

    clearV1();

    expect(authRegisterV1(...args)).toStrictEqual(<AuthRegistorReturn>{
      authUserId: expect.any(Number),
      token: expect.any(String),
    });
  });
});
