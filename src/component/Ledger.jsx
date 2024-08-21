import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LedgerList } from "../store/slices/ledger";
import Table from "../common/Table";
import Navbarside from "./Navbarside";
import Loader from "../common/Loader"
import Footer from "./Footer";
const Ledger = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [ledgerList, setLedgerList] = useState();
  const [activeIndex, setActiveIndex] = useState(0);

  const user = JSON.parse(localStorage.getItem("user"));
  const Name = user?.data?.company_name;


  const columns = [
    { name: "ID" },
    { name: "Date" },
    { name: "Type" },
    { name: "Number" },
    { name: "Dr" },
    { name: "Cr" },
    { name: "Closing Balance" },
  ];

  const data = [
    { ID: 1, Date: "2024-08-01", Type: "Invoice", Number: "101", Dr: "", Cr: "1000.0", "Closing Balance": "1000" },
    { ID: 2, Date: "2024-08-02", Type: "Payment", Number: "102", Dr: "500.0", Cr: "", "Closing Balance": "500" },
    { ID: 3, Date: "2024-08-03", Type: "Invoice", Number: "103", Dr: "", Cr: "1500.0", "Closing Balance": "2000" },
    { ID: 4, Date: "2024-08-04", Type: "Payment", Number: "104", Dr: "800.0", Cr: "", "Closing Balance": "1200" },
    { ID: 5, Date: "2024-08-05", Type: "Invoice", Number: "105", Dr: "", Cr: "2000.0", "Closing Balance": "3200" },
  ];

  React.useEffect(() => {
    setIsLoading(true)
    dispatch(LedgerList())
      .unwrap()
      .then((data) => {
        setIsLoading(false)
        setLedgerList(data?.data);
        console.log(data?.data);
      })
      .catch(({ message }) => {
        setIsLoading(false)
        alert(message);
      });
  }, [dispatch]);

  return (
    <div >
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
                <button
                  type="submit"
                  className="btn btn-default"
                  onClick={() => navigate("/ledger")}
                >
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
                  <h2 class="main-content-title tx-24 mg-b-5">Ledger</h2>
                  <ol class="breadcrumb">
                    <li class="breadcrumb-item">
                      <a href="#">Home</a>
                    </li>
                    <li class="breadcrumb-item active" aria-current="page">
                      List
                    </li>
                  </ol>
                </div>
                <div class="d-flex justify-content-end">
                  <a
                    class="btn ripple btn-default"
                    onClick={() => navigate("/addLedger")}
                  >
                    Add Ledger
                  </a>
                </div>
              </div>

              <div class="row">
                <div class="col-md-2">
                  <div class="card custom-card">
                    <div class="card-body p-2">
                      <ul class="ledger-list">
                        {ledgerList?.map((option, index) => (
                          <li key={index} onClick={() => setActiveIndex(index)}>
                            <a
                              href="#"
                              className={index === activeIndex ? "active" : ""}
                            >
                              {option?.ledger}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div class="col-md-10">
                  <div class="row">
                    <div class="col-md-12">
                      <div class="card custom-card">
                        <div class="card-body">
                          <div class="row">
                            <div class="col-md-4 form-inline">
                              <div class="form-group">
                                <label class="">From Date</label>
                                <input
                                  class="form-control"
                                  required=""
                                  type="date"
                                />
                              </div>
                            </div>
                            <div class="col-md-4 form-inline">
                              <div class="form-group">
                                <label class="">To Date</label>
                                <input
                                  class="form-control"
                                  required=""
                                  type="date"
                                />
                              </div>
                            </div>
                            <div class="col-md-3 form-inline">
                              <div class="form-group">
                                <button type="submit" class="btn btn-default">
                                  Submit
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Table columns={columns} data={data}/>
                  {/* <div class="row mt-3">
                    <div class="col-md-12">
                      <div class="card custom-card">
                        <div class="card-body">
                          <table
                            class="table table-bordered border-bottom"
                            id="example1"
                          >
                            <thead>
                              <tr>
                                <th>ID</th>
                                <th>Date</th>
                                <th>Type</th>
                                <th>Number</th>
                                <th>Dr</th>
                                <th>Cr</th>
                                <th>Closing Balance</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>1</td>
                                <td>2024-08-01</td>
                                <td>Invoice</td>
                                <td>101</td>
                                <td></td>
                                <td>1000.0</td>
                                <td>1000</td>
                              </tr>
                              <tr>
                                <td>2</td>
                                <td>2024-08-02</td>
                                <td>Payment</td>
                                <td>102</td>
                                <td>500.0</td>
                                <td></td>
                                <td>500</td>
                              </tr>
                              <tr>
                                <td>3</td>
                                <td>2024-08-03</td>
                                <td>Invoice</td>
                                <td>103</td>
                                <td></td>
                                <td>1500.0</td>
                                <td>2000</td>
                              </tr>
                              <tr>
                                <td>4</td>
                                <td>2024-08-04</td>
                                <td>Payment</td>
                                <td>104</td>
                                <td>800.0</td>
                                <td></td>
                                <td>1200</td>
                              </tr>
                              <tr>
                                <td>5</td>
                                <td>2024-08-05</td>
                                <td>Invoice</td>
                                <td>105</td>
                                <td></td>
                                <td>2000.0</td>
                                <td>3200</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div> */}
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

export default Ledger;
