import {
  LOGIN_USER,
  SIGNUP_USER,
  AUTH_FAILED,
  SIGNUP_USER_IMAGE,
} from '../_actions/constants/user_constants'

// prepei pada na exo ena initial state
const initialState = {
  token: null,
  errorMessage: null,
  userId: null,
}

export default function (state = initialState, action) {
  // console.log(action);
  // if (action.type === "SIGNUP_USER") {
  //   console.log("Hi SIGNUP_USER");
  //   return {
  //     ...state,
  //     token: action.payload.token,
  //     userId: action.payload.userId,
  //   };
  // }
  // if (action.type === "LOGIN_USER") {
  //   console.log("Hi LOGIN_USER");
  //   return {
  //     ...state,
  //     token: action.payload.token,
  //     userId: action.payload.userId,
  //   };
  // }
  // if (action.type === "AUTH_FAILED") {
  //   console.log("Hi AUTH_FAILED");
  //   return { ...state, errorMessage: action.payload };
  // }
  switch (action.type) {
    case SIGNUP_USER:
      return {
        ...state,
        token: action.payload.token,
        userId: action.payload.userId,
      }
    case SIGNUP_USER_IMAGE:
      return {
        ...state,
        token: action.payload.token,
        userId: action.payload.userId,
      }
    case LOGIN_USER:
      return {
        ...state,
        token: action.payload.token,
        userId: action.payload.userId,
        image: action.payload.image,
      }
    case AUTH_FAILED:
      return { ...state, errorMessage: action.payload.message }
    default:
      console.log('reducer')
      return state
  }
}
