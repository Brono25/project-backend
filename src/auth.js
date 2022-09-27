
import validator from 'validator';
import {
  setData,
  getData,
} from './dataStore.js';



//------------------Auth Helper functions------------------




/**
 * @param {string} - users handle 
 * @returns {boolean} - is handle unique
 */
function isHandleStrUnique(handleStr) {

  const data = getData();

  if(!data.users.length) {
    return true;
  }
  for(let user of data.users) {
    if(user.handleStr === handleStr) {
      return false;
    }
  }
  return true;
}




/**
 * Generate a unique handle for a new user based off their 
 * first and last names.
 * 
 * @param {string, string} - firstName, lastName
 * @returns {string} - always returns a unique handle string
 */
function generateHandleStr(nameFirst, nameLast) {

  let filteredFirstName = nameFirst.match(/[a-z0-9]+/ig).join('').toLowerCase();
  let filteredLastName = nameLast.match(/[a-z0-9]+/ig).join('').toLowerCase();
  let handleStr = filteredFirstName.concat(filteredLastName);

  const maxChars = 20;
  if(handleStr.length > maxChars) {
    handleStr = handleStr.substring(0, maxChars);
  }

  if(!isHandleStrUnique(handleStr)) {
    let n = 0;
    while (!isHandleStrUnique(handleStr + n)) {
      n++;
    }
    handleStr = handleStr + n;
  } 
  return handleStr;
}







/**
 * The user ID is the same as their index in the 
 * data.user array. This is to make fetching user details
 * from their user ID easy and ensures unique ID's.
 * 
 * @param {} 
 * @returns {number} - unique user id
 */
function generateAuthUserId() {

  const data = getData();
  const id = data.users.length;
  return id;
}



/**
 * @param {string} - users email
 * @returns {boolean} - is email already claimed by another user
 */
function isEmailTaken(email) {

  const data = getData();

  if(!data.users.length) {
    return false;
  }
  for(let user of data.users) {
    if(user.email === email) {
      return true;
    }
  }
  return false;
}






//------------------Auth Main functions------------------


// Stub-function for authenticating user login
function authLoginV1(email, password) {
  return {
    authUserId: 1,
  }
}



//Stub-function for registering user.
function authRegisterV1(email, password, nameFirst, nameLast) {

  
  if(!validator.isEmail(email)) {
    return {error: 'Invalid Email'};
  }
  if(isEmailTaken(email)) {
    return {error: 'Email is already taken'};
  }
  const minPasswordLength = 6;
  if(password.length < minPasswordLength) {
    return {error: 'Passwords must atleast 6 characters'};
  }
  const maxNameLength = 50;
  const minNameLength = 1;
  if(nameFirst.length < minNameLength || nameFirst.length > maxNameLength ) {
    return {error: 'First name must be between 1-50 characters long (inclusive)'};
  }
  if(nameLast.length < minNameLength || nameLast.length > maxNameLength ) {
    return {error: 'Last name must be between 1-50 characters long (inclusive)'};
  }



  const handleStr = generateHandleStr(nameFirst, nameLast);
  const authUserId = generateAuthUserId();
  const userDetails = {
      authUserId: authUserId,
      nameFirst: nameFirst,
      nameLast: nameLast,
      email: email,
      handleStr: handleStr,
    };

    let data = getData();
    data.users.push(userDetails);
    setData(data);


 

  return  {authUserId: authUserId};
}



export {
  authLoginV1,
  authRegisterV1,
};


authRegisterV1('e@gmail.com','1234567' ,'John312**2**1', '**Buckley120&%&8^%7(')
authRegisterV1('ae@gmail.com','1234567' ,'John312**2**1', '**Buckley120&%&8^%7(')
authRegisterV1('awe@gmail.com','1234567' ,'John312**2**1', '**Buckley120&%&8^%7(')
authRegisterV1('aqwe@gmail.com','1234567' ,'John312**2**1', '**Buckley120&%&8^%7(')
authRegisterV1('aeqwe@gmail.com','1234567' ,'John312**2**1', '**Buckley120&%&8^%7(')

