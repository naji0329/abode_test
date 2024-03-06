import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  email: ''
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loadUser: (state, action) => {
      state.token = action.payload;
    },
    signOut: (state, action) => {
      state.token = null;
    },
    setUserEmail: (state, action) => {
      state.email = action.payload;
    }
  },
});

export const {
  loadUser,
  signOut,
  setUserEmail
} = userSlice.actions;

export default userSlice.reducer;
