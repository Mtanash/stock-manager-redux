import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchResult: [],
  searchPanelIsOpen: false,
};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchResult: (state, action) => {
      state.searchResult = action.payload;
    },
    setSearchPanelIsOpen: (state, action) => {
      state.searchPanelIsOpen = action.payload;
    },
  },
});

export const { setSearchResult, setSearchPanelIsOpen } = searchSlice.actions;

export const selectSearchResult = (state) => state.search.searchResult;
export const selectSearchPanelIsOpen = (state) =>
  state.search.searchPanelIsOpen;

export default searchSlice.reducer;
