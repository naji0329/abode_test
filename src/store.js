import { combineReducers, configureStore } from "@reduxjs/toolkit";
import eventSlice from "./slices/eventSlice";
import userSlice from "./slices/userSlice";

const rootReducer = combineReducers({
  event: eventSlice,
  user: userSlice
});

export const store = configureStore({
  reducer: rootReducer,
  devTools: true,
})