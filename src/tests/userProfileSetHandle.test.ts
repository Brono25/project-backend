import * as h from './test.helper';
h.deleteRequest(h.CLEAR_URL, {});
// Setup
let token0: string;
let token2: string;
let handleStr2: string;
let temp: any;

beforeEach(() => {
  temp = h.postRequest(h.REGISTER_URL, {
    email: h.email0,
    password: h.password0,
    nameFirst: h.firstName0,
    nameLast: h.lastName0,
  });
  token0 = temp.token;

  temp = h.postRequest(h.REGISTER_URL, {
    email: h.email2,
    password: h.password2,
    nameFirst: h.firstName2,
    nameLast: h.lastName2,
  });
  token2 = temp.token;
  temp = h.getRequest(h.USER_ALL_URL, {
    token: token2,
  });
  handleStr2 = temp.users[1].handleStr;
});
// Tear down
afterEach(() => {
  h.deleteRequest(h.CLEAR_URL, {});
});

// ------------------Error Testing------------------//

describe('Error Handling', () => {
  test('long handleStr', () => {
    const data = h.putRequest(h.USER_PROF_SET_HANDLE_URL, {
      token: token0,
      handleStr: 'longhandleStr123456789',
    });
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
  test('not alphanumeric handleStr', () => {
    const data = h.putRequest(h.USER_PROF_SET_HANDLE_URL, {
      token: token0,
      handleStr: 'h@ndleStr',
    });
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
  test('handleStr already being used', () => {
    const data = h.putRequest(h.USER_PROF_SET_HANDLE_URL, {
      token: token0,
      handleStr: handleStr2,
    });
    expect(data).toStrictEqual({ error: expect.any(String) });
  });

  test('Invalid token', () => {
    const data = h.putRequest(h.USER_PROF_SET_HANDLE_URL, {
      token: h.invalidToken,
      handleStr: 'firstnameLastname',
    });
    expect(data).toStrictEqual({ error: expect.any(String) });
  });
});

// ------------------Function Testing------------------//

describe('Function Testing', () => {
  test('change handle', () => {
    let data: any = h.putRequest(h.USER_PROF_SET_HANDLE_URL, {
      token: token0,
      handleStr: 'firstnameLastname',
    });
    expect(data).toStrictEqual({});
    data = h.getRequest(h.USER_ALL_URL, {
      token: token0,
    });
    expect(data.users[0].handleStr).toStrictEqual('firstnameLastname');
  });
});
