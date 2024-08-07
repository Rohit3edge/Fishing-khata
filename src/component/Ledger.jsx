import React from "react";
import { NavLink } from "react-router-dom";
import Navbarside from "./Navbarside";
import Footer from "./Footer";
const Ledger = () => {
  return (
    <div>
      <div>
        <Navbarside />
        {/* {isLoading && <Loader/>} */}
        <div className="container-fluid pb-5 response-cover">
          <div className="row">
            <div className="col-lg-10 col-md-8">
            <nav className="sidebar-mini" id="side">
                        <ul className="nav-lists-min pt-1">
                          <li className="nav_items ">
                            <NavLink
                              to="/Home"
                              className="menu-title"
                              activeClassName="active"
                            >
                              TDS
                            </NavLink>
                          </li>
                          <li className="nav_items">
                            <NavLink to="/Enquiry" className="menu-title">
                              TCS
                            </NavLink>
                          </li>

                          <li className="nav_items">
                            <NavLink
                              to="/Weightmanagement"
                              className="menu-title"
                            >
                              IGST
                            </NavLink>
                          </li>
                          <li className="nav_items">
                            <NavLink to="/HealthCare" className="menu-title">
                              SGST
                            </NavLink>
                          </li>

                          <li className="nav_items">
                            <NavLink to="/Challenges" className="menu-title">
                              CGST
                            </NavLink>
                          </li>
                          <li className="nav_items">
                            <NavLink to="/Physiotherapy" className="menu-title">
                              Profit & Loss
                            </NavLink>
                          </li>
                          
                        </ul>
                      </nav>
              <div className="container-fluid pt-5">
                <div className="row">
                  <div className="col-xl-12 col-lg-12 col-md-6 col-12">
                    <div className="card">
                      

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
    </div>
  );
};

export default Ledger;
