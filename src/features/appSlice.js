import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  laoding: false,
  snackbar: {
    isSnackbarOpen: false,
    message: "",
  },
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.laoding = action.payload;
    },
    setSnackbar: (state, action) => {
      state.snackbar = action.payload;
    },
  },
});

export const { setLoading, setSnackbar } = appSlice.actions;

export const selectLoading = (state) => state.app.loading;
export const selectSnackbar = (state) => state.app.snackbar;

export default appSlice.reducer;
