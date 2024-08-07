import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { FcSettings } from "react-icons/fc";
import {
  FaBuromobelexperte,
  FaWeight,
  FaBoxes ,
  FaAngleDown,
  FaShoppingCart,
  FaRupeeSign
} from "react-icons/fa";
import { RiBarChart2Fill } from "react-icons/ri";
import { CiBank } from "react-icons/ci";
import { RiMentalHealthFill } from "react-icons/ri";
import { IoPersonCircle } from "react-icons/io5";
import { BiTestTube, BiAnalyse, BiPlanet } from "react-icons/bi";
import {
  MdHealthAndSafety,
  MdOutlineLogout,
  MdMeetingRoom,
  MdOutlineAccountBalance,
  MdAssessment,
} from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { ImLab, ImProfile } from "react-icons/im";
import { IoSettings } from "react-icons/io5";
import {
  GiWallet,
  GiTakeMyMoney,
  GiTestTubes,
  GiNotebook,
} from "react-icons/gi";
import {GrCycle } from "react-icons/gr";
import { FcFaq } from "react-icons/fc";
import { BsQuestionDiamondFill } from "react-icons/bs";
import { RiHomeGearFill } from "react-icons/ri";
import { Link, useNavigate, NavLink } from "react-router-dom";
import logo from "../img/logos/kisaankhatalogo.png";
// import { userDetails } from "./../store/slices/auth";
const Navbarside = () => {
  const dispatch = useDispatch();

  const open = () => {
    document.getElementById("side").classList.toggle("show");
  };

  const drop = () => {
    document.getElementById("usermenu").classList.toggle("showuser");
  };

  let data = JSON.parse(localStorage.getItem("user"));
  let role = data?.data?.roles[0];

  const navigate = useNavigate();

  function signOut(e) {
    localStorage.clear();
    navigate("/login");
  }
  const [details, setDetails] = useState("");
  const [topExpertise, settopExpertise] = useState("");
  // React.useEffect(() => {
  //   dispatch(userDetails())
  //     .unwrap()w
  //     .then((data) => {
  //       setDetails(data.user.data[0]);
  //       settopExpertise(data.user.data[0].topExpertise.name);
  //     })
  //     .catch(({ message }) => {
        
  //     });
  // }, [dispatch]);

  return (
    <div>
      <nav className="top_nav">
        <div className="top_nav_btn">
        <button
                  type="submit"
                 
                  className="btn btn-warning col-white submit-btn"
                >
                  Ledger
                </button>
                <button
                  type="submit"
                  
                  className="btn btn-purple col-white submit-btn"
                >
                  Sale
                </button>
                <button
                  type="submit"
                 
                  className="btn btn-success col-white submit-btn"
                >
                  Purchase
                </button>
        </div>
        <FcSettings className="setting animate-rotate " onClick={open} />
        <IoPersonCircle className="user-icon" onClick={drop} />
      </nav>

      <nav className="sidebar" id="side">
        <NavLink to="/">
          <div className="d-flex justify-content-center logo-section">
            <img src={logo} alt="healthonify" />
          </div>
        </NavLink>
        <ul className="nav-lists pt-1">
          <li className="nav_items top_item">
            <NavLink to="/" className="menu-title" activeClassName="active">
              <RiHomeGearFill className="nav_icons" />
              Dashboard
            </NavLink>
          </li>
          {/* super admin  menu start*/}
          {/* {role === "ROLE_SUPERADMIN" && (
            <li className="nav_items">
              <a href="/Enquiry" className="menu-title">
                <i className="far fa-comments fa-edit-icon"></i>&nbsp; General
                Enquiry
              </a>
            </li>
          )} */}

          
            <li className="nav_items">
              <NavLink to="/" className="menu-title">
                <GrCycle className="nav_icons" />
                FPO Lifecycle
              </NavLink>
            </li>
       
          
            <li className="nav_items">
              <NavLink to="/" className="menu-title">
                <FaRupeeSign className="nav_icons" />
                Sale
                <FaAngleDown style={{float:"right",fontSize:"22px"}}/>
              </NavLink>
              <ul className="submenu">
                <li className="submenu-item">
                  <NavLink to="/Sale/Submenu1" className="menu-title">
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
                  <NavLink to="/Sale/Submenu2" className="menu-title">
                  Payment In
                  </NavLink>
                </li>
              </ul>
            </li>
      
         
            <li className="nav_items">
              <NavLink to="/Fitness" className="menu-title">
                <FaShoppingCart className="nav_icons" />
                Purchase
                <FaAngleDown style={{float:"right",fontSize:"22px"}}/>
              </NavLink>
              <ul className="submenu">
                <li className="submenu-item">
                  <NavLink to="/Sale/Submenu1" className="menu-title">
                  Purchase Bill
                  </NavLink>
                </li>
                <li className="submenu-item">
                  <NavLink to="/Sale/Submenu2" className="menu-title">
                  Purchase Order(PO)
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
            </li>
     
        
            <li className="nav_items">
              <NavLink to="/Ledger" className="menu-title">
                <CgProfile  className="nav_icons" />
                Ledger
              </NavLink>
            </li>
      
         
            <li className="nav_items">
              <NavLink to="/Challenges" className="menu-title">
                <FaBoxes className="nav_icons" />
                Stock
              </NavLink>
            </li>
      
          
            <li className="nav_items">
              <NavLink to="/Physiotherapy" className="menu-title">
                <RiMentalHealthFill className="nav_icons" />
                Journal
              </NavLink>
            </li>
     
   
            <li className="nav_items">
              <NavLink to="/WomenSpecialSetting" className="menu-title">
                <CiBank className="nav_icons" />
                Bank Book
              </NavLink>
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
              <NavLink to="/Analysis" className="menu-title">
                <IoSettings className="nav_icons" />
                Settings
              </NavLink>
            </li>
   
                 
          <li className="nav_items">
            <Link to="/Login" onClick={signOut} className="menu-title ">
              <MdOutlineLogout className="nav_icons" />
              Logout
            </Link>
          </li>
        </ul>
      </nav>
      <div className="drop-user" id="usermenu">
        <ul className="user-p">
          <li className="user-text">
            <NavLink to="/profile">
              <FaBuromobelexperte className="user-icon-style-mod" />
              My Profile
            </NavLink>
          </li>

          <li className="user-text">
            <Link to="/Login" onClick={signOut}>
              <MdOutlineLogout className="user-icon-style-mod" />
              Logout
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbarside;
