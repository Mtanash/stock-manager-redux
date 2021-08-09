// css imports
import "./App.css";

// modules imports
import Header from "./Header";
import Sidebar from "./Sidebar";
import Main from "./Main";
import Item from "./Item";

// react router imports
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// redux imports
import { useSelector } from "react-redux";
import { selectStocks } from "../features/stockSlice";
import { selectLoading } from "../features/appSlice";

function App() {
  const loading = useSelector(selectLoading);
  const stocks = useSelector(selectStocks);

  if (loading) {
    return (
      <div className="laoding">
        <h1>Loading....</h1>
      </div>
    );
  } else {
    if (stocks.length === 0) {
      return <div>add stocks modal</div>;
    } else {
      return (
        <Router>
          <div className="app">
            <Header />
            <div className="app__body">
              <Sidebar />
              <Switch>
                <Route exact path="/">
                  <Main />
                </Route>
                <Route path="/item">
                  <Item />
                </Route>
              </Switch>
            </div>
          </div>
        </Router>
      );
    }
  }
}

export default App;
