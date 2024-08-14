import React from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Navbarside from "./Navbarside";
import Footer from "./Footer";
const Ledger = () => {
  const navigate = useNavigate();
  const links = [
    { to: "/Home", label: "TDS" },
    { to: "/Enquiry", label: "TCS" },
    { to: "/Weightmanagement", label: "IGST" },
    { to: "/HealthCare", label: "SGST" },
    { to: "/Challenges", label: "CGST" },
    { to: "/Physiotherapy", label: "Profit & Loss" },
  ];

  return (

    <div clssName="container-fluid">
      <div class="row" style={{marginLeft:"0",marginRight:"0"}}>
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
                            <h2 class="main-content-title tx-24 mg-b-5">Ledger</h2>
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><a href="#">Home</a></li>
                                <li class="breadcrumb-item active" aria-current="page">List</li>
                            </ol>
                        </div>
                        <div class="d-flex justify-content-end">
                            <a class="btn ripple btn-default"  onClick={()=>navigate("/addLedger")}>Add Ledger</a>
                        </div>
              </div>
              
              <div class="row">
                        <div class="col-md-2">
                            <div class="card custom-card">
                                <div class="card-body p-2">
                                    <ul class="ledger-list">
                                        <li><a href="#" class="active">TDS</a></li>
                                        <li><a href="#">TCS</a></li>
                                        <li><a href="#">IGST</a></li>
                                        <li><a href="#">SGST</a></li>
                                        <li><a href="#">CGST</a></li>
                                        <li><a href="#">Profit & Loss</a></li>
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
                                                        <input class="form-control" required="" type="date"/>
                                                    </div>
                                                </div>
                                                <div class="col-md-4 form-inline">
                                                    <div class="form-group">
                                                        <label class="">To Date</label>
                                                        <input class="form-control" required="" type="date"/>
                                                    </div>
                                                </div>
                                                <div class="col-md-3 form-inline">
                                                    <div class="form-group">
                                                        <button type="submit" class="btn btn-default">Submit</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div> 
                                </div> 
                            </div>

                            <div class="row mt-3">
                                <div class="col-md-12">
                                    <div class="card custom-card">
                                        <div class="card-body">
                                            <table class="table table-bordered border-bottom" id="example1">
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

export default Ledger;
