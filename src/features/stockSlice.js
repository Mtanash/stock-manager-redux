import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  stocks: [
    { id: 1, stockName: "mohamed" },
    { id: 2, stockName: "aml" },
  ],
  activeStock: { id: 1, stockName: "mohamed" },
};

export const stockSlice = createSlice({
  name: "stock",
  initialState,
  reducers: {
    setItems: (state, action) => {
      state.items = action.payload;
    },
    updateItems: (state, action) => {
      state.items.push(action.payload);
    },

    setActiveStock: (state, action) => {
      state.activeStock = action.payload;
    },
    setStocks: (state, action) => {
      state.stocks = action.payload;
    },
  },
});

export const { setItems, updateItems, setActiveStock, setStocks } =
  stockSlice.actions;

export const selectItems = (state) => state.stock.items;
export const selectActiveStock = (state) => state.stock.activeStock;
export const selectStocks = (state) => state.stock.stocks;

export default stockSlice.reducer;
