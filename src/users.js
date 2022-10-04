// uId: Id of the user to view
import { isValidAuthUserId } from './other';
import {
    getData,
  } from './dataStore.js';
  

function userProfileV1(authUserId, uId){
    if (isValidAuthUserId(authUserId) === false){
        return {error: 'authUserId is invalid!'}
    }
    let data = getData();

    for (const user of data.users){
        if (user.authUserId === uId){
          return {
            user: {
              uId: uId,
              email: user.email,
              nameFirst: user.nameFirst,
              nameLast: user.nameLast,
              handleString: user.handleStr,
            }
          }
        } 
    }
    
        return {error: 'User to view is invalid!'}
}

export {
    userProfileV1,
  };
  
  