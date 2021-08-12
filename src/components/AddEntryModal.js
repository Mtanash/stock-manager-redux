// react imports
import React, { useState } from "react";

// redux import
import { useDispatch, useSelector } from "react-redux";
import {
  selectCurrentItem,
  setAddEntryModalIsOpen,
} from "../features/itemSlice";
import { selectActiveStock } from "../features/stockSlice";
import { setSnackbar } from "../features/appSlice";

// css imports
import "./AddEntryModal.css";

// material ui imports
import CloseIcon from "@material-ui/icons/Close";

// react hook form imports
import { useForm } from "react-hook-form";

// firebase imports
import { db } from "./firebase";

function AddEntryModal() {
  const activeStock = useSelector(selectActiveStock);
  const { itemId } = useSelector(selectCurrentItem);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const handleMonth = (e) => {
    const newValue = e.target.value;
    if (newValue > 12) {
      setMonth("12");
    } else if (newValue < 1) {
      setMonth("1");
    } else {
      setMonth(newValue.toString());
    }
  };

  const handleYear = (e) => {
    const newValue = e.target.value;
    setYear(newValue.toString());
  };

  const onSubmit = async (formData) => {
    const colecRef = db
      .collection(activeStock.stockName)
      .doc(itemId)
      .collection("data");
    const query = colecRef
      .where("date.month", "==", month)
      .where("date.year", "==", year);
    const queryData = await query.get();
    if (queryData.empty) {
      colecRef
        .add({
          itemCount: formData.itemCount,
          date: {
            month,
            year,
          },
          timestamp: new Date().toLocaleString(),
        })
        .then(() => {
          reset();
          setMonth("");
          setYear("");
          dispatch(setAddEntryModalIsOpen(false));
          dispatch(
            setSnackbar({
              isSnackbarOpen: true,
              message: "Added new date successfuly",
              type: "success",
            })
          );
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      reset();
      setMonth("");
      setYear("");
      dispatch(setAddEntryModalIsOpen(false));
      alert("Date already exist!");
    }
  };

  return (
    <div className="addEntryModal">
      <div className="addEntryModal__container">
        <div className="addEntryModal__header">
          <h3> Add new date </h3>
          <button
            className="addEntryModal__closeBtn"
            onClick={() => dispatch(setAddEntryModalIsOpen(false))}
          >
            <CloseIcon />
          </button>
        </div>

        <div className="addEntryModal__content">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="addEntryModal__dateInput">
              <input
                required
                autoFocus
                type="number"
                min="1"
                placeholder="Mo"
                max="12"
                value={month}
                onClick={(e) => e.target.select()}
                onChange={handleMonth}
              />
              <input
                required
                type="number"
                min="1"
                max="9999"
                placeholder="Year"
                onClick={(e) => e.target.select()}
                value={year}
                onChange={handleYear}
              />
            </div>
            <div className="addEntryModal__countInput">
              <input
                type="number"
                placeholder="Count"
                onClick={(e) => e.target.select()}
                {...register(
                  "itemCount",
                  {
                    required: true,
                  },
                  {
                    min: 1,
                  }
                )}
              />
            </div>
            <button type="submit"> Add </button>
            {errors.itemCount && <p> Item count required </p>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddEntryModal;
