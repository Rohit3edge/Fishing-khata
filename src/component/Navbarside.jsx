import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, NavLink, Link } from "react-router-dom";
import {
  FaRecycle,
  FaRupeeSign,
  FaShoppingCart,
  FaAngleDown,
  FaBoxes,
  FaBuromobelexperte,
} from "react-icons/fa";
import {
  RiHomeGearFill,
  RiMentalHealthFill,
  RiBarChart2Fill,
} from "react-icons/ri";
import Cookies from 'js-cookie';
import { CgProfile } from "react-icons/cg";
import { CiBank } from "react-icons/ci";
import { GiWallet, GiNotebook } from "react-icons/gi";
import { IoSettings } from "react-icons/io5";
import { MdOutlineLogout } from "react-icons/md";
import { Getcompanybanks } from "../store/slices/bankbook";
import logo from "../img/logos/kisaankhatalogo.png";

const Navbarside = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [show, setShow] = useState("");
  const [selectedNav, setSelectedNav] = useState("Dashboard"); // State to manage selected NavLink
  const [bankData, setBankData] = useState();

  const open = () => {
    document.getElementById("side").classList.toggle("show");
  };

  const drop = () => {
    document.getElementById("usermenu").classList.toggle("showuser");
  };

  let data = JSON.parse(localStorage.getItem("user"));
  const name = data?.data?.name;


  const signOut = (e) => {

    localStorage.clear();
    Cookies.remove("user");
    navigate("/login");
  };

  React.useEffect(() => {
    dispatch(Getcompanybanks())
      .unwrap()
      .then((data) => {
        setBankData(data.data);
      })
      .catch(({ message }) => {
        alert(message);
      });
  }, [dispatch]);

  return (
    <>
      {/* Sidebar */}
      <div className="col-md-2 sidebar">
        <div className="row">
          <div className="col-12 text-center logo">
            <img src={logo} alt="logo" className="img-responsive" />
          </div>
        </div>
        <div className="row navbar">
          <nav className="sidebar" id="side">
            <ul className="nav-lists pt-1">
              <li className="nav_items top_item">
                <NavLink to="/" className="menu-title" activeClassName="active">
                  <RiHomeGearFill className="nav_icons" />
                  Dashboard
                </NavLink>
              </li>
              <li className="nav_items">
                <NavLink to="/FPOLifecycle" className="menu-title">
                  <FaRecycle className="nav_icons" />
                  FPO Lifecycle
                </NavLink>
              </li>
              <li className="nav_items">
                <p
                  className="menu-title"
                  onClick={() => {
                    setShow(show === "Sale" ? "" : "Sale");
                  }}
                >
                  <FaRupeeSign className="nav_icons" />
                  Sale
                  <FaAngleDown style={{ float: "right", fontSize: "0.9rem" }} />
                </p>
                {show === "Sale" && (
                  <ul className="submenu">
                    <li className="submenu-item">
                      <NavLink to="/invoicelist" className="menu-title">
                        Invoice
                      </NavLink>
                    </li>
                    <li className="submenu-item">
                      <NavLink to="/Sale/Submenu2" className="menu-title">
                        Quotation
                      </NavLink>
                    </li>
                    <li className="submenu-item">
                      <NavLink to="/Sale/Submenu2" className="menu-title">
                        Return/Cr. note
                      </NavLink>
                    </li>
                    <li className="submenu-item">
                      <NavLink to="/Sale/Submenu2" className="menu-title">
                        Delivery
                      </NavLink>
                    </li>
                    <li className="submenu-item">
                      <NavLink to="/invoicepaymentlist" className="menu-title">
                        Payment In
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>
              <li className="nav_items">
                <p
                  className="menu-title"
                  onClick={() => {
                    setShow(show === "Purchase" ? "" : "Purchase");
                  }}
                >
                  <FaShoppingCart className="nav_icons" />
                  Purchase
                  <FaAngleDown style={{ float: "right", fontSize: "0.9rem" }} />
                </p>
                {show === "Purchase" && (
                  <ul className="submenu">
                    <li className="submenu-item">
                      <NavLink to="/Sale/Submenu1" className="menu-title">
                        Purchase Bill
                      </NavLink>
                    </li>
                    <li className="submenu-item">
                      <NavLink to="/Sale/Submenu2" className="menu-title">
                        Purchase Order (PO)
                      </NavLink>
                    </li>
                    <li className="submenu-item">
                      <NavLink to="/Sale/Submenu2" className="menu-title">
                        Payment Out
                      </NavLink>
                    </li>
                    <li className="submenu-item">
                      <NavLink to="/Sale/Submenu2" className="menu-title">
                        Return/Dr. Note
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>
              <li className="nav_items">
                <NavLink to="/partymaster" className="menu-title">
                  <CgProfile className="nav_icons" />
                  Party Master
                </NavLink>
              </li>
              
              <li className="nav_items">
                <NavLink to="/ledger" className="menu-title">
                  <CgProfile className="nav_icons" />
                  Ledger
                </NavLink>
              </li>
              <li className="nav_items">
              <p
                  className="menu-title"
                  onClick={() => {
                    setShow(show === "Items" ? "" : "Items");
                  }}
                >
                  <FaShoppingCart className="nav_icons" />
                  Items
                  <FaAngleDown style={{ float: "right", fontSize: "0.9rem" }} />
                </p>
                {show === "Items" && (
                  <ul className="submenu">
                    <li className="submenu-item">
                      <NavLink to="/item" className="menu-title">
                        Item
                      </NavLink>
                    </li>
                    <li className="submenu-item">
                      <NavLink to="/categories" className="menu-title">
                      Categories
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>
              <li className="nav_items">
                <NavLink to="/Physiotherapy" className="menu-title">
                  <RiMentalHealthFill className="nav_icons" />
                  Journal
                </NavLink>
              </li>
              <li className="nav_items">
                <p
                  className="menu-title"
                  onClick={() => {
                    setShow(show === "BankBook" ? "" : "BankBook");
                  }}
                >
                  <CiBank className="nav_icons" />
                  Bank Book
                  <FaAngleDown style={{ float: "right", fontSize: "0.9rem" }} />
                </p>
                {show === "BankBook" && (
                  <ul className="submenu">
                    <li className="submenu-item">
                      <NavLink to="/addbank" className="menu-title">
                        Add Bank
                      </NavLink>
                    </li>
                    {bankData?.map((option, index) => (
                      <li className="submenu-item" key={index}>
                        <NavLink
                          to={{
                            pathname: `/bankbook/${option.id ? option.id : null}`  
                          }} 
                          className="menu-title text-uppercase"
                        >
                          {option.ledger}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
              <li className="nav_items">
                <NavLink to="/educate" className="menu-title">
                  <GiWallet className="nav_icons" />
                  Cash Book
                </NavLink>
              </li>
              <li className="nav_items">
                <NavLink to="/Experts" className="menu-title">
                  <RiBarChart2Fill className="nav_icons" />
                  Reports
                </NavLink>
              </li>
              <li className="nav_items">
                <NavLink to="/Corporate" className="menu-title">
                  <GiNotebook className="nav_icons" />
                  Registers
                </NavLink>
              </li>
              <li className="nav_items">
                <NavLink to="/settings" className="menu-title">
                  <IoSettings className="nav_icons" />
                  Settings
                </NavLink>
              </li>
              <li className="nav_items">
                <Link to="/login" onClick={signOut} className="menu-title">
                  <MdOutlineLogout className="nav_icons" />
                  Logout
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navbarside;
