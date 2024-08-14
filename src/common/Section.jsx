import React, { useState, useRef, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import {useNavigate } from "react-router-dom";
import Table from "./Table";
import Pagination from "./Pagination"
// import Loader from "./Loader";
const Section = () => {
  const navigate = useNavigate();


  const [startDate, setstartDate] = useState("");
  const [endDate, setendDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorStart, setErrorStart] = useState("");
  const [errorEnd, setErrorEnd] = useState("");
  const tableRef = useRef(null);
  const [column, setColumn] = useState([
    { isHtml: false, name: "Date" },
    { isHtml: false, name: "Type" },
    { isAction: true, name: "Number" },
    { isHtml: true, name: "Dr" },
    { isAction: true, name: "Cr" },
    { isAction: true, name: "Closing balance" },
  ]);
  const [page, setpage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [row, setRow] = useState([]);

  const dispatch = useDispatch();
 

  const [data, setData] = useState([
    {
      Date: "2024-08-07",
      Type: "Debit",
      Number: "12345",
      Dr: "<span style='color:red;'>₹500</span>",
      Cr: null,
      "Closing balance": "₹4500",
    },
    {
      Date: "2024-08-06",
      Type: "Credit",
      Number: "67890",
      Dr: null,
      Cr: "₹1000",
      "Closing balance": "₹5000",
    },
    {
      Date: "2024-08-05",
      Type: "Debit",
      Number: "54321",
      Dr: "<span style='color:red;'>₹200</span>",
      Cr: null,
      "Closing balance": "₹4000",
    },
  ]);

  return (
    <div>
      <section className="form-section">
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="row">
            <div className="col-md-4 col-sm-12 pt-2">
              <p className="col-black" style={{ marginBottom: "2px" }}>
                From Date
              </p>
              <input
                type="date"
                placeholder="Enter the recipe name"
                value={startDate}
                onChange={(e) => setstartDate(e.target.value)}
                className="form-control"
              />
              {errorStart?.length > 0 && (
                <div className="text-danger">{errorStart}</div>
              )}
              <p className="alert-message"></p>
            </div>
            <div className="col-md-4 col-sm-12 pt-2">
              <p className="col-black" style={{ marginBottom: "2px" }}>
                To Date
              </p>
              <input
                type="date"
                placeholder="Enter the recipe name"
                value={endDate}
                onChange={(e) => setendDate(e.target.value)}
                className="form-control"
              />
              {errorEnd?.length > 0 && (
                <div className="text-danger">{errorEnd}</div>
              )}
              <p className="alert-message"></p>
            </div>
            <div className="col-md-4 col-sm-12 pt-2 mt-3">
              <button type="submit" className="btn top_nav_btn">
                Submit
              </button>
            </div>
          </div>
        </form>
      </section>

      <div className="card-body collapse show">
        <div className="card-block card-dashboard table-responsive">
          <Table columns={column} data={data} isFooter={true} />
          <div className="PaginationContainer">
                            <span className="total-elements">
                              Showing {parseInt(page)*10 +1 } to {parseInt(page)*10 +10 } of {totalCount} entries
                            </span>
                            <Pagination
                              currentPage={(parseInt(page)+1)}
                              totalCount={totalCount}
                              itemsPerPage={1}
                              onPageChange={(page)=>{"1"}}
                            />
                          </div>
        </div>
      </div>
    </div>
  );
};

export default Section;
