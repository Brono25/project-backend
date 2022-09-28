

import {
  authLoginV1,
  authRegisterV1,
} from './auth';

import { clearV1 } from './other';



// Test data
let firstName1 = 'First Name 1';
let lastName1 = 'Last Name 1';
let email1 = 'email_1@gmail.com';
let password1 = 'password1';

let firstName2= 'First Name 2';
let lastName2 = 'Last Name 2';
let email2 = 'email_2@gmail.com';
let password2 = 'password2';

let invalidEmail = 'Not a valid email string';
let invalidShortPassword = '12345';
let invalidEmptyName = '';
let invalidLongFirstName = 'FirstNameLongerThanFiftyCharactersIsAnInvalidFirstName';
let invalidLongLastName = 'LastNameLongerThanFiftyCharactersIsAnInvalidLastName';

let wrongemail = 'wrong_email@gmail.com';
let wrongpassword  = 'wrongpassword';








//------------------Auth Register Test------------------//


describe('authRegisterV1()', () => {

  // Setup
  let authUserId1 = null;
  beforeEach(() => {
    authUserId1 = authRegisterV1(email1, password1, firstName1, lastName1).authUserId; 
  });

  // Tear down
  afterEach(() => {clearV1()});

  describe('Error Handling', () => {

    test('Invalid email', () => {
      const args = [invalidEmail, password1, firstName1, lastName1];
      expect(authRegisterV1(...args)).toStrictEqual({error: expect.any(String)});
    }); 

    test('Email address already in use', () => {
      const args1 = [email1, password1, firstName1, lastName1];
      const args2 = [email1, password2, firstName2, lastName2];
      expect(authRegisterV1(...args1)).toStrictEqual({error: expect.any(String)});
      expect(authRegisterV1(...args2)).toStrictEqual({error: expect.any(String)});
    });   

    test('Invalid password (less than 6 characters)', () => {
      const args = [email1, invalidShortPassword, firstName1, lastName1];
      expect(authRegisterV1(...args)).toStrictEqual({error: expect.any(String)});
    }); 

    test('Invalid first name (greater than 50 characters)', () => {
      const args = [email1, password1, invalidLongFirstName, lastName1];
      expect(authRegisterV1(...args)).toStrictEqual({error: expect.any(String)});
    });

    test('Invalid last name (greater than 50 characters)', () => {
      const args = [email1, password1, firstName1, invalidLongLastName];
      expect(authRegisterV1(...args)).toStrictEqual({error: expect.any(String)});
    });
    test('Invalid empty first name', () => {
      const args = [email1, password1, invalidEmptyName, lastName1];
      expect(authRegisterV1(...args)).toStrictEqual({error: expect.any(String)});
    });
    test('Invalid empty last name', () => {
      const args = [email1, password1, firstName1, invalidEmptyName];
      expect(authRegisterV1(...args)).toStrictEqual({error: expect.any(String)});
    });
  });

  describe('Function Testing', () => {
    test('Create new user', () => {
      const args = [email2, password2, firstName2, lastName2];
      expect(authRegisterV1(...args)).toStrictEqual({authUserId: expect.any(Number)});
    });
  });
});



//------------------Auth Login Test------------------//


describe('authLoginV1()', () => {
 
    test('do error testing for wrong email', () => {
      clearV1();
      const args = [email2, password2, firstName2, lastName2];
      authRegisterV1(args);
      expect(authLoginV1(wrongemail, password2)).toStrictEqual({error: expect.any(String)});

    });
    test('do error testing for wrong password', () => {
      clearV1();
      const args = [email2, password2, firstName2, lastName2];
      authRegisterV1(args);
      expect(authLoginV1(email2, wrongpassword)).toStrictEqual({error: expect.any(String)});
    });

  describe('Function Testing', () => {

    test('do function testing', () => {
      clearV1();
      const args = [email2, password2, firstName2, lastName2];
      authRegisterV1(args);
      expect(authLoginV1(email2, password2)).toStrictEqual({authUserId: expect.any(Number)});

    }); 

  })  
 
});




