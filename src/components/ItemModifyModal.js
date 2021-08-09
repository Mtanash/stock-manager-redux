import React from "react";
import "./ItemModifyModal.css";
import CloseIcon from "@material-ui/icons/Close";
import { useMainContext } from "../context/context";
// react hook form imports
import { useForm } from "react-hook-form";

function ItemModifyModal() {
  const { closeItemModifyModal, setModifyAmount } = useMainContext();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (formData) => {
    setModifyAmount(formData.amount);

    closeItemModifyModal();
    reset();
  };
  return (
    <div className="itemModifyModal">
      <div className="itemModifyModal__container">
        <div className="itemModifyModal__header">
          <h3> Modify item </h3>
          <button
            className="itemModifyModal__closeBtn"
            onClick={() => closeItemModifyModal()}
          >
            <CloseIcon />
          </button>
        </div>

        <div className="itemModifyModal__content">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="itemModifyModal__inputContainer">
              <input
                type="number"
                autoFocus
                min="1"
                className="itemModifyModal__input"
                placeholder="Amount"
                onClick={(e) => e.target.select()}
                {...register(
                  "amount",
                  {
                    required: true,
                  },
                  {
                    min: 1,
                  }
                )}
              />
            </div>
            <button type="submit" className="itemModifyModal__modifyBtn">
              Modify
            </button>
            {errors.amount && <p> Item amount required </p>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default ItemModifyModal;
