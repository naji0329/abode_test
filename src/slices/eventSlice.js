import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  events: []
};

export const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    setEvents: (state, action) => {
      state.events = action.payload;
      return state;
    }
  },
});

export const {
  setEvents
} = eventSlice.actions;

export default eventSlice.reducer;
