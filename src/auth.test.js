

import {
  authLoginV1,
  authRegisterV1,
} from './auth';

import { clearV1 } from './other';



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

let invalidEmail = 'Not a valid email string';
let invalidShortPassword = '12345';
let invalidEmptyName = '';
let invalidLongFirstName = 'FirstNameLongerThanFiftyCharactersIsAnInvalidFirstName';
let invalidLongLastName = 'LastNameLongerThanFiftyCharactersIsAnInvalidLastName';

let wrongEmail = 'anything@gmail.com';
let wrongPassword = 'wrongpassword';




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
    test('Attempt to assign uppercase email when lower case email is already taken', () => {
      const args1 = [email1AltCase, password2, firstName2, lastName2];
      expect(authRegisterV1(...args1)).toStrictEqual({error: expect.any(String)});
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
    test('Create new user and get a number user ID', () => {
      const args = [email2, password2, firstName2, lastName2];
      expect(authRegisterV1(...args)).toStrictEqual({authUserId: expect.any(Number)});
    });
    test('Create new user with existing names and password but different email', () => {
      const args = [email2, password1, firstName1, lastName1];
      expect(authRegisterV1(...args)).toStrictEqual({authUserId: expect.any(Number)});
    });
    test('Create 100 users and get 100 unique ID\'s', () => {
      const numberOfUsers = 100;
      let userIdList = new Set();
      let email = '';
      for (let n  = 0; n < numberOfUsers ; n++) {
        email = n.toString().concat(email1);
        let args = [email, password1, firstName1, lastName1];
        let userId = authRegisterV1(...args);
        userIdList.add(userId);
      }
      let h = userIdList.size
      expect(userIdList.size === numberOfUsers).toStrictEqual(true);
    });
  });
});



//------------------Auth Login Test------------------//



describe('authLoginV1()', () => {
 
    // Tear down
  afterEach(() => {clearV1()});

  describe('Error Handling', () => {
    test('do error testing for wrong email', () => {
      const args = [email2, password2, firstName2, lastName2];
      authRegisterV1(...args);
      expect(authLoginV1(wrongEmail, password2)).toStrictEqual({error: expect.any(String)});
    });
    test('do error testing for wrong password', () => {
      const args = [email2, password2, firstName2, lastName2];
      authRegisterV1(...args);
      expect(authLoginV1(email2, wrongPassword)).toStrictEqual({error: expect.any(String)});
    });
});
describe('Function Testing', () => {

  test('Autherise Login using exact email match', () => {
    const args = [email1, password1, firstName1, lastName1];
    const userId = authRegisterV1(...args).authUserId;
    expect(authLoginV1(email1, password1)).toStrictEqual({authUserId: userId});
  }); 
  test('Autherise Login using upper case email matching lowercase', () => {
    const args = [email1, password1, firstName1, lastName1];
    const userId = authRegisterV1(...args).authUserId;
    expect(authLoginV1(email1AltCase, password1)).toStrictEqual({authUserId: userId});
  }); 
  

})  

});



