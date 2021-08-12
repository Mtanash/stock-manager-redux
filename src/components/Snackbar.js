import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectSnackbar, setSnackbar } from "../features/appSlice";
import "./Snackbar.css";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import WarningIcon from "@material-ui/icons/Warning";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";

function Snackbar() {
  const { isSnackbarOpen, message, type } = useSelector(selectSnackbar);
  const dispatch = useDispatch();

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(
        setSnackbar({
          isSnackbarOpen: false,
          message: "",
        })
      );
    }, 3000);

    return () => clearTimeout(timeout);
  });

  return (
    <React.Fragment>
      {isSnackbarOpen && (
        <div
          className={`snackbar ${
            type === "success"
              ? "success"
              : type === "error"
              ? "error"
              : type === "warning"
              ? "warning"
              : type === "info"
              ? "info"
              : null
          } `}
        >
          {type === "success" ? (
            <DoneAllIcon />
          ) : type === "warning" ? (
            <WarningIcon />
          ) : type === "error" ? (
            <ErrorOutlineIcon />
          ) : type === "info" ? (
            <InfoOutlinedIcon />
          ) : null}
          <p className="snackbar__message">{message}</p>
        </div>
      )}
    </React.Fragment>
  );
}

export default Snackbar;
