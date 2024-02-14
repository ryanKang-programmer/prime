// reducers/index.js
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import counter from "./counter";
import leak from "./Leak";
// import auth from "./auth";
// import board from "./board";
// import studio from "./studio";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["counter", "leak"]
  // blacklist
};

export const rootReducer = combineReducers({
  counter,
  leak
});

export default persistReducer(persistConfig, rootReducer);
