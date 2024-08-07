import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import store from "./store";
import { AxiosSetup } from "./utils/helpers/api.helpers";
// import "semantic-ui-css/semantic.min.css";

// Bootstrap and jQuery libraries
// import "bootstrap/dist/css/bootstrap.min.css";
import "jquery/dist/jquery.min.js";
// Datatable Modules
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";

AxiosSetup();
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
