// react imports
import React from "react";

// redux imports
import { useDispatch, useSelector } from "react-redux";
import { setCurrentItem } from "../features/itemSlice";
import {
  selectSearchResult,
  setSearchPanelIsOpen,
} from "../features/searchSlice";
import { selectActiveStock } from "../features/stockSlice";

// react router dom imports
import { useHistory } from "react-router-dom";

// firebase imports
import { db } from "./firebase";

// css imports
import "./SearchResultPanel.css";

function SearchResultPanel() {
  const searchResult = useSelector(selectSearchResult);
  const activeStock = useSelector(selectActiveStock);
  const dispatch = useDispatch();
  const history = useHistory();

  const setItem = async (itemId, itemName) => {
    await db
      .collection(activeStock.stockName)
      .doc(itemId)
      .collection("data")
      .onSnapshot((snapshot) => {
        dispatch(
          setCurrentItem({
            itemName,
            itemId,
            data: snapshot.docs.map((doc) => {
              return {
                id: doc.id,
                itemCount: doc.data().itemCount,
                date: doc.data().date,
                timestamp: doc.data().timestamp,
              };
            }),
          })
        );
      });
    history.push("/item");
    dispatch(setSearchPanelIsOpen(false));
  };

  return (
    <div className="searchResultPanel">
      {searchResult.map((result) => {
        const { id, itemName } = result;
        return (
          <div
            key={id}
            className="searchResultPanel__container"
            onClick={() => {
              setItem(id, itemName);
            }}
          >
            <p className="searchResultPanel__name">{itemName}</p>
          </div>
        );
      })}
    </div>
  );
}

export default SearchResultPanel;
