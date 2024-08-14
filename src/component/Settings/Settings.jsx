import React, { useState } from "react";
import Navbarside from "../Navbarside";
import { useDispatch, useSelector } from "react-redux";
import { Getsettings,Updatesettings} from "../../store/slices/settings";
import { FaEdit } from "react-icons/fa";
import { BsFillInfoCircleFill } from "react-icons/bs";
import { updateSettingsField } from "../../store/slices/settings";
import Invoice from "./Invoice";
import TaxesGst from "./TaxesGst";
import SettingsItem from "./SettingsItem";
import Footer from "../Footer";
const Settings = () => {
  const dispatch = useDispatch();
  const setting = useSelector((state) => state.settings.updatesettings);
  // const { data, loading, error } = useSelector((state) => state.settings);

  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState();
  const [roundOff, setRoundOff] = useState(settings?.default_roundoff==0);
  const [upiQR, setUpiQR] = useState(settings?.bank_upi_qrcode==0);
  const [bankAccount, setbankAccount] = useState(settings?.bank_account_details==0);

  console.log("setnijnjknkn",setting)
  console.log("kya hai ye ",roundOff)
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  React.useEffect(() => {
    dispatch(Getsettings())
      .unwrap()
      .then((data) => {
        console.log(data.data);
        setSettings(data.data)
        console.log(settings?.default_currency);
      })
      .catch(({ message }) => {
        alert(message);
      });
  }, [dispatch]);

  
  React.useEffect(() => {
    if (settings?.default_roundoff !== undefined) {
      setRoundOff(settings?.default_roundoff == 0);   
    }  
    if (settings?.bank_upi_qrcode !== undefined) {
      setUpiQR(settings?.bank_upi_qrcode == 0);   
    } 
    if (settings?.bank_account_details !== undefined) {
      setbankAccount(settings?.bank_account_details == 0);   
    } 
  }, [settings]);

 

async function Updatesettings() {
  try {
    const data = await dispatch(Updatesettings(setting)).unwrap();
    console.log("new data", data);
  } catch (error) {
    console.error("An error occurred while updating settings:", error.message);
  }
}

  return (
    <div clssName="container-fluid">
      <div class="row" style={{ marginLeft: "0", marginRight: "0" }}>
        <Navbarside />
        <div className="col-md-10">
          <div className="row top-header">
            <div className="col-md-7">
              <div className="company-name">
                THE KOSLI FARMER CO-OP MULTIPURPOSE SOCIETY LTD
              </div>
            </div>
            <div className="col-md-5">
              <div className="d-flex justify-content-end">
                <button type="submit" className="btn btn-default">
                  Ledger
                </button>
                <button type="submit" className="btn btn-default">
                  Sale
                </button>
                <button type="submit" className="btn btn-default">
                  Purchase
                </button>
              </div>
            </div>
          </div>
          <div className="row content-body">
            <div className="container-fluid">
              <div className="page-header">
                <div>
                  <h2 class="main-content-title tx-24 mg-b-5">Settings</h2>
                  <ol class="breadcrumb">
                    <li class="breadcrumb-item">
                      <a href="#">Home</a>
                    </li>
                    <li class="breadcrumb-item active" aria-current="page">
                    Settings
                    </li>
                  </ol>
                </div>
                <div class="d-flex justify-content-end">
                  <button onClick={()=>Updatesettings()} class="btn ripple btn-default" type="button">Save</button>
                </div>
              </div>

              <div class="row">
                <div class="col-md-12">
                  <div class="card custom-card">
                    <div class="card-body p-2">
                    <div className="settings-section">
                    
                    <ul className="nav nav-tabs">
                      <li className="nav-item ">
                        <button
                          className={`nav-link  ${
                            activeTab === "General" ? "active" : ""
                          }`}
                          onClick={() => handleTabClick("General")}
                        >
                          General
                        </button>
                      </li>
                      <li className="nav-item settings-tab ">
                        <button
                          className={`nav-link ${
                            activeTab === "Account" ? "active" : ""
                          }`}
                          onClick={() => handleTabClick("Account")}
                        >
                          Bank Details
                        </button>
                      </li>
                      <li className="nav-item">
                        <button
                          className={`nav-link ${
                            activeTab === "Invoice" ? "active" : ""
                          }`}
                          onClick={() => handleTabClick("Invoice")}
                        >
                          Invoice
                        </button>
                      </li>
                      <li className="nav-item">
                        <button
                          className={`nav-link ${
                            activeTab === "Items" ? "active" : ""
                          }`}
                          onClick={() => handleTabClick("Items")}
                        >
                          Items
                        </button>
                      </li>
                      <li className="nav-item">
                        <button
                          className={`nav-link ${
                            activeTab === "TaxesGST" ? "active" : ""
                          }`}
                          onClick={() => handleTabClick("TaxesGST")}
                        >
                          Taxes & GST
                        </button>
                      </li>
                    
                    </ul>

                    
                    <div className="tab-content">
                      {activeTab === "general" && (
                        <div>
                          
                          <div className="row pt-2">
                            <div className="col-md-6 col-sm-12">
                              <h4 className="font-weight-bold">Firm : <span className="font-weight-normal">3 Edge Technologies</span></h4> 
                            
                            
                              
                              <div className="border-bottom pb-2">
                                <div className="form-group mt-3">
                                  <div className="d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center">
                                      <span className="">
                                        Round Off Total
                                      </span>
                                      <i
                                        className="glyphicon glyphicon-info-sign ml-2"
                                        title="When you do not want any decimal value of transaction, enable round off."
                                      ></i>
                                    </div>
                                    <div className="form-check form-switch pb-4">
                                      <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={roundOff}
                                        onChange={(e) =>{ setRoundOff(e.target.checked); dispatch(updateSettingsField({ default_roundoff: e.target.checked}))}}
                                        style={{
                                          width: "20px",
                                          height: "20px",
                                        }}
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* <div className="form-group mt-3">
                                  <div className="d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center">
                                      <span className="">Decimal Amount</span>
                                      <i
                                        className="glyphicon glyphicon-info-sign ml-2"
                                        title="Specify the number of digits after decimal for amounts. Amounts will be printed with this decimal places."
                                      ></i>
                                    </div>
                                    <div className="d-flex align-items-center">
                                      <span className="mr-2">
                                        e.g. 0,000.00
                                      </span>
                                      <select
                                        className="form-control"
                                        style={{
                                          fontSize: "12px",
                                          height: "25px",
                                          width: "60px",
                                        }}
                                      >
                                        <option value="1">1</option>
                                        <option value="2" selected>
                                          2
                                        </option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                      </select>
                                    </div>
                                  </div>
                                </div> */}

                                <div className="form-group mt-3">
                                  <div className="d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center">
                                      <span className="">Currency</span>
                                      <i
                                        className="glyphicon glyphicon-info-sign ml-2"
                                        title="Select your currency symbol that will be printed on all your transactions."
                                      ></i>
                                    </div>
                                    <div>
                                      <select
                                        className="form-control"
                                        style={{
                                          fontSize: "12px",
                                          height: "25px",
                                          width: "60px",
                                        }}
                                        value={ !setting.default_currency?settings?.default_currency:setting.default_currency}
                                        onChange={(e)=> dispatch(updateSettingsField({ default_currency: e.target.value }))}
                                      >
                                        <option value="₹" selected>
                                          ₹
                                        </option>
                                        <option value="$">$</option>
                                        <option value="€">€</option>
                                        <option value="£">£</option>
                                        <option value="¥">¥</option>
                                      </select>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {activeTab === "Account" && (
                        <div>
                          <div className="row">
                            <div className="col-md-12 col-sm-12 pt-1">
                              <h3>Bank Details</h3>
                            </div>
                          </div>
                          <div className="row pt-1">
                            <div className="col-md-6 col-sm-12 ">
                              {/* Bank Details Section */}
                              <div className="form-group mt-4">
                                <div className="d-flex justify-content-between align-items-center">
                                
                                  <div className="d-flex align-items-center">
                                  <div className="form-check form-switch pb-3">
                                    <input
                                      className="form-check-input "
                                      type="checkbox"
                                      checked={upiQR}
                                        onChange={(e) =>{ setUpiQR(e.target.checked); dispatch(updateSettingsField({ bank_upi_qrcode: e.target.checked}))}}
                                    />
                                  </div>
                                    <span className="font-weight-bold">
                                      Print UPI QR Code on invoice{" "}
                                      <BsFillInfoCircleFill />
                                    </span>
                                    <i
                                      className="glyphicon glyphicon-info-sign ml-2"
                                      title="Enables you to send QR Code on your invoices to customers and allows your customer to make the payment via UPI Apps."
                                    ></i>
                                  </div>
                                  
                                </div>
                              </div>

                              {/* Bank Account Details Setting */}
                              <div className="form-group mt-3">
                                <div className="d-flex justify-content-between align-items-center">
                                  <div className="d-flex align-items-center">
                                  <div className="form-check form-switch pb-3">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      checked={bankAccount}
                                      onChange={(e) =>{ setbankAccount(e.target.checked);dispatch(updateSettingsField({ bank_account_details: e.target.checked}))}}
                                    />
                                  </div>
                                    <span className="font-weight-bold">
                                      Print this Bank Account Details on
                                      invoices <BsFillInfoCircleFill />
                                    </span>
                                    <i
                                      className="glyphicon glyphicon-info-sign ml-2"
                                      title="This Bank Account Details will be printed on the invoices, your customer can pay via NEFT, RTGS."
                                    ></i>
                                  </div>
                                  
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-sm-12 ">
                              <h4 className="font-weight-bold">Manage Companie Bank Detail</h4>
                              
                                <div className="panel panel-default mt-3">
                                 
                                  <div className="panel-body">

                                    {/* Account Holder Name and Bank Name */}
                                    <div className="row">
                                      <div className="col-md-6">
                                        <div className="form-group">
                                          <label
                                            htmlFor="accountHolderName"
                                            className="font-weight-normal"
                                          >
                                            Account Holder Name
                                          </label>
                                          <input
                                            type="text"
                                            className="form-control mt-1"
                                            placeholder="Enter Account Holder Name"
                                            style={{height: "30px"}}
                                            onChange={(e)=>{dispatch(updateSettingsField({ acc_name: e.target.value}))}}
                                          />
                                        </div>
                                      </div>
                                      <div className="col-md-6">
                                        <div className="form-group">
                                          <label
                                            htmlFor="bankName"
                                            className="font-weight-normal"
                                          >
                                            Bank Name
                                          </label>
                                          <input
                                            type="text"
                                            id="bankName"
                                            className="form-control mt-1"
                                            placeholder="Enter Bank Name"
                                            style={{height: "30px"}}
                                            onChange={(e)=>{dispatch(updateSettingsField({ bank_name: e.target.value}))}}
                                          />
                                        </div>
                                      </div>
                                    </div>

                                    {/* Account Number and IFSC Code */}
                                    <div className="row">
                                      <div className="col-md-6">
                                        <div className="form-group">
                                          <label
                                            htmlFor="accountNumber"
                                            className="font-weight-normal"
                                          >
                                            Account Number
                                          </label>
                                          <input
                                            type="text"
                                            id="accountNumber"
                                            className="form-control mt-1"
                                            placeholder="Enter Account Number"
                                            style={{height: "30px"}}
                                            onChange={(e)=>{dispatch(updateSettingsField({ acc_number: e.target.value}))}}
                                          />
                                        </div>
                                      </div>
                                      <div className="col-md-6">
                                        <div className="form-group">
                                          <label
                                            htmlFor="ifscCode"
                                            className="font-weight-normal"
                                          >
                                            IFSC Code
                                          </label>
                                          <input
                                            type="text"
                                            id="ifscCode"
                                            className="form-control mt-1"
                                            placeholder="Enter IFSC Code"
                                            style={{height: "30px"}}
                                            onChange={(e)=>{dispatch(updateSettingsField({ acc_ifsc: e.target.value}))}}
                                          />
                                        </div>
                                      </div>
                                    </div>

                                    {/* UPI ID */}
                                    <div className="row">
                                      <div className="col-md-6">
                                        <div className="form-group">
                                          <label
                                            htmlFor="upiId"
                                            className="font-weight-normal"
                                          >
                                            UPI ID
                                          </label>
                                          <input
                                            type="text"
                                            placeholder="Enter UPI ID"
                                            className="form-control mt-1"
                                            style={{height: "30px"}}
                                            onChange={(e)=>{dispatch(updateSettingsField({ acc_upiid: e.target.value}))}}
                                          />
                                        </div>
                                      </div>
                                    </div> 
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        
                      )}
                      {activeTab === "Invoice" && (
                       <Invoice data={settings}/>
                      )}
                      {activeTab === "Items" && (

                        <SettingsItem data={settings}/>
                      )}
                      {activeTab === "TaxesGST" && (
                       <TaxesGst data={settings}/>
                      )}
                      
                    </div>
                  </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Settings;
