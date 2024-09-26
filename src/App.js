import React from "react";
import "./login.css";
import Home from "./component/Home";
import Ledger from "./component/Ledger.jsx";
import {
  BrowserRouter as Router,
  Route,
  Routes,useNavigate,
} from "react-router-dom";
import PublicRoutes from "./component/Routes/PublicRoutes.jsx";
import ProtectedRoutes from "./component/Routes/ProtectedRoutes.jsx";
import Cookies from "js-cookie";
//auth
import AddLedger from "./component/AddLedger.jsx";
import Login from "./component/Login";
import Settings from "./component/Settings/Settings.jsx";
import Notfoundpage from "./component/NotFound.jsx";
import AddBankDetails from "./component/AddBankDetails.jsx";
import BankBook from "./component/BankBook.jsx";
import DepositWithdraw from "./component/DepositWithdraw.jsx"
import AddCategory from "./component/AddCategory.jsx";
import Categories from "./component/Categories.jsx";
import Item from "./component/ItemList.jsx";
import AddItem from "./component/AddItem.jsx"
import EditItem from "./component/itemEdit.jsx"
import PartyMaster from "./component/PartyMaster.jsx";
import AddParty from "./component/AddParty.jsx";
import EditParty from "./component/EditParty.jsx";

import Invoice from "./component/Invoice.jsx";
import Invoicepaymentlist from "./component/Invoicepaymentlist.jsx";
import AddNewInvoicePayment from "./component/AddNewInvoicePayment.jsx"
import InvoiceList from "./component/InvoiceList.jsx";
import UpdateAddInvoice from "./component/UpdateInvoice.jsx";

// Registers
import Registers from "./component/Registers.jsx"
// Directors
import DirectorsList from "./component/DirectorsList.jsx"
import DirectorsAdd from "./component/DirectorsAdd.jsx"
import DirectorsEdit from "./component/DirectorsEdit.jsx"

// Farmer
import  ListFarmer from "./component/ListFarmer.jsx"
import  AddFarmer from "./component/AddFarmer.jsx"
import  EditFarmer from "./component/EditFarmer.jsx"

// Members
import  ListMembers from "./component/listMembers.jsx"
import  AddMembers from "./component/AddMembers.jsx"
import  EditMembers from "./component/EditMembers.jsx"

// Management Cost
import  ListManagementCost from "./component/ListManagementCost.jsx"

// share applications
import  ListShareApplications from "./component/ListShareApplications.jsx"
import  AddShareApplications from "./component/AddShareApplications.jsx"
import  EditShareApplications from "./component/EditShareApplications.jsx"


import EditInvoicePayment from "./component/EditInvoicePayment.jsx"

import DebantureTransfer from "./component/DebantureTransfer.jsx"
import DividendRegister from "./component/DividendRegister.jsx"
import Loanandguarantee from "./component/Loanandguarantee.jsx"

import AddPurchaseOrder from "./component/AddPurchaseOrder.jsx"

// share Debenture

import ListShareTransfer from "./component/ListShareTransfer.jsx"
import EditShareTransfer from "./component/EditShareTransfer.jsx"


// Company Ducuments
import CompanyDucuments from "./component/CompanyDucuments.jsx"

// Dividend
import ListDividend from "./component/ListDividend.jsx"
import EditDividend from "./component/EditDividend.jsx"

// Loans
import ListLoans from "./component/ListLoans.jsx"
import EditLoans from "./component/EditLoans.jsx"








function App() {

  const navigate = useNavigate();

  React.useEffect(() => {
    console.log("load")
    const user = Cookies.get("user");

    if (!user) {
      localStorage.removeItem("user");
      navigate("/login");
    }
  }, [window.location.href]);


  return (
    
      <Routes>
      {/* ProtectedRoutes */}
        <Route path="/" element={<ProtectedRoutes />}>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/ledger" element={<Ledger />} />
          <Route exact path="/addLedger" element={<AddLedger />} />
          <Route exact path="/settings" element={<Settings />} />
          <Route exact path="/addbank" element={<AddBankDetails />} />
          <Route exact path="/bankbook/:id" element={<BankBook />} />
          <Route exact path="/bankbookEntry/:id" element={<DepositWithdraw />} />
          <Route exact path="/addcategory" element={<AddCategory />} />
          <Route exact path="/categories" element={<Categories />} />
          <Route exact path="/item" element={<Item />} />
          <Route exact path="/add-item" element={<AddItem />} />
          <Route exact path="/edit-item/:id" element={<EditItem />} />
          <Route exact path="/partymaster" element={<PartyMaster />} />
          <Route exact path="/addparty" element={<AddParty />} />
          <Route exact path="/editparty/:id" element={<EditParty />} />
          <Route exact path="/invoice" element={<Invoice />} />
          <Route exact path="/invoicepaymentlist" element={<Invoicepaymentlist />} />
          <Route exact path="/addnewinvoicepayment" element={<AddNewInvoicePayment />} />
          <Route exact path="/invoicelist" element={<InvoiceList />} />
          <Route exact path="/Updateaddinvoice/:id" element={<UpdateAddInvoice />} />
          <Route exact path="/invoicepayment/edit/:id" element={<EditInvoicePayment/>} />

          {/* registers */}
          <Route exact path="/registers" element={<Registers />} />
            {/*directors  */}
            <Route exact path="/directors/list" element={<DirectorsList />} />
            <Route exact path="/director/create" element={<DirectorsAdd />} />
            <Route exact path="/director/edit/:id" element={<DirectorsEdit />} />

            {/* Farmer */}
            <Route exact path="/farmer/list" element={<ListFarmer />} />
            <Route exact path="/farmer/create" element={<AddFarmer />} />
            <Route exact path="/farmer/edit/:id" element={<EditFarmer />} />

            {/* Merbers */}
            <Route exact path="/members/list" element={<ListMembers/>} />
            <Route exact path="/members/create" element={<AddMembers/>} />
            <Route exact path="/members/edit/:id" element={<EditMembers/>} />

            {/* Management Cost */}
            <Route exact path="/management-cost/list" element={<ListManagementCost/>} />

            {/* share-applications */}
            <Route exact path="/share-applications/list" element={<ListShareApplications/>} />
            <Route exact path="/share-applications/create" element={<AddShareApplications/>} />
            <Route exact path="/share-applications/edit/:id" element={<EditShareApplications/>} />

            
            <Route exact path="/registers/dividendregister" element={<DividendRegister/>} />
            <Route exact path="/registers/loanandguarantee" element={<Loanandguarantee/>} />

            {/* PurchaseOrder */}
            <Route exact path="/purchase/addpurchaseorder" element={<AddPurchaseOrder/>} />            {/* share-transfer */}
            <Route exact path="/registers/debanturetransfer" element={<DebantureTransfer/>} />
            <Route exact path="/share-transfer/list" element={<ListShareTransfer/>} />
            <Route exact path="/share-transfer/edit/:id" element={<EditShareTransfer/>} /> 
            {/* Company Ducuments */} 
            <Route exact path="/company/ducuments" element={<CompanyDucuments/>} />

            {/* Dividend */}
            <Route exact path="/dividend/list" element={<ListDividend/>} />
            <Route exact path="/dividend/edit/:id" element={<EditDividend/>} />

            {/* Loans */}
            <Route exact path="/loans/list" element={<ListLoans/>} />
            <Route exact path="/loans/edit/:id" element={<EditLoans/>} />






            <Route path="*" element={<Notfoundpage />} />
        </Route>

        {/* PublicRoutes */}
        <Route path="/login" element={<PublicRoutes />}>
          <Route exact path="/login" element={<Login />} />
        </Route>
      </Routes>
  );
}

export default App;
