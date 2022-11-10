import * as h from './test.helper';

h.deleteRequest(h.CLEAR_URL, {});

// Setup
let token0: string;
let token1: string;
let handleStr2: string;
let temp: any;
let tmp: any;
beforeEach(() => {
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(0));
  token0 = tmp.token;
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(1));
  token1 = tmp.token;
  temp = h.getRequest(h.USER_ALL_URL, undefined, token1);
  handleStr2 = temp.users[1].handleStr;
});
// Tear down
afterEach(() => {
  h.deleteRequest(h.CLEAR_URL, {});
});

// ------------------Error Testing------------------//

describe('Error Handling', () => {
  test('long handleStr', () => {
    const data = { handleStr: h.invalidLongMessage };
    h.testErrorThrown(h.USER_PROF_SET_HANDLE_URL, 'PUT', 400, data, token0);
  });
  test('not alphanumeric handleStr', () => {
    const data = { handleStr: '@-/*' };
    h.testErrorThrown(h.USER_PROF_SET_HANDLE_URL, 'PUT', 400, data, token0);
  });
  test('handleStr already being used', () => {
    const data = { handleStr: handleStr2 };
    h.testErrorThrown(h.USER_PROF_SET_HANDLE_URL, 'PUT', 400, data, token0);
  });

  test('Invalid token', () => {
    const data = { handleStr: 'handle' };
    h.testErrorThrown(h.USER_PROF_SET_HANDLE_URL, 'PUT', 403, data, h.invalidToken);
  });
});

// ------------------Function Testing------------------//

describe('Function Testing', () => {
  test('change handle', () => {
    let data: any = h.putRequest(h.USER_PROF_SET_HANDLE_URL, {
      handleStr: 'firstnameLastname',
    }, token0);
    expect(data).toStrictEqual({});
    data = h.getRequest(h.USER_ALL_URL, undefined, token0);
    expect(data.users[0].handleStr).toStrictEqual('firstnameLastname');
  });
});
