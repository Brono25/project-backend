// @ts-nocheck

import {
  authRegisterV1,
  authLoginV1,
} from './auth.ts';

import { clearV1 } from './other.ts';


// Test data
let firstName1 = 'First Name 1';
let lastName1 = 'Last Name 1';
let email1 = 'email_1@gmail.com';
let email1AltCase = 'EMAIL_1@GMAIL.COM';
let password1 = 'password1';

let firstName2= 'First Name 2';
let lastName2 = 'Last Name 2';
let email2 = 'email_2@gmail.com';
let password2 = 'password2';

let wrongEmail = 'anything@gmail.com';
let wrongPassword = 'wrongpassword';

//Setup
  let authUserId1 = null;
  let userId1 = null;
  let userId3 = null;
  beforeEach(() => {
    //create database of 3 users
    let args = [email1, password1, firstName1, lastName1];
    userId1 = authRegisterV1(...args).authUserId;
    args = ['middleUser'.concat(email1), password1, firstName1, lastName2];
    authRegisterV1(...args);
    args = [email2, password2, firstName2, lastName2];
    userId3 = authRegisterV1(...args).authUserId;
  });

  // Tear down
  afterEach(() => {clearV1()});



//------------------Error Testing------------------//

describe('Error Handling', () => {
  
  test('Incorrect  email', () => {
    expect(authLoginV1(wrongEmail, password1)).toStrictEqual({error: expect.any(String)});
  });
  test('Incorrect password', () => {
    expect(authLoginV1(email1, wrongPassword)).toStrictEqual({error: expect.any(String)});
  });
});


//------------------Function Testing------------------//

describe('Function Testing', () => {

  test('Authorise login for first user in database', () => {
    let args = [email1, password1]
    expect(authLoginV1(...args)).toStrictEqual({authUserId: userId1});
  }); 
  test('Authorise login for last user in database', () => {
    let args = [email2, password2]
    expect(authLoginV1(...args)).toStrictEqual({authUserId: userId3});
  }); 
  test('Authorise Login using upper case email matching lowercase', () => {
    expect(authLoginV1(email1AltCase, password1)).toStrictEqual({authUserId: userId1});
  }); 
})  




