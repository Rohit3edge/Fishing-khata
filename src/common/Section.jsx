import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbarside from "../component/Navbarside";
import Loader from "./Loader";
const Section = () => {
  const [startDate, setstartDate] = useState("");
  const [endDate, setendDate] = useState("");
  const [isLoading, setIsLoading] =useState(false)
  const [errorStart, setErrorStart] = useState("");
  const [errorEnd, setErrorEnd] = useState("");
  const tableRef = useRef(null);

  const dispatch = useDispatch();
  const [data, setData] = useState([]);

  useEffect(()=>{
    const sData = dateForQuery().startDate
    const eDate = dateForQuery().endDate
    setstartDate(sData)
    setendDate(eDate)
    analysisData(sData,eDate)
  },[])





  return (
    <div>
      <Navbarside />
      {isLoading && <Loader/>}

      <div className="container-fluid pb-5 response-cover">
        <div className="row">
          <div className="col-lg-2 col-md-4" />
          <div className="col-lg-10 col-md-8">
            <div className="container-fluid pt-5">
              <div className="row">
                <div className="col-12">
                  <div className="card">
                    <div className="card-header">
                      <div className="card-title-wrap bar-success d-flex align-items-center">
                        <h4 className="card-title">Ledger</h4>
                      </div>
                    </div>
                    <section className="form-section">
                      <form onSubmit={(e)=>{e.preventDefault();analysisData(startDate,endDate)}}>
                        <div className="row">
                          <div className="col-md-4 col-sm-12 pt-2">
                            <p
                              className="col-black"
                              style={{ marginBottom: "2px" }}
                            >
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
                            <p
                              className="col-black"
                              style={{ marginBottom: "2px" }}
                            >
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
                            <button type="submit" className="btn btn-primary">
                              Submit
                            </button>
                          </div>
                        </div>
                      </form>
                    </section>

                    <div className="card-body collapse show">
                      <div className="card-block card-dashboard table-responsive">
                        {data !== "" && (
                          <div>
                            <button
                              onClick={onDownload}
                              className="btn btn-primary"
                            >
                              Export to Excel
                            </button>
                            <table
                              className="table table-striped table-bordered zero-configuration"
                              ref={tableRef}
                            >
                              <thead>
                                <tr>
                                  <th>Date</th>
                                  <th>Time</th>
                                  <th>Membership Plan Name</th>
                                  <th>User Name</th>
                                  <th>Invoice Number</th>
                                  <th>Invoice Amount</th>
                                  <th>Category</th>
                                  <th>Amount Received</th>
                                  <th>Payment Mode</th>
                                  <th>Gst</th>
                                  <th>Net Amount</th>
                                </tr>
                              </thead>

                              <tbody>
                                {data.map((dataVal, index) => (
                                  <tr>
                                    <td>
                                      {" "}
                                      {Moment(dataVal?.created_at).format(
                                        "DD-MM-YYYY"
                                      )}
                                    </td>
                                    <td>
                                      {Moment(dataVal?.created_at).format(
                                        "hh:mm A"
                                      )}
                                    </td>
                                    <td>{dataVal?.planName}</td>
                                    <td>
                                      {dataVal?.userId?.firstName}{" "}
                                      {dataVal?.userId?.lastName}
                                    </td>
                                    <td>{dataVal?.invoiceNumber}</td>
                                    <td>{dataVal?.grossAmount}</td>
                                    <td>{dataVal?.paymentFor}</td>
                                    <td>{dataVal?.grossAmount}</td>
                                    <td>{dataVal?.paymentType}</td>
                                    <td>{dataVal?.gstAmount}</td>
                                    <td>{dataVal?.netAmount}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
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
  );
};

export default Section;
