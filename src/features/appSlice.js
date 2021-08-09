import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  laoding: false,
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.laoding = action.payload;
    },
  },
});

export const { setLoading } = appSlice.actions;

export const selectLoading = (state) => state.app.loading;

export default appSlice.reducer;
