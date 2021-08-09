import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  addModalIsOpen: false,
};

export const addModalSlice = createSlice({
  name: "addModal",
  initialState,
  reducers: {
    openAddModal: (state) => {
      state.addModalIsOpen = true;
    },
    closeAddModal: (state) => {
      state.addModalIsOpen = false;
    },
  },
});

export const { openAddModal, closeAddModal } = addModalSlice.actions;

export const selectAddModalIsOpen = (state) => state.addModal.addModalIsOpen;

export default addModalSlice.reducer;
