// react imports
import React, { useState } from "react";

// material ui imports
import { Button } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";

// css imports
import "./Sidebar.css";

// redux imports
import { useDispatch, useSelector } from "react-redux";
import {
  selectActiveStock,
  selectStocks,
  setActiveStock,
} from "../features/stockSlice";

function Sidebar() {
  const [showSidebar, setShowSidebar] = useState(false);
  const activeStock = useSelector(selectActiveStock);
  const stocks = useSelector(selectStocks);
  const dispatch = useDispatch();

  return (
    <div className={`sidebar ${showSidebar && "sidebar--open"}`}>
      <div className="sidebar__header">
        <div className="icon">
          <Button
            className="header__btn"
            onClick={() => setShowSidebar(!showSidebar)}
          >
            <MenuIcon />
          </Button>
        </div>
      </div>
      <div className="sidebar__content">
        {showSidebar && (
          <div>
            {stocks.map((stock) => {
              const { id, stockName } = stock;
              return (
                <div
                  key={id}
                  className={`sidebar__stockName ${
                    activeStock?.id === id && "active"
                  }`}
                  onClick={() => {
                    if (activeStock.id === id) {
                      return;
                    } else {
                      dispatch(setActiveStock({ id, stockName }));
                    }
                  }}
                >
                  <h4>{stockName}</h4>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
