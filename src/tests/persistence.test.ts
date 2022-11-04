import * as h from './test.helper';


describe('Function Testing', () => {

  test('Create new user with existing names and password but different email', () => {
    const data = h.postRequest(h.REGISTER_URL, {
      email: h.email1,
      password: h.password0,
      nameFirst: h.firstName0,
      nameLast: h.lastName0,
    });
    expect(data).toStrictEqual(<AuthRegistorReturn>{
      authUserId: expect.any(Number),
      token: expect.any(String),
    });
  });
});
