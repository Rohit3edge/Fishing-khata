import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbarside from "../Navbarside";
import { useDispatch, useSelector } from "react-redux";
import { Getsettings, Updatesettings } from "../../store/slices/settings";
import { updateSettingsField } from "../../store/slices/settings";
import Loader from "../../common/Loader"
import Invoice from "./Invoice";
import TaxesGst from "./TaxesGst";
import SettingsItem from "./SettingsItem";
import Footer from "../Footer";
const Settings = () => {
  const dispatch = useDispatch();
  const setting = useSelector((state) => state?.settings?.updatesettings);
  // const { data, loading, error } = useSelector((state) => state.settings);
  
  const user = JSON.parse(localStorage.getItem("user"));
  const Name = user?.data?.company_name;


  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("General");
  const [settings, setSettings] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  React.useEffect(() => {
    setIsLoading(true)
    dispatch(Getsettings())
      .unwrap()
      .then((data) => {
        setIsLoading(false)
       
        setSettings(data?.data);
      })
      .catch(({ message }) => {
        setIsLoading(false)
        alert(message);
      });
  }, [dispatch]);

  const item = setting;

  async function handleUpdatesettings() {
    try {
      setIsLoading(true)
      const data = await dispatch(Updatesettings(item)).unwrap();
      setIsLoading(false)
      const updatedSettings = await dispatch(Getsettings()).unwrap();
  
      alert(data?.message);
      setSettings(updatedSettings?.data);
    } catch (error) {
      setIsLoading(false)
      console.error(error.message);
    }
  }

  return (
    <div>
      <div class="row" style={{ marginLeft: "0", marginRight: "0" }}>
        <Navbarside />
        {isLoading && <Loader />}
        <div className="col-md-10">
          <div className="row top-header">
            <div className="col-md-7">
              <div className="company-name">
                {Name}
              </div>
            </div>
            <div className="col-md-5">
              <div className="d-flex justify-content-end">
                <button type="submit" className="btn btn-default" onClick={()=>navigate("/ledger")}>
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
                  <button
                    onClick={() => handleUpdatesettings()}
                    class="btn ripple btn-default"
                    type="button"
                  >
                    Save
                  </button>
                </div>
              </div>

              <div class="row">
                <div class="col-md-12">
                  <div class="card custom-card">
                    <div class="card-body">
                      <div class="settings-section">
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

                        <div class="tab-content">
                          {activeTab === "General" && (
                            <div class="">
                              <div class="row pt-2">
                                <div class="col-md-6 col-sm-12">
                                  <div class="form-group mt-3">
                                    <div class="d-flex justify-content-between align-items-center">
                                      <div class="d-flex align-items-center">
                                        <span>Round Off Total</span>
                                      </div>
                                      <div class="form-check form-switch pb-4">
                                        <input
                                          class="form-check-input"
                                          type="checkbox"
                                          checked={
                                            setting?.default_roundoff ??
                                            settings?.default_roundoff
                                          }
                                          onChange={(e) => {
                                            dispatch(
                                              updateSettingsField({
                                                default_roundoff:
                                                  e.target.checked,
                                              })
                                            );
                                          }}
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  <div class="form-group mt-3">
                                    <div class="d-flex justify-content-between align-items-center">
                                      <div class="d-flex align-items-center">
                                        <span>Currency</span>
                                      </div>
                                      <div>
                                        <select
                                          class="form-control form-control-sm"
                                          value={
                                            // !setting?.default_currency
                                            //   ? settings?.default_currency
                                            //   : setting?.default_currency

                                              setting?.default_currency ?? settings?.default_currency
                                          }
                                          onChange={(e) =>
                                            dispatch(
                                              updateSettingsField({
                                                default_currency:
                                                  e.target.value,
                                              })
                                            )
                                          }
                                        >
                                          <option value="₹">₹</option>
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
                          )}

                          {activeTab === "Account" && (
                            <div class="">
                              <div class="container">
                                <div class="row pt-4">
                                  <div class="col-md-6 col-sm-12">
                                    <div class="form-group">
                                      <div class="d-flex justify-content-start align-items-center">
                                        <div class="form-check form-switch">
                                          <input
                                            type="checkbox"
                                            
                                            checked={
                                              setting?.bank_upi_qrcode ??
                                              settings?.bank_upi_qrcode
                                            }
                                            onChange={(e) => {
                                              dispatch(
                                                updateSettingsField({
                                                  bank_upi_qrcode:
                                                    e.target.checked,
                                                })
                                              );
                                            }}
                                          />
                                        </div>
                                        <span class="ml-2">
                                          Print UPI QR Code on invoice
                                        </span>
                                      </div>
                                    </div>

                                    <div class="form-group mt-3">
                                      <div class="d-flex justify-content-start align-items-center">
                                        <div class="form-check form-switch">
                                          <input
                                            type="checkbox"
                                            
                                            checked={
                                              setting?.bank_account_details ??
                                              settings?.bank_account_details
                                            }
                                            onChange={(e) => {
                                              dispatch(
                                                updateSettingsField({
                                                  bank_account_details:
                                                    e.target.checked,
                                                })
                                              );
                                            }}
                                          />
                                        </div>
                                        <span class="ml-2">
                                          Print this Bank Account Details on
                                          invoices
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  <div class="col-md-6 col-sm-12">
                                    <h4>Manage Company Bank Detail</h4>
                                    <div class="card mt-3">
                                      <div class="card-body">
                                        <div class="row">
                                          <div class="col-md-6">
                                            <div class="form-group">
                                              <label
                                                for="accountHolderName"
                                                class="font-weight-normal"
                                              >
                                                Account Holder Name
                                              </label>
                                              <input
                                                type="text"
                                                class="form-control mt-1"
                                                id="accountHolderName"
                                                placeholder="Enter Account Holder Name"
                                              />
                                            </div>
                                          </div>
                                          <div class="col-md-6">
                                            <div class="form-group">
                                              <label
                                                for="bankName"
                                                class="font-weight-normal"
                                              >
                                                Bank Name
                                              </label>
                                              <input
                                                type="text"
                                                id="bankName"
                                                class="form-control mt-1"
                                                placeholder="Enter Bank Name"
                                              />
                                            </div>
                                          </div>
                                        </div>
                                        <div class="row">
                                          <div class="col-md-6">
                                            <div class="form-group">
                                              <label
                                                for="accountNumber"
                                                class="font-weight-normal"
                                              >
                                                Account Number
                                              </label>
                                              <input
                                                type="text"
                                                id="accountNumber"
                                                class="form-control mt-1"
                                                placeholder="Enter Account Number"
                                              />
                                            </div>
                                          </div>
                                          <div class="col-md-6">
                                            <div class="form-group">
                                              <label
                                                for="ifscCode"
                                                class="font-weight-normal"
                                              >
                                                IFSC Code
                                              </label>
                                              <input
                                                type="text"
                                                id="ifscCode"
                                                class="form-control mt-1"
                                                placeholder="Enter IFSC Code"
                                              />
                                            </div>
                                          </div>
                                        </div>
                                        <div class="row">
                                          <div class="col-md-6">
                                            <div class="form-group">
                                              <label
                                                for="upiId"
                                                class="font-weight-normal"
                                              >
                                                UPI ID
                                              </label>
                                              <input
                                                type="text"
                                                id="upiId"
                                                placeholder="Enter UPI ID"
                                                class="form-control mt-1"
                                              />
                                            </div>
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
                            <Invoice data={settings} />
                          )}
                          {activeTab === "Items" && (
                            <SettingsItem data={settings} />
                          )}
                          {activeTab === "TaxesGST" && (
                            <TaxesGst data={settings} />
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
