import React from "react";
import { Link } from "react-router-dom";
import "./widget.css";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";

const Widget = ({ type, amount = 100,  title, link, path = "/", isMoney = false }) => {
  let data;

  // Define icon styles and titles based on `type`
  switch (type) {
    case "FPO":
      data = {
        icon: (
          <PersonOutlinedIcon
            className="icon"
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
            }}
          />
        ),
        showPercentage: true,
      };
      break;
    case "Stock":
      data = {
        icon: (
          <ShoppingCartOutlinedIcon
            className="icon"
            style={{
              backgroundColor: "rgba(218, 165, 32, 0.2)",
              color: "goldenrod",
            }}
          />
        ),
        showPercentage: true,
      };
      break;
    case "Sale":
      data = {
        icon: (
          <MonetizationOnOutlinedIcon
            className="icon"
            style={{ backgroundColor: "rgba(0, 128, 0, 0.2)", color: "green" }}
          />
        ),
        showPercentage: true,
      };
      break;
    case "Purchase":
      data = {
        icon: (
          <MonetizationOnOutlinedIcon
            className="icon"
            style={{ backgroundColor: "rgba(0, 128, 0, 0.2)", color: "green" }}
          />
        ),
        showPercentage: true,
      };
      break;
    case "Net Profit":
      data = {
        icon: (
          <AccountBalanceWalletOutlinedIcon
            className="icon"
            style={{
              backgroundColor: "rgba(128, 0, 128, 0.2)",
              color: "purple",
            }}
          />
        ),
        showPercentage: true,
      };
      break;
    case "Management Cost":
      data = {
        icon: (
          <AccountBalanceWalletOutlinedIcon
            className="icon"
            style={{
              backgroundColor: "rgba(128, 0, 128, 0.2)",
              color: "purple",
            }}
          />
        ),
        showPercentage: true,
      };
      break;
    case "Sundry Debtors":
    case "Sundry Creditors":
      data = {
        icon: (
          <PersonOutlinedIcon
            className="icon"
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
            }}
          />
        ),
        showPercentage: false,
      };
      break;
    default:
      data = { icon: null, showPercentage: false };
      break;
  }

  return (
    <div className="widget">
      <div className="left">
        <span className="title">{title || data?.title}</span>
        <span className="counter">
          {isMoney && "₹"} {amount?.toLocaleString()}
        </span>
        {link && (
          <Link to={path} className="link">
            {link}
          </Link>
        )}
      </div>
      <div className="right">
        {data.icon}
      </div>
    </div>
  );
};

export default Widget;
