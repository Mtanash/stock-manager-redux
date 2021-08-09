import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentItem: [],
  itemLoading: true,
  modalIsOpen: false,
  addEntryModalIsOpen: false,
  infoOfItemToBeModified: {},
  modifyAction: "",
};

export const itemSlice = createSlice({
  name: "item",
  initialState,
  reducers: {
    setCurrentItem: (state, action) => {
      state.currentItem = action.payload;
    },
    setItems: (state, action) => {
      state.items = action.payload;
    },
    setModalIsOpen: (state, action) => {
      state.modalIsOpen = action.payload;
    },
    setAddEntryModalIsOpen: (state, action) => {
      state.addEntryModalIsOpen = action.payload;
    },
    setInfoOfItemToBeModified: (state, action) => {
      state.infoOfItemToBeModified = action.payload;
    },
    setModifyAction: (state, action) => {
      state.modifyAction = action.payload;
    },
  },
});

export const {
  setCurrentItem,
  setModalIsOpen,
  setInfoOfItemToBeModified,
  setModifyAction,
  setAddEntryModalIsOpen,
} = itemSlice.actions;

export const selectCurrentItem = (state) => state.item.currentItem;
export const selectModalIsOpen = (state) => state.item.modalIsOpen;
export const selectInfoOfItemToBeModified = (state) =>
  state.item.infoOfItemToBeModified;
export const selectModifyAction = (state) => state.item.modifyAction;
export const selectAddEntryModalIsOpen = (state) =>
  state.item.addEntryModalIsOpen;

export default itemSlice.reducer;
