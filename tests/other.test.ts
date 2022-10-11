// @ts-nocheck
import {
  authRegisterV1,
} from '../src/auth.ts';

import {clearV1} from '../src/other.ts';



describe('clearV1()', () => {

    test('Adding duplicate user after clearV1', () => {
      const args = ['test@gmail.com', '123456', 'firstName', 'lastName'];
      expect(authRegisterV1(...args)).toStrictEqual({authUserId: expect.any(Number)});
      clearV1();
      expect(authRegisterV1(...args)).toStrictEqual({authUserId: expect.any(Number)});
    });
}); 
