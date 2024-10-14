import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbarside from "../component/Navbarside";
import Featured from "./featured/Featured";
import Chart from "./chart/Chart";
import Footer from "./Footer";
import Widget from "./widget/widget";
function Home() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const Name = user?.data?.company_name;


  return (
    <div >
      <div class="row" style={{marginLeft:"0",marginRight:"0"}}>
        <Navbarside />
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
                <button type="submit" className="btn btn-default" onClick={() => navigate('/invoice')}>
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
                  <h2 className="main-content-title tx-24 mg-b-5">Dashboard</h2>
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="#">Home</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Dashboard
                    </li>
                  </ol>
                </div>
              </div>

              <div className="row">
                <div className="col-md-12">
                  <div className="card custom-card-home">
                    <div className="card-body">
                    <div className="container-fluid">
                      <div className="row">
                        <div className="col-xl-12 col-lg-12 col-md-6 col-12">
                          
                            <div
                              className="card-block pt-2 pb-0 d-flex"
                              style={{ gap: "15px" }}
                            >
                              <Widget type="user" />
                              <Widget type="order" />
                              <Widget type="earning" />
                              <Widget type="balance" />
                            </div>
                            <div className="charts">
                              <Featured />
                              <Chart
                                title="Last 6 Months (Revenue)"
                                aspect={2 / 1}
                              />
                            </div>
                            <div
                              id="Widget-line-chart"
                              className="height-70 lineChartWidget WidgetlineChart mb-2"
                            ></div>
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
      </div>
      <Footer />
    </div>
  );
}

export default Home;
