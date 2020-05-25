import { createStore, applyMiddleware, combineReducers } from "redux";
import user from "./user_reducer";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

const rootReducer = combineReducers({
  user,
});

export default createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);
