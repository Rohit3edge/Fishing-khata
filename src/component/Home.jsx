import React, { useState } from "react";
import Navbarside from "../component/Navbarside";
import Featured from "./featured/Featured";
import Chart from "./chart/Chart";
import Footer from "./Footer";
import Widget from "./widget/widget";
function Home() {
  return (
    <div>
      <Navbarside />
      {/* {isLoading && <Loader/>} */}
      <div className="container-fluid pb-5 response-cover">
        <div className="row">
          <div className="col-lg-2 col-md-4" />
          <div className="col-lg-10 col-md-8">
            <div className="container-fluid pt-5">
              <div className="row">
                <div className="col-xl-12 col-lg-12 col-md-6 col-12">
                  <div className="card">
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
                      <Chart title="Last 6 Months (Revenue)" aspect={2 / 1} />
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

      <Footer />
    </div>
  );
}

export default Home;
