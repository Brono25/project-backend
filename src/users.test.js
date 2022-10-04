
import {
    authRegisterV1,
  } from './auth';

import { userProfileV1 } from './users';
import { clearV1 } from './other';
import {
    getData,
  } from './dataStore.js';


// Test data
let firstName1 = 'First Name 1';
let lastName1 = 'Last Name 1';
let email1 = 'email_1@gmail.com';
let password1 = 'password1';

let firstName2= 'First Name 2';
let lastName2 = 'Last Name 2';
let email2 = 'email_2@gmail.com';
let password2 = 'password2';

let wrongUserId = '999';
let correctUserId = '1';



//------------------Auth Register Test------------------//


describe('userProfileV1', () => {

  // Setup
  let user1 = null;
  beforeEach(() => {
    user1 = authRegisterV1(email1, password1, firstName1, lastName1); 
  });
  // Tear down
  afterEach(() => {clearV1()});

  describe('Error Handling', () => {

    test('Invalid authUserId', () => {
      expect(userProfileV1(wrongUserId, correctUserId)).toStrictEqual({error: expect.any(String)});
    }); 
    test('Invalid uId', () => {
      expect(userProfileV1(correctUserId, wrongUserId)).toStrictEqual({error: expect.any(String)});
    });   
   
    });
});

describe('Function Testing', () => {
    let user1 = null;
    beforeEach(() => {
      user1 = authRegisterV1(email1, password1, firstName1, lastName1); 
    });
    // Tear down
    afterEach(() => {clearV1()});
  
  test('Valid authUserId and uId', () => {
    const args2 = [email2, password2, firstName2, lastName2];
    const authUserId2 = authRegisterV1(...args2).authUserId;
    const user2 = getUser(authUserId2)

    expect(userProfileV1(user1.authUserId, user2.authUserId)).toStrictEqual({
        user: {
            uId: authUserId2,
            email: email2,
            nameFirst: firstName2,
            nameLast: lastName2,
            handleString: user2.handleStr,
        } });
  }); 
  
});

function getUser(userId){
    let data = getData();
    for (const user of data.users){
      if (userId === user.authUserId){
        return user;
      }
    }
  }