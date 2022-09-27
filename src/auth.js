
import validator from 'validator';
import {

} from './other'



//------------------Auth Helper functions------------------
// Do we assume names can contain characters outside of [a-z][0-9]??
function generateHandleStr(firstName, lastName) {

  let filteredFirstName = firstName.match(/[a-z0-9]+/ig).join('');
  let filteredLastName = lastName.match(/[a-z0-9]+/ig).join('');
  let lcFirstName = filteredFirstName.toLowerCase();
  let lcLasttName = filteredLastName.toLowerCase();

  let baseHandle = lcFirstName.concat(lcLasttName);

  const maxChars = 20;
  if (baseHandle.length > maxChars) {
    baseHandle = baseHandle.substring(0, maxChars);
  }

  return {};
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

  //TO DO Email in use




  return {
    authUserId: 1,
  }
}



export {
  authLoginV1,
  authRegisterV1,
};


generateHandleStr('John312**2**1', '**Buckley120&%&8^%7(');