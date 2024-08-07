import React, { Component } from "react";
import { Link } from "react-router-dom";
function Footer() {
  return (
    <footer className="footer footer-static footer-light" id="footer">
      <p className="">
        <span>
          Copyright &copy; 2024 | All rights reserved &nbsp;
          <Link
            to="https://healthonify.com/"
            id="pixinventLink"
            target="_blank"
            className="text-bold-800 primary darken-2"
          >
            Kisaan Khata Pvt Ltd
          </Link>
        </span>
      </p>
    </footer>
  );
}

export default Footer;
