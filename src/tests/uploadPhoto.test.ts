import * as h from './test.helper';

h.deleteRequest(h.CLEAR_URL, {});

let token0: string;
let tmp: any;
beforeEach(() => {
  tmp = h.postRequest(h.REGISTER_URL, h.generateUserRegisterArgs(0));
  token0 = tmp.token;
});
// Tear down
afterEach(() => {
  h.deleteRequest(h.CLEAR_URL, {});
});

// ------------------Error Testing------------------///
describe('Error Handling', () => {
  test('Invalid token', () => {
    const data = {
      imageUrl: 'testurl',
      xStart: 5,
      yStart: 5,
      xEnd: 10,
      yEnd: 10
    };
    h.testErrorThrown(h.USER_IMAGE_URL, 'POST', 403, data, h.invalidToken);
  });
  test('xEnd is less than xStart', () => {
    const data = {
      imageUrl: 'testurl',
      xStart: 10,
      yStart: 5,
      xEnd: 5,
      yEnd: 10
    };
    h.testErrorThrown(h.USER_IMAGE_URL, 'POST', 400, data, token0);
  });
  test('yEnd is less than yStart', () => {
    const data = {
      imageUrl: 'testurl',
      xStart: 5,
      yStart: 10,
      xEnd: 10,
      yEnd: 5
    };
    h.testErrorThrown(h.USER_IMAGE_URL, 'POST', 400, data, token0);
  });
  test('xEnd is equal to xStart', () => {
    const data = {
      imageUrl: 'testurl',
      xStart: 5,
      yStart: 5,
      xEnd: 5,
      yEnd: 10
    };
    h.testErrorThrown(h.USER_IMAGE_URL, 'POST', 400, data, token0);
  });
  test('yEnd is equal to yStart', () => {
    const data = {
      imageUrl: 'testurl',
      xStart: 10,
      yStart: 5,
      xEnd: 5,
      yEnd: 5
    };
    h.testErrorThrown(h.USER_IMAGE_URL, 'POST', 400, data, token0);
  });
});
