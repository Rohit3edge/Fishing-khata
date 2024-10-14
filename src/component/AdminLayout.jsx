// AdminLayout.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbarside from "../component/Navbarside";
import Footer from "./Footer";
import { IoReorderThree } from "react-icons/io5";

const AdminLayout = ({ children }) => {
    const [isSidebarVisible, setIsSidebarVisible] = useState(true); // State to manage sidebar visibility
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setIsSidebarVisible(prevState => !prevState); // Toggle the sidebar visibility
    };

    const user = JSON.parse(localStorage.getItem("user"));
    const Name = user?.data?.company_name;

  return (

    <div className="admin-layout">
      <div className="row" style={{ marginLeft: "0", marginRight: "0" }}>

          {isSidebarVisible && <Navbarside />}
        <div className={isSidebarVisible ? "col-md-10" : "col-md-12"}>
            <div className="row top-header">
            <div className="col-md-1">
               <a type="submit" onClick={toggleSidebar}>
                   <IoReorderThree style={{ fontSize: "40px", }} />
                </a>
                </div>
                <div className="col-md-6">
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
          {children}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminLayout;
