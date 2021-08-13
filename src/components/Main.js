// react imports
import React, { useEffect, useState } from "react";

// firebase imports
import { db } from "./firebase";

// modules imports
import AddModal from "./AddModal";

// redux imports
import {
  selectActiveStock,
  selectItems,
  setItems,
} from "../features/stockSlice";
import { useDispatch, useSelector } from "react-redux";
import { openAddModal, selectAddModalIsOpen } from "../features/addModalSlice";
import { setCurrentItem } from "../features/itemSlice";
import { selectLoading, setLoading } from "../features/appSlice";

// css imports
import "./Main.css";

// material ui imports
import AddCircleIcon from "@material-ui/icons/AddCircle";
import SearchIcon from "@material-ui/icons/Search";

// loader spinner imports
import Loader from "react-loader-spinner";

// react router imports
import { useHistory } from "react-router-dom";
import SearchResultPanel from "./SearchResultPanel";
import {
  selectSearchPanelIsOpen,
  setSearchPanelIsOpen,
  setSearchResult,
} from "../features/searchSlice";

function Main() {
  const items = useSelector(selectItems);
  const activeStock = useSelector(selectActiveStock);
  const addModalIsOpen = useSelector(selectAddModalIsOpen);
  const loading = useSelector(selectLoading);
  const searchPanelIsOpen = useSelector(selectSearchPanelIsOpen);
  const dispatch = useDispatch();
  const history = useHistory();

  const [searchInput, setSearchInput] = useState("");

  const fetchData = async () => {
    db.collection(activeStock.stockName)
      .orderBy("itemName", "asc")
      .onSnapshot(
        (snapshot) => {
          dispatch(
            setItems(
              snapshot.docs.map((doc) => {
                return {
                  id: doc.id,
                  itemName: doc.data().itemName,
                  timestamp: doc.data().timestamp,
                };
              })
            )
          );
        },
        (error) => console.log(error)
      );

    dispatch(setLoading(false));
  };

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
  };

  const removeEmptyCollections = () => {
    db.collection(activeStock.stockName)
      .get()
      .then((querySnapshot) => {
        querySnapshot.docs.forEach(async (doc) => {
          const data = await doc.ref.collection("data").get();
          if (data.empty) {
            doc.ref.delete();
          }
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const search = () => {
    db.collection(activeStock.stockName)
      .get()
      .then((querySnapshot) => {
        let resultArray = querySnapshot.docs.filter(
          (doc) =>
            doc.data().itemName.startsWith(searchInput) && searchInput !== ""
        );
        dispatch(
          setSearchResult(
            resultArray.map((doc) => {
              return { id: doc.id, itemName: doc.data().itemName };
            })
          )
        );
      });
  };

  useEffect(() => {
    search();
  }, [searchInput]);

  useEffect(() => {
    fetchData();
    const timeout = setTimeout(() => {
      removeEmptyCollections();
    }, 500);

    return () => clearTimeout(timeout);
  }, [activeStock]);

  if (loading) {
    return (
      <div className="loading">
        <Loader type="TailSpin" />
      </div>
    );
  } else {
    return (
      <section className="main">
        <div className="container">
          {addModalIsOpen && <AddModal />}
          <div className="main__header">
            <h2>{activeStock.stockName} stock</h2>
            <div className="main__headerSearchBar">
              <input
                className="main__headerSearchInput"
                type="text"
                placeholder="Search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value.toLowerCase())}
                onFocus={() => {
                  dispatch(setSearchPanelIsOpen(true));
                }}
                // onBlur={() => {
                //   dispatch(setSearchPanelIsOpen(false));
                // }}
              />
              <SearchIcon className="main__headerIcon" />
              {searchPanelIsOpen && <SearchResultPanel />}
            </div>
          </div>
          <div className="main__buttons">
            <div className="addBtn">
              <button onClick={() => dispatch(openAddModal())}>
                <AddCircleIcon className="addBtnIcon" /> Add
              </button>
            </div>
          </div>
          <div className="main__items">
            {items.map((item) => {
              const { id, itemName, timestamp } = item;
              return (
                <div
                  key={id}
                  className="item"
                  onClick={() => {
                    setItem(id, itemName);
                  }}
                >
                  <div className="itemNameContainer">
                    <h3 className="itemName"> {itemName} </h3>
                  </div>
                  <p className="item__timestamp">{timestamp}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }
}

export default Main;
