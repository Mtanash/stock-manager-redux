// react imports
import React, { useState } from "react";

// css imports
import "./Modal.css";

// material ui imports
import CloseIcon from "@material-ui/icons/Close";

// redux imports
import { useDispatch, useSelector } from "react-redux";
import {
  selectInfoOfItemToBeModified,
  selectModifyAction,
  setModalIsOpen,
} from "../features/itemSlice";
import { selectActiveStock } from "../features/stockSlice";

// firebase imports
import { db } from "./firebase";
import firebase from "firebase";

function Modal() {
  const activeStock = useSelector(selectActiveStock);
  const { dateId, itemId } = useSelector(selectInfoOfItemToBeModified);
  const modifyAction = useSelector(selectModifyAction);

  const dispatch = useDispatch();

  const [amount, setAmount] = useState("");

  const addAmountToItem = (itemId, dateId, amount) => {
    const amountInInt = parseInt(amount);
    db.collection(activeStock.stockName)
      .doc(itemId)
      .collection("data")
      .doc(dateId)
      .update({
        itemCount: firebase.firestore.FieldValue.increment(amountInInt),
      })
      .then(() => {
        // do something after update
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const subtractAmountFromItem = (itemId, dateId, amount) => {
    const amountInInt = parseInt(amount);
    const docRef = db
      .collection(activeStock.stockName)
      .doc(itemId)
      .collection("data")
      .doc(dateId);
    docRef
      .update({
        itemCount: firebase.firestore.FieldValue.increment(-amountInInt),
      })
      .then(async () => {
        // do something after update
        const count = await docRef.get().then((docs) => docs.data().itemCount);
        if (count < 1) {
          docRef
            .delete()
            .then(() => {})
            .catch((error) => {
              console.log(error);
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modifyAction === "ADD") {
      addAmountToItem(itemId, dateId, amount);
    } else if (modifyAction === "SUBTRACT") {
      subtractAmountFromItem(itemId, dateId, amount);
    } else {
      console.error(new Error("no modify action is recognized"));
      return;
    }
    dispatch(setModalIsOpen(false));
    setAmount("");
  };

  return (
    <div className="modal">
      <div className="modal__container">
        <div className="modal__header">
          {modifyAction === "ADD" && <h3>Add</h3>}
          {modifyAction === "SUBTRACT" && <h3>Subtract</h3>}

          <button
            className="modal__closeBtn"
            onClick={() => dispatch(setModalIsOpen(false))}
          >
            <CloseIcon />
          </button>
        </div>

        <div className="modal__content">
          <form className="modal__form" onSubmit={handleSubmit}>
            <label htmlFor="num">Enter value</label>
            <input
              className="modal__formInput"
              id="num"
              type="number"
              min="1"
              autoFocus
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <button className="formBtn" type="submit">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Modal;
