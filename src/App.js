import React from "react";
import "./login.css";
import Home from "./component/Home";
import Ledger from "./component/Ledger.jsx";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import PublicRoutes from "./component/Routes/PublicRoutes.jsx";
import ProtectedRoutes from "./component/Routes/ProtectedRoutes.jsx";
//auth
import AddLedger from "./component/AddLedger.jsx";
import Login from "./component/Login";
import Settings from "./component/Settings/Settings.jsx";
import Notfoundpage from "./component/NotFound.jsx";
import AddBankDetails from "./component/AddBankDetails.jsx";
import BankBook from "./component/BankBook.jsx";
import DepositWithdraw from "./component/DepositWithdraw.jsx"

function App() {
  return (
    <Router>
      <Routes>
      {/* ProtectedRoutes */}
        <Route path="/" element={<ProtectedRoutes />}>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/ledger" element={<Ledger />} />
          <Route exact path="/addLedger" element={<AddLedger />} />
          <Route exact path="/settings" element={<Settings />} />
          <Route exact path="/addbank" element={<AddBankDetails />} />
          <Route exact path="/bankbook/:id" element={<BankBook />} />
          <Route exact path="/bankbookEntry" element={<DepositWithdraw />} />
          <Route path="*" element={<Notfoundpage />} />
        </Route>

        {/* PublicRoutes */}
        <Route path="/login" element={<PublicRoutes />}>
          <Route exact path="/login" element={<Login />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
