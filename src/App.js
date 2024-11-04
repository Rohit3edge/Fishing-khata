import React, { useState } from 'react';
import './login.css';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Route, Routes, useNavigate, Navigate,useLocation  } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import PublicRoutes from './component/Routes/PublicRoutes.jsx';
import ProtectedRoutes from './component/Routes/ProtectedRoutes.jsx';
import ProtectedRoutesLogIn from './component/Routes/ProtectedRoutesLogIn.jsx';
import { CheckProfile } from './store/slices/auth';
import Cookies from 'js-cookie';

import Home from './component/Home';
import LedgerList from './component/LedgerList.jsx';
import LedgerDetails from './component/LedgerDetails.jsx';
import EditLedger from './component/EditLedger.jsx';

//auth
import AddLedger from './component/AddLedger.jsx';
import Login from './component/Login';
import Settings from './component/Settings/Settings.jsx';
import Notfoundpage from './component/NotFound.jsx';
import AddBankDetails from './component/AddBankDetails.jsx';
import BankBook from './component/BankBook.jsx';
import DepositWithdraw from './component/DepositWithdraw.jsx';
import AddCategory from './component/AddCategory.jsx';
import Categories from './component/Categories.jsx';
import Item from './component/ItemList.jsx';
import AddItem from './component/AddItem.jsx';
import EditItem from './component/itemEdit.jsx';
import PartyMaster from './component/PartyMaster.jsx';
import AddParty from './component/AddParty.jsx';
import EditParty from './component/EditParty.jsx';
import CashBook from './component/CashBook';

import Invoice from './component/Invoice.jsx';
import Invoicepaymentlist from './component/Invoicepaymentlist.jsx';
import AddNewInvoicePayment from './component/AddNewInvoicePayment.jsx';
import InvoiceList from './component/InvoiceList.jsx';
import UpdateAddInvoice from './component/UpdateInvoice.jsx';
import AddCreditNote from './component/AddCreditNote';
import CreditNoteList from './component/CreditNoteList';
import EditCreditNote from './component/EditCreditNote';

// Registers
import Registers from './component/Registers.jsx';
// Directors
import DirectorsList from './component/DirectorsList.jsx';
import DirectorsAdd from './component/DirectorsAdd.jsx';
import DirectorsEdit from './component/DirectorsEdit.jsx';

// Farmer
import ListFarmer from './component/ListFarmer.jsx';
import AddFarmer from './component/AddFarmer.jsx';
import EditFarmer from './component/EditFarmer.jsx';

// Members
import ListMembers from './component/listMembers.jsx';
import AddMembers from './component/AddMembers.jsx';
import EditMembers from './component/EditMembers.jsx';

// Management Cost
import ListManagementCost from './component/ListManagementCost.jsx';

// share applications
import ListShareApplications from './component/ListShareApplications.jsx';
import AddShareApplications from './component/AddShareApplications.jsx';
import EditShareApplications from './component/EditShareApplications.jsx';

import EditInvoicePayment from './component/EditInvoicePayment.jsx';

import DebantureTransfer from './component/DebantureTransfer.jsx';
import DividendRegister from './component/DividendRegister.jsx';
import Loanandguarantee from './component/Loanandguarantee.jsx';

import AddPurchaseOrder from './component/AddPurchaseOrder.jsx';
import PurchaseOrderList from './component/PurchaseOrderList.jsx';
import EditPurchaseOrder from './component/EditPurchaseOrder.jsx';
import PurchaseBillList from './component/PurchaseBillList.jsx';
import AddPurchaseBill from './component/PurchaseVoucher/AddPurchaseBill.jsx';
import EditPurchaseBill from './component/PurchaseVoucher/EditPurchaseBill.jsx';
import AddPaymentOut from './component/AddPaymentOut';
import PaymentOutList from './component/PaymentOutList';
import EditPaymentOut from './component/EditPaymentOut';
import DebitNoteList from './component/DebitNoteList';
import AddDebitNote from './component/AddDebitNote';
import EditDebitNote from './component/EditDebitNote';

// share Debenture

import ListShareTransfer from './component/ListShareTransfer.jsx';
import EditShareTransfer from './component/EditShareTransfer.jsx';

// Company Ducuments
import CompanyDucuments from './component/CompanyDucuments.jsx';

// Dividend
import ListDividend from './component/ListDividend.jsx';
import EditDividend from './component/EditDividend.jsx';

// Loans
import ListLoans from './component/ListLoans.jsx';
import EditLoans from './component/EditLoans.jsx';

import Journal from './component/Journal';
import JournalList from './component/JournalList';
import EditJournal from './component/EditJournal';

// Quotation
import ListQuotation from './component/ListQuotation.jsx';
import AddQuotation from './component/AddQuotation.jsx';
import UpdateQuotation from './component/UpdateQuotation.jsx';

// ReportsSection

import ReportsSection from './component/Reports/ReportsSection.jsx';
import StockSummary from './component/Reports/StockSummary.jsx';
import TrialBalance from './component/Reports/TrialBalance.jsx';
import ProfitAndLoss from './component/Reports/ProfitAndLoss.jsx';
import AuditLogs from './component/Reports/AuditLogs.jsx';

import AddUserDetails from './component/AddUserDetails/AddUserDetails.jsx';
import CompanyDocuments from './component/AddUserDetails/CompanyDocuments.jsx';
import UpdateSettings from './component/AddUserDetails/UpdateSettings.jsx';


import LandingPage from "./component/LandingPage.jsx"

function App() {
  const [auth, setAuth] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  React.useEffect(() => {
    const user = Cookies.get('user');
    const currentPath = location.pathname;
    if (!user) {
      if (currentPath !== '/login' && currentPath !== '/home') {
        localStorage.removeItem('user');
        navigate('/home');
      }
    } else {
      try {
        // Safely parse the user data only if it exists
        const userData = JSON.parse(user);
        const ID = userData?.id;

        if (ID) {
          fetchCheckProfile(ID);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        navigate('/home'); // Navigate to login if parsing fails
      }
    }
  }, [window.location.href]);

  const fetchCheckProfile = async (id) => {
    try {
      const data = await dispatch(CheckProfile({ profile_id: id })).unwrap();
      setAuth(data?.user?.status);
      console.log('data?.user?.status', data?.user, data?.user?.status);
    } catch (error) {
      console.log(error.message);
      return false;
    }
  };

  return (
    <>
      <Toaster
        containerStyle={{
          top: 70,
          left: 10,
          right: 10,
        }}
        toastOptions={{
          // Define default options
          className: '',
          duration: 5000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      <Routes>
        {/* ProtectedRoutes */}
        <Route path="/" element={<ProtectedRoutes /> && <ProtectedRoutesLogIn />}>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/ledgerlist" element={<LedgerList />} />
          <Route exact path="/ledgerdetails/:ledgerid" element={<LedgerDetails />} />
          <Route exact path="/edit/ledger/:ledgerId" element={<EditLedger />} />
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

          {/* CashBook */}

          <Route exact path="/cashbook" element={<CashBook />} />

          {/* Sell */}
          <Route exact path="/invoice" element={<Invoice />} />
          <Route exact path="/invoicepaymentlist" element={<Invoicepaymentlist />} />
          <Route exact path="/addnewinvoicepayment" element={<AddNewInvoicePayment />} />
          <Route exact path="/invoicelist" element={<InvoiceList />} />
          <Route exact path="/Updateaddinvoice/:id" element={<UpdateAddInvoice />} />
          <Route exact path="/invoicepayment/edit/:id" element={<EditInvoicePayment />} />
          <Route exact path="/addcreditnote" element={<AddCreditNote />} />
          <Route exact path="/creditnotelist" element={<CreditNoteList />} />
          <Route exact path="/creditnote/edit/:creditid" element={<EditCreditNote />} />

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
          <Route exact path="/members/list" element={<ListMembers />} />
          <Route exact path="/members/create" element={<AddMembers />} />
          <Route exact path="/members/edit/:id" element={<EditMembers />} />

          {/* Management Cost */}
          <Route exact path="/management-cost/list" element={<ListManagementCost />} />

          {/* share-applications */}
          <Route exact path="/share-applications/list" element={<ListShareApplications />} />
          <Route exact path="/share-applications/create" element={<AddShareApplications />} />
          <Route exact path="/share-applications/edit/:id" element={<EditShareApplications />} />

          <Route exact path="/registers/dividendregister" element={<DividendRegister />} />
          <Route exact path="/registers/loanandguarantee" element={<Loanandguarantee />} />

          {/* PurchaseOrder */}
          <Route exact path="/purchase/addpurchaseorder" element={<AddPurchaseOrder />} />
          <Route exact path="/purchase/purchaseorderlist" element={<PurchaseOrderList />} />
          <Route exact path="/purchase/editpurchaseorder/:id" element={<EditPurchaseOrder />} />
          <Route exact path="/purchase/purchasevoucherlist" element={<PurchaseBillList />} />
          <Route exact path="/purchase/addpurchasevoucher" element={<AddPurchaseBill />} />
          <Route exact path="/purchase/editpurchasevoucher/:id" element={<EditPurchaseBill />} />
          <Route exact path="/purchase/addpaymentout" element={<AddPaymentOut />} />
          <Route exact path="/purchase/paymentoutlist" element={<PaymentOutList />} />
          <Route exact path="/purchase/editpaymentout/:id" element={<EditPaymentOut />} />

          <Route exact path="/purchase/debitnotelist" element={<DebitNoteList />} />
          <Route exact path="/purchase/adddebitnote" element={<AddDebitNote />} />
          <Route exact path="/purchase/editdebitnote/:debitid" element={<EditDebitNote />} />

          {/* share-transfer */}
          <Route exact path="/registers/debanturetransfer" element={<DebantureTransfer />} />
          <Route exact path="/share-transfer/list" element={<ListShareTransfer />} />
          <Route exact path="/share-transfer/edit/:id" element={<EditShareTransfer />} />
          {/* Company Ducuments */}
          <Route exact path="/company/ducuments" element={<CompanyDucuments />} />

          {/* Dividend */}
          <Route exact path="/dividend/list" element={<ListDividend />} />
          <Route exact path="/dividend/edit/:id" element={<EditDividend />} />

          {/* Loans */}
          <Route exact path="/loans/list" element={<ListLoans />} />
          <Route exact path="/loans/edit/:id" element={<EditLoans />} />

          {/* Quotation */}
          <Route exact path="/quotation/list" element={<ListQuotation />} />
          <Route exact path="/quotation/create" element={<AddQuotation />} />
          <Route exact path="/quotation/edit/:id" element={<UpdateQuotation />} />

          {/* Journal */}

          <Route exact path="/addjournal" element={<Journal />} />
          <Route exact path="/journallist" element={<JournalList />} />
          <Route exact path="/editjournalvoucher/edit/:journalid" element={<EditJournal />} />

          {/* ReportsSection */}

          <Route exact path="/reportssection" element={<ReportsSection />} />
          <Route exact path="/reports/stocksummary" element={<StockSummary />} />

          <Route exact path="/reports/trialbalance" element={<TrialBalance />} />
          <Route exact path="/reports/profitandloss" element={<ProfitAndLoss />} />
          <Route exact path="/reports/auditlogs" element={<AuditLogs />} />
        </Route>

        {/* Route to restrict access to certain pages if authorized */}
        <Route path="/adduserdetails" element={auth ? <Navigate to="/" /> : <AddUserDetails />} />
        <Route path="/companydocuments" element={auth ? <Navigate to="/" /> : <CompanyDocuments />} />
        <Route path="/addsettings" element={auth ? <Navigate to="/" /> : <UpdateSettings />} />

        {/* PublicRoutes */}
        <Route element={<PublicRoutes />}>
          <Route path="/home" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Fallback for 404 */}
        <Route path="*" element={<Notfoundpage />} />
      </Routes>
    </>
  );
}

export default App;
