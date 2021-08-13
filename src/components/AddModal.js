// react imports
import React, { useState } from "react";

// material ui imports
import CloseIcon from "@material-ui/icons/Close";

// react hook form imports
import { useForm } from "react-hook-form";

// firebase imports
import { db } from "./firebase";

// css imports
import "./AddModal.css";

// redux imports
import { useDispatch, useSelector } from "react-redux";
import { selectActiveStock } from "../features/stockSlice";
import { closeAddModal } from "../features/addModalSlice";
import { setSnackbar } from "../features/appSlice";

function AddModal() {
  const dispatch = useDispatch();

  const activeStock = useSelector(selectActiveStock);

  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (formData) => {
    const { itemName, itemCount } = formData;
    const data = {
      itemName: itemName.trim().toLowerCase(),
      itemData: {
        itemCount: parseInt(itemCount),
        date: {
          month,
          year,
        },
      },
    };
    handleAddingData(data);
  };

  const handleAddingData = async (data) => {
    const stockRef = db.collection(activeStock.stockName);
    const itemNameQuery = stockRef.where("itemName", "==", data.itemName);
    const itemNameQuerySnapshot = await itemNameQuery.get();
    if (itemNameQuerySnapshot.empty) {
      addNewItemToDb(stockRef, data.itemName, data.itemData);
    } else {
      const colec = itemNameQuerySnapshot.docs[0].ref.collection("data");
      const { month, year } = data.itemData.date;
      const dateQuery = await colec
        .where("date.month", "==", month)
        .where("date.year", "==", year);
      const dateQuerySnapshot = await dateQuery.get();
      if (dateQuerySnapshot.empty) {
        addExistedItemToDb(colec, data.itemData);
      } else {
        const oldItemCount = dateQuerySnapshot.docs[0].data().itemCount;
        updateExistedItemCount(
          dateQuerySnapshot,
          oldItemCount,
          data.itemData.itemCount
        );
      }
    }
  };

  const addNewItemToDb = async (mainColecRef, itemName, itemData) => {
    let createdDocRef = null;
    await mainColecRef
      .add({ itemName, timestamp: new Date().toLocaleString() })
      .then((docRef) => {
        createdDocRef = docRef.id;
      })
      .catch((error) => {
        console.log(error);
      });

    await mainColecRef
      .doc(createdDocRef)
      .collection("data")
      .add({
        ...itemData,
        timestamp: new Date().toLocaleString(),
      })
      .then((docRef) => {
        reset();
        setMonth("");
        setYear("");
        dispatch(closeAddModal());
        dispatch(
          setSnackbar({
            isSnackbarOpen: true,
            message: `Added ${itemName} successfuly!`,
            type: "success",
          })
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const addExistedItemToDb = async (colecRef, itemData) => {
    await colecRef
      .add({ ...itemData, timestamp: new Date().toLocaleString() })
      .then((docRef) => {
        reset();
        setMonth("");
        setYear("");
        dispatch(closeAddModal());
        dispatch(
          setSnackbar({
            isSnackbarOpen: true,
            message: "Updated item successfuly!",
            type: "success",
          })
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const updateExistedItemCount = async (
    dateQuerySnapshot,
    oldItemCount,
    newCount
  ) => {
    await dateQuerySnapshot.docs[0].ref
      .update({
        itemCount: oldItemCount + newCount,
        timestamp: new Date().toLocaleString(),
      })
      .then((docRef) => {
        dispatch(
          setSnackbar({
            isSnackbarOpen: true,
            message: "Updated successfuly!",
            type: "success",
          })
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

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

  return (
    <div className="addModal">
      <div className="addModal__container">
        <div className="modal__header">
          <h3> Add new item </h3>
          <button
            className="modal__closeBtn"
            onClick={() => dispatch(closeAddModal())}
          >
            <CloseIcon />
          </button>
        </div>
        <div className="modal__content">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="name__input">
              <input
                type="text"
                placeholder="Enter Item name"
                className="modal__contentInput"
                autoFocus
                onClick={(e) => e.target.select()}
                {...register("itemName", {
                  required: true,
                })}
              />
            </div>
            <div className="date__input">
              <input
                required
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
            <div className="count__input">
              <input
                type="number"
                className="modal__contentInput number"
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
            <button
              type="submit"
              onClick={() =>
                dispatch(
                  setSnackbar({
                    isSnackbarOpen: true,
                    message: "Added new item successfuly!",
                    type: "success",
                  })
                )
              }
            >
              Add
            </button>
            {errors.itemName && <p> Item name required </p>}
            {errors.itemDate && <p> Item date required </p>}
            {errors.itemCount && <p> Item count required </p>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddModal;
