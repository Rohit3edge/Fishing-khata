import React, { useState } from "react";
import Navbarside from "./Navbarside";
import { useDispatch, useSelector } from "react-redux";
import { Getledgergroups } from "../store/slices/ledger";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";

const AddLedger = () => {
  const dispatch = useDispatch();

  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [category, setCategory] = useState([]);
  const [name, setName] = useState("");
  const [labEmail, setLabEmail] = useState("");
  const [labMobileNo, setLabMobileNo] = useState("");
  const [address, setAddress] = useState("");
  const [agreement, setAgreement] = useState("");
  const navigate = useNavigate();
  //   const dispatch = useDispatch();
  const [checked, setChecked] = useState([]);
  const [servicechecked, setServiceChecked] = useState([]);
  const [long, setLong] = useState("");
  const [lat, setLat] = useState("");
  const [cityId, setcityId] = useState("");
  const [city, setCity] = useState("");
  const [stateId, setstateId] = useState("");
  const [state, setState] = useState("");
  const [ledgerGroups, setLedgerGroups] = useState([]);

  React.useEffect(() => {
    dispatch(Getledgergroups())
      .unwrap()
      .then((data) => {
        console.log(data);
        setLedgerGroups(data)
      })
      .catch(({ message }) => {
        alert(message);
      });
  }, [dispatch]);

const renderOptions = (groups, level = 0) => {
  return groups.map((group) => (
    <React.Fragment key={group.id}>
      <option value={group.id}>
        {"\u00A0".repeat(level * 4)} {/* This adds indentation based on the nesting level */}
        {group.group_name}
      </option>
      {group.children && group.children.length > 0 && renderOptions(group.children, level + 1)}
    </React.Fragment>
  ));
};

  return (
    <>
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
                  <h2 class="main-content-title tx-24 mg-b-5">AddLedger</h2>
                  <ol class="breadcrumb">
                    <li class="breadcrumb-item">
                      <a href="#">Home</a>
                    </li>
                    <li class="breadcrumb-item active" aria-current="page">
                    AddLedger
                    </li>
                  </ol>
                </div>
              
              </div>

              <div class="row">
                <div class="col-md-12">
                  <div class="card custom-card">
                    <div class="card-body p-5">
                    <section className="form-section ">
                        <form>
                          <div className="row">
                            <div className="col-md-3 col-sm-12 pt-2">
                              <p
                                className="col-black"
                                style={{ marginBottom: "2px" }}
                              >
                                Name
                              </p>
                              <input
                                type="text"
                                placeholder="Lab name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="form-control"
                              />
                              <p className="alert-message"></p>
                            </div>

                            <div className="col-md-3  col-sm-12 pt-2">
                              <div className="form-group">
                                <p
                                  className="col-black"
                                  style={{ marginBottom: "2px" }}
                                >
                                  Group Name
                                </p>
                                <select className="form-control" required>
                                  <option value="">Select</option>
                                  {renderOptions(ledgerGroups)}
                                  {/* <option value="">Equity Share Capital</option>
                                  <option value="">Reserve & Surplus</option>
                                  <option value="">Retained Earnings</option>
                                  <option value="">Current Liabilities</option>
                                  <option value="">Secured Loans</option> */}
                                </select>
                              </div>
                            </div> 
                            <div className="col-md-3 col-sm-12 pt-2">
                              <p
                                className="col-black"
                                style={{ marginBottom: "2px" }}
                              >
                                Date as Of
                              </p>
                              <input
                                type="date"
                                placeholder="Enter the recipe name"
                                // value={startDate}

                                className="form-control"
                              />
                              <p className="alert-message"></p>
                            </div>
                            <div className="col-md-3 col-sm-12 pt-2">
                              <p
                                className="col-black d-flex justify-content-between align-items-center"
                                style={{ marginBottom: "2px" }}
                              >
                                Amount
                                <div className="input-group-append ml-2">
                                  <div className="form-check form-check-inline">
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      name="transactionType"
                                      id="credit"
                                      value="cr"
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor="credit"
                                    >
                                      Cr
                                    </label>
                                  </div>
                                  <div className="form-check form-check-inline">
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      name="transactionType"
                                      id="debit"
                                      value="dr"
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor="debit"
                                    >
                                      Dr
                                    </label>
                                  </div>
                                </div>
                              </p>
                              <div className="input-group">
                                <div className="input-group-prepend">
                                  <span className="input-group-text">₹</span>
                                </div>
                                <input
                                  type="text"
                                  placeholder="Enter the amount"
                                  className="form-control"
                                />
                              </div>
                              <p className="alert-message"></p>
                            </div>
                          </div>     
                          <div className="form-actions center d-flex justify-content-center align-content-center mt-4">
                            <button type="submit" className="btn btn-default">
                              Save
                            </button>
                            &nbsp; &nbsp; &nbsp;
                            <button type="reset" className="btn btn-warning btn-cancel">
                            Discard
                            </button>
                          </div>
                        </form>
                      </section>
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
    </>
  );
};

export default AddLedger;
