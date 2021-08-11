// react imports
import React, { useEffect, useState } from "react";

// modules imports
import Modal from "./Modal";
import AddEntryModal from "./AddEntryModal";

// redux imports
import { useDispatch, useSelector } from "react-redux";
import {
  selectAddEntryModalIsOpen,
  selectCurrentItem,
  selectModalIsOpen,
  setAddEntryModalIsOpen,
  setInfoOfItemToBeModified,
  setModalIsOpen,
  setModifyAction,
} from "../features/itemSlice";
import { selectActiveStock } from "../features/stockSlice";

// css imports
import "./Item.css";

// material ui imports
import DoubleArrowIcon from "@material-ui/icons/DoubleArrow";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";

// firebase imports
import { db } from "./firebase";

function Item() {
  const { itemName, itemId, data } = useSelector(selectCurrentItem);
  const activeStock = useSelector(selectActiveStock);
  const modalIsOpen = useSelector(selectModalIsOpen);
  const AddEntryModalIsOpen = useSelector(selectAddEntryModalIsOpen);

  const [totalCount, setTotalCount] = useState(12);

  const dispatch = useDispatch();

  const deleteItem = (dateId) => {
    db.collection(activeStock.stockName)
      .doc(itemId)
      .collection("data")
      .doc(dateId)
      .delete()
      .catch((error) => {
        console.log(error);
      });
  };

  const getTotalCount = () => {
    setTotalCount(0);
    let total = 0;
    if (data) {
      data.forEach((dataPiece) => {
        total += parseInt(dataPiece.itemCount);
      });
    } else {
      total = 0;
    }
    setTotalCount(total);
  };

  useEffect(() => {
    getTotalCount();
  }, [data]);

  return (
    <div className="itemPreview">
      {modalIsOpen && <Modal />}
      {AddEntryModalIsOpen && <AddEntryModal />}
      <h2 className="item__name">{itemName}</h2>
      {data && (
        <>
          <button
            className="itemPreview__addEntryBtn"
            onClick={() => dispatch(setAddEntryModalIsOpen(true))}
          >
            Add new entry in <span>{itemName}</span>
          </button>
          {totalCount > 0 && (
            <p className="itemPreview__totalCount">
              Total {itemName} amount : {totalCount}
            </p>
          )}
        </>
      )}
      <div className="item__data">
        {data?.map((dataPiece) => {
          const {
            id,
            itemCount,
            date: { month, year },
            timestamp,
          } = dataPiece;
          return (
            <div key={id} className="item__dateContainer">
              <div className="item__info">
                <p className="item__count">{itemCount}</p>
                <DoubleArrowIcon />
                <p className="item__date">
                  {month}/{year}
                </p>
              </div>

              <div className="item__timestamp">
                <p>{timestamp}</p>
              </div>

              <div className="item__buttons">
                <div className="item__subtract">
                  <button
                    className="item__subtractBtn"
                    onClick={() => {
                      dispatch(
                        setInfoOfItemToBeModified({ dateId: id, itemId })
                      );
                      dispatch(setModifyAction("SUBTRACT"));
                      dispatch(setModalIsOpen(true));
                    }}
                  >
                    <RemoveIcon />
                  </button>
                </div>

                <div className="item__add">
                  <button
                    className="item__addBtn btn-sep"
                    onClick={() => {
                      dispatch(
                        setInfoOfItemToBeModified({ dateId: id, itemId })
                      );
                      dispatch(setModifyAction("ADD"));
                      dispatch(setModalIsOpen(true));
                    }}
                  >
                    <AddIcon />
                  </button>
                </div>

                <div className="item__delete">
                  <button
                    className="item__deleteBtn"
                    onClick={() => deleteItem(id)}
                  >
                    <DeleteIcon />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Item;
