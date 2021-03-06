import { configureStore } from "@reduxjs/toolkit";
import stockReducer from "../features/stockSlice";
import addModalReducer from "../features/addModalSlice";
import itemSlice from "../features/itemSlice";
import appSlice from "../features/appSlice";
import searchSlice from "../features/searchSlice";

export const store = configureStore({
  reducer: {
    stock: stockReducer,
    addModal: addModalReducer,
    item: itemSlice,
    app: appSlice,
    search: searchSlice,
  },
});
